import React from "react";
import { MemeCatAvatar, ArrowLeftIcon } from "../../common/components/Icons";
import { useNavigate } from "react-router-dom";

const MemeApp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4">
      {/* Main Content Placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <MemeCatAvatar className="w-32 h-32 relative z-10" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">功能建设中...</h2>
          <p className="text-gray-500">
            猫猫工程师正在连夜赶工开发表情包制作功能
          </p>
          <p className="text-gray-400 text-sm">敬请期待喵~ 🐱</p>
        </div>

        <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-green-100 mt-8">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>✨</span> 预计功能
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                1
              </span>
              <span>上传图片一键生成表情包</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                2
              </span>
              <span>海量热门梗图模板</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                3
              </span>
              <span>自定义文字和特效</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemeApp;
