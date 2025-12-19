import { safeParseJSON } from "../utils";

export async function onRequestPost(context: any) {
  const req = context.request;

  try {
    const { image, style, stream } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "请上传图片",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let prompt = "";
    if (style === "cartoon") {
      prompt = `以这张图片的主体为主角，制作九宫格的表情包。纯白色背景。卡通风格。需包含6-9个生动夸张的表情和动作（如：震惊、大笑、委屈、疑惑、暗中观察等）。画面精致，可爱搞怪，极具表现力。`;
    } else {
      // Realistic
      prompt = `以这只猫为主角，制作九宫格的表情包`;
    }

    const url = "https://api.grsai.com/v1/draw/nano-banana";
    const apiKey = context.env.GRSAI_API_KEY;

    if (!apiKey) {
      throw new Error("GRSAI_API_KEY is not set");
    }

    const payload = {
      model: "nano-banana-pro",
      prompt,
      urls: [image],
      aspectRatio: "1:1", // Memes are often square, or maybe auto? Let's try 1:1 or auto. Compliment uses auto.
      imageSize: "2K",
      stream: stream,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (stream) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();

        // Wrap JSON response in SSE format
        const encoder = new TextEncoder();
        writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        writer.write(encoder.encode(`data: [DONE]\n\n`));
        writer.close();

        return new Response(readable, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }

      // Pass through the streaming response directly
      // If the upstream API returns standard SSE, we can just pipe it.
      // We wrap it in a new Response to ensure headers are correct for the client.
      const { readable, writable } = new TransformStream();

      // If the upstream response body is null, we can't stream.
      if (!response.body) {
        throw new Error("Upstream response has no body for streaming");
      }

      response.body.pipeTo(writable).catch((err) => {
        console.error("Stream pipe error:", err);
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error ${response.status}: ${errText}`);
    }

    const result = await response.json();
    let base64Image = null;
    if (result.base64Image) {
      base64Image = result.base64Image;
    } else if (result.data && result.data.base64Image) {
      base64Image = result.data.base64Image;
    }

    if (!base64Image) {
      throw new Error("生成失败，返回数据格式不正确");
    }

    return new Response(
      JSON.stringify({
        code: 0,
        message: "Success",
        data: { base64Image },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Meme Gen API Error:", error);
    return new Response(
      JSON.stringify({
        code: 500,
        message: error.message || "表情包生成出错了，稍后再试喵~",
      }),
      { status: 500 }
    );
  }
}
