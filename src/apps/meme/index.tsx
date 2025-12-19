import React, { useState, useRef } from "react";
import { MemeCatAvatar, ArrowLeftIcon } from "../../common/components/Icons";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Download,
  RotateCcw,
} from "lucide-react";

type StyleType = "cartoon" | "realistic";

const MemeApp: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState<StyleType>("cartoon");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("图片大小不能超过 5MB 喵~");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError(null);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(0);
    setError(null);
    setGeneratedImage(null);

    let hasResult = false;

    try {
      const response = await fetch("/api/meme-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          style,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("生成失败了喵~");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to read response stream");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            if (jsonStr === "[DONE]") break;

            try {
              const data = JSON.parse(jsonStr);

              if (data.status === "running") {
                // Update progress
                if (data.progress) {
                  setProgress(Math.round(data.progress));
                }
              } else if (data.status === "succeeded") {
                if (
                  data.results &&
                  data.results.length > 0 &&
                  data.results[0].url
                ) {
                  setGeneratedImage(data.results[0].url);
                  hasResult = true;
                } else if (data.base64Image) {
                  setGeneratedImage(
                    `data:image/jpeg;base64,${data.base64Image}`
                  );
                  hasResult = true;
                } else if (data.data?.base64Image) {
                  setGeneratedImage(
                    `data:image/jpeg;base64,${data.data.base64Image}`
                  );
                  hasResult = true;
                }
                setProgress(100);
              } else if (data.status === "failed") {
                throw new Error(data.failure_reason || "生成失败了喵~");
              }

              // Fallback for non-standard streaming responses or direct completion
              if (!hasResult) {
                if (data.base64Image) {
                  setGeneratedImage(
                    `data:image/jpeg;base64,${data.base64Image}`
                  );
                  hasResult = true;
                  setProgress(100);
                } else if (data.data?.base64Image) {
                  setGeneratedImage(
                    `data:image/jpeg;base64,${data.data.base64Image}`
                  );
                  hasResult = true;
                  setProgress(100);
                }
              }
            } catch (e) {
              console.error("Error parsing stream data", e);
            }
          }
        }
      }

      if (!hasResult) {
        throw new Error("生成失败，未获取到结果喵~");
      }
    } catch (err: any) {
      setError(err.message || "网络出了点小差错，请稍后再试喵~");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setGeneratedImage(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 px-4 py-3 shadow-sm flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <span className="font-bold text-lg text-gray-800">表情包生成器</span>
      </div>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {!image ? (
          // Upload State
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <MemeCatAvatar className="w-32 h-32 relative z-10" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                制作你的专属表情包
              </h2>
              <p className="text-gray-500">上传照片，一键生成可爱搞怪表情</p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              上传照片
            </button>
          </div>
        ) : (
          // Editor / Result State
          <div className="flex flex-col space-y-6">
            {/* Image Preview Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden relative min-h-[300px] flex items-center justify-center">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated Meme"
                  className="w-full h-auto"
                />
              ) : (
                <img
                  src={image}
                  alt="Original"
                  className="w-full h-full object-contain max-h-[400px]"
                />
              )}

              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <MemeCatAvatar className="w-16 h-16 animate-bounce mb-4" />
                  <p className="text-green-600 font-bold animate-pulse mb-4">
                    正在施展魔法中...
                  </p>

                  {/* Progress Bar */}
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                    <div
                      className="h-full bg-green-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {progress > 0 && (
                    <span className="text-xs text-gray-400 mt-2">
                      {progress}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {!generatedImage ? (
              // Controls
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                  <label className="text-sm font-bold text-gray-500 mb-3 block">
                    选择风格
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStyle("cartoon")}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        style === "cartoon"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl">🎨</span>
                      <span className="font-bold text-sm">卡通版</span>
                    </button>
                    <button
                      onClick={() => setStyle("realistic")}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        style === "realistic"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl">📸</span>
                      <span className="font-bold text-sm">写实版</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-full font-bold hover:bg-gray-200 transition-colors"
                  >
                    重选照片
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-[2] bg-green-500 text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    立即生成
                  </button>
                </div>
              </div>
            ) : (
              // Result Actions
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  再来一张
                </button>
                <button
                  onClick={() => {
                    // Create a temporary link to download
                    const link = document.createElement("a");
                    link.href = generatedImage;
                    link.download = `meme-${Date.now()}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex-[2] bg-black text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  保存图片
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default MemeApp;
