import React, { useState } from 'react';

interface CatComfortProps {
  /** 日记内容 */
  diaryContent: string;
  /** 日记日期 */
  diaryDate?: string;
}

/**
 * 猫猫互动组件
 * 包含气泡入口和弹窗
 */
export const CatComfort: React.FC<CatComfortProps> = ({ diaryContent, diaryDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [catMessage, setCatMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 获取猫猫回复
  const fetchCatReply = async () => {
    if (catMessage) return; // 已经有回复了，不再重复请求
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/diary/cat-comfort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: diaryContent,
          date: diaryDate 
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setCatMessage(data.data.message);
      } else {
        setError(data.error || '猫猫走丢了喵~');
      }
    } catch (err) {
      setError('网络出了问题，猫猫联系不上喵~');
    } finally {
      setIsLoading(false);
    }
  };

  // 点击气泡
  const handleBubbleClick = () => {
    setIsOpen(true);
    fetchCatReply();
  };

  // 关闭弹窗
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 猫猫气泡入口 */}
      <div 
        className="fixed bottom-20 right-6 z-20 cursor-pointer group"
        onClick={handleBubbleClick}
      >
        <div className="relative">
          {/* 气泡提示 */}
          <div className="
            absolute bottom-full right-0 mb-2
            bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2
            shadow-lg shadow-teal-100/50 border border-teal-100
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
            whitespace-nowrap
          ">
            <span className="text-teal-600 text-sm font-light">点我聊聊喵~</span>
            {/* 小三角 */}
            <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/90" />
          </div>
          
          {/* 猫猫图标 */}
          <div className="
            w-14 h-14 rounded-full
            bg-gradient-to-br from-amber-100 to-orange-100
            shadow-lg shadow-orange-100/50
            flex items-center justify-center
            transform group-hover:scale-110 transition-transform duration-300
            border-2 border-white/50
          ">
            <span className="text-2xl">🐱</span>
          </div>
          
          {/* 呼吸动画光圈 */}
          <div className="
            absolute inset-0 rounded-full
            bg-amber-200/30
            animate-ping
          " style={{ animationDuration: '2s' }} />
        </div>
      </div>

      {/* 弹窗 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={handleClose}
        >
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* 弹窗内容 */}
          <div 
            className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-teal-100/50 border border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
            
            {/* 猫猫头像 */}
            <div className="flex justify-center mb-4">
              <div className="
                w-20 h-20 rounded-full
                bg-gradient-to-br from-amber-100 to-orange-100
                shadow-lg shadow-orange-100/50
                flex items-center justify-center
                border-2 border-white/50
              ">
                <span className="text-4xl">🐱</span>
              </div>
            </div>
            
            {/* 内容区域 */}
            <div className="text-center">
              {isLoading ? (
                <div className="py-8">
                  <div className="text-3xl mb-3 animate-bounce">🐾</div>
                  <p className="text-teal-400 font-light">猫猫正在读日记喵~</p>
                </div>
              ) : error ? (
                <div className="py-4">
                  <div className="text-3xl mb-3">😿</div>
                  <p className="text-gray-500 font-light">{error}</p>
                  <button
                    onClick={fetchCatReply}
                    className="mt-4 px-4 py-2 bg-teal-100 text-teal-600 rounded-full text-sm hover:bg-teal-200 transition-colors"
                  >
                    再试一次喵~
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  {/* 对话气泡 */}
                  <div className="
                    bg-gradient-to-br from-teal-50 to-cyan-50
                    rounded-2xl px-5 py-4
                    border border-teal-100
                    mb-4
                  ">
                    <p className="text-teal-700 leading-relaxed font-light">
                      {catMessage}
                    </p>
                  </div>
                  
                  {/* 猫猫动作 */}
                  <div className="text-2xl animate-pulse">
                    💕
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CatComfort;
