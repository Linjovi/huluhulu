import React from "react";
import { Settings2, Loader2, Wand2, ImagePlus, X } from "lucide-react";

interface ControlPanelProps {
  selectedPreset: string | null;
  setSelectedPreset: (preset: string | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  onGenerate: () => void;
  defaultPresets: Array<{ title: string }>;
  imageLoaded: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  backgroundImage?: string | null;
  setBackgroundImage?: (image: string | null) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedPreset,
  setSelectedPreset,
  prompt,
  setPrompt,
  loading,
  onGenerate,
  defaultPresets,
  imageLoaded,
  textareaRef,
  backgroundImage,
  setBackgroundImage,
}) => {
  const bgInputRef = React.useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setBackgroundImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-t-[32px] -mt-6 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col backdrop-blur-sm">
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24 scrollbar-hide">
        {/* Style Grid */}
        <div className="mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {defaultPresets.map(
                (preset) => (
                  <button
                    key={preset.title}
                    onClick={() =>
                      setSelectedPreset(
                        selectedPreset === preset.title ? null : preset.title
                      )
                    }
                    className={`relative px-4 py-2.5 rounded-full text-xs font-bold border transition-all duration-200 flex items-center justify-center text-center ${
                      selectedPreset === preset.title
                        ? "bg-gray-900 text-white border-transparent shadow-md transform scale-[1.02]"
                        : "bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    {preset.title}
                  </button>
                )
              )}
            </div>

            {/* Background Image Upload for "更换背景" */}
            {selectedPreset === "更换背景" && setBackgroundImage && (
              <div className="animate-fade-in-up">
                <label className="text-xs font-bold text-gray-900 mb-2 block">
                  上传背景图
                </label>
                {backgroundImage ? (
                  <div className="relative w-full h-32 rounded-2xl overflow-hidden group border border-gray-100">
                    <img
                      src={backgroundImage}
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setBackgroundImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => bgInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <ImagePlus size={24} />
                    <span className="text-xs">点击上传背景</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={bgInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleBgUpload}
                />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold text-gray-900">补充细节</label>
            <span
              className={`text-[10px] font-medium ${
                prompt.length > 180 ? "text-red-500" : "text-gray-400"
              }`}
            >
              {prompt.length}/200
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="想要画面更亮一点？或者是某种特殊的氛围？在这里告诉我..."
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none resize-none text-sm h-32 text-gray-800 transition-all placeholder:text-gray-400 shadow-sm"
          />
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      {imageLoaded && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-20 pb-8">
          <button
            onClick={onGenerate}
            disabled={(!prompt.trim() && !selectedPreset) || loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-[20px] shadow-xl shadow-gray-200 hover:shadow-2xl disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 text-[15px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                <span>正在施展魔法...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                {!prompt.trim() && !selectedPreset ? "请选择效果" : "开始生成"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

