import {
  createGrsaiClient,
  safeParseJSON,
  getComplimentStylePrompt,
} from "../utils";

export async function onRequestPost(context: any) {
  const req = context.request;

  try {
    const { image, prompt, mimeType, outputSize, style, stream } = await req.json();

    let finalPrompt = prompt;
    if (style) {
      const cachedPrompt = getComplimentStylePrompt(style);
      if (cachedPrompt) {
        finalPrompt = `${cachedPrompt}，${prompt || ""}`;
      } else {
        // Fallback: use style title itself
        finalPrompt = `请参考“${style}”的风格，对这张照片进行风格化调整。${
          prompt || ""
        }`;
      }
    }

    if (!image || (!finalPrompt && !style)) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: "No image or prompt provided",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const openai = createGrsaiClient(context.env);
    // User requested "nano-banana-fast"
    const modelId = "nano-banana-fast";

    const systemInstruction = `
Role: You are an Expert AI Image Editor.
Task: Edit the supplied image according to the user's detailed instruction.
Guidelines:
1. **Professional Quality**: Ensure the edited result is photorealistic, high-resolution, and visually stunning.
2. **Precise Execution**: Follow the user's request exactly. If they ask for a specific change (e.g., "remove background"), do it cleanly.
3. **Preserve Details**: Maintain the original identity, lighting, and style of the key subjects unless explicitly asked to change them.
4. **Enhancement**: If the user's instruction is vague (e.g., "make it better"), apply professional color grading, lighting adjustments, and subtle beauty enhancements to create a magazine-quality photo.
Output: You must return a JSON object containing the 'base64Image' of the edited result.
    `;

    const messages: any[] = [
      { role: "system", content: systemInstruction },
      {
        role: "user",
        content: [
          { type: "text", text: `Instruction: ${finalPrompt}` },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType || "image/jpeg"};base64,${image}`,
            },
          },
        ],
      },
    ];

    if (stream) {
      const streamResponse = await openai.chat.completions.create({
        model: modelId,
        messages: messages,
        stream: true,
        response_format: { type: "json_object" },
      });

      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      (async () => {
        try {
          for await (const chunk of streamResponse) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          await writer.write(encoder.encode("data: [DONE]\n\n"));
        } catch (e) {
          console.error("Streaming error:", e);
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`
            )
          );
        } finally {
          await writer.close();
        }
      })();

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming mode
    const completion = await openai.chat.completions.create({
      model: modelId,
      messages: messages,
      stream: false,
      response_format: { type: "json_object" },
    });

    console.log("completion", completion.choices[0]);
    
    let result: any = {};
    const content = completion.choices[0].message.content;

    if (content) {
      try {
        result = safeParseJSON(content);
      } catch (e) {
        // Ignore parse error
        console.error("JSON parse error:", e);
      }
    }

    if (!result || !result.base64Image) {
      console.error("Model did not return image bytes.");
      throw new Error("修图失败，喵喵尽力了但没法直接生成图片数据喵~");
    }

    return new Response(
      JSON.stringify({
        code: 0,
        message: "Success",
        data: result,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Edit API Error:", error);
    return new Response(
      JSON.stringify({
        code: 500,
        message: error.message || "修图喵出错了，稍后再试喵~",
      }),
      { status: 500 }
    );
  }
}
