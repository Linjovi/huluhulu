import React, { useState } from 'react';
import { X, BookOpen, CloudFog, Sunrise, Lightbulb, ShieldAlert, Sliders } from 'lucide-react';

interface ObservationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ObservationGuideModal: React.FC<ObservationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTopic, setActiveTopic] = useState<'cloud_sea' | 'glow' | 'camera'>('cloud_sea');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="guide-modal"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">天象气象成因与摄影指南</h2>
              <p className="text-xs text-slate-500">掌握气象规律，精准预判每一次云海与火烧云</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold px-4 pt-2 bg-slate-50/70 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTopic('cloud_sea')}
            className={`pb-2.5 px-3 border-b-2 transition shrink-0 flex items-center gap-1.5 ${
              activeTopic === 'cloud_sea'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CloudFog className="w-4 h-4" />
            <span>云海形成物理机制</span>
          </button>

          <button
            onClick={() => setActiveTopic('glow')}
            className={`pb-2.5 px-3 border-b-2 transition shrink-0 flex items-center gap-1.5 ${
              activeTopic === 'glow'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sunrise className="w-4 h-4" />
            <span>朝霞与火烧云秘诀</span>
          </button>

          <button
            onClick={() => setActiveTopic('camera')}
            className={`pb-2.5 px-3 border-b-2 transition shrink-0 flex items-center gap-1.5 ${
              activeTopic === 'camera'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>摄影参数与装备速查</span>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed scrollbar-thin scrollbar-thumb-slate-300">
          {activeTopic === 'cloud_sea' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-sky-600" />
                  什么是高山云海的“气象黄金公式”？
                </h4>
                <p>
                  云海本质是山地低层层积云或强辐射雾：
                  <strong>【近地高湿（&gt;80%）+ 谷底微风（&lt;15km/h）+ 逆温层压制 + 高空晴朗少云】</strong>。
                </p>
              </div>

              <div className="space-y-2 text-slate-700">
                <h5 className="font-bold text-slate-900">1. 雨后初晴是最佳抓手</h5>
                <p>
                  尤其是降雨刚停或冷空气南下后的第一个清晨，山谷植被蒸腾大量水汽，在夜间剧烈辐射降温下迅速凝聚成浓厚雾毯。
                </p>

                <h5 className="font-bold text-slate-900">2. 海拔高差是分水岭</h5>
                <p>
                  低云顶高度通常在海拔 600m - 1400m 之间。观测者所在的山峰海拔必须高于云层顶部，才能俯瞰波涛翻滚的云浪；若身处云层内部，则只见大雾遮目。
                </p>

                <h5 className="font-bold text-slate-900">3. 最佳观测时段</h5>
                <p>
                  日出前后 1-2 小时是黄金期。太阳升起后，地表升温破坏逆温层，云海往往在上午 9 点后逐渐消散或抬升为普通积云。
                </p>
              </div>
            </div>
          )}

          {activeTopic === 'glow' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-rose-600" />
                  火烧云与绚丽霞光的物理条件
                </h4>
                <p>
                  朝晚霞源自阳光穿过极长大气路径时的<strong>瑞利散射</strong>（蓝紫光被散射尽，红橙长波长光线照亮云底）。
                </p>
              </div>

              <div className="space-y-2 text-slate-700">
                <h5 className="font-bold text-slate-900">1. 地平线“光路通道”必须通畅</h5>
                <p>
                  朝霞看<strong>东面低空</strong>，晚霞看<strong>西面低空</strong>。如果地平线有厚重低云遮挡，落日余晖在射入天空前就会被完全截断，天色将瞬间转灰暗。
                </p>

                <h5 className="font-bold text-slate-900">2. “天幕投影幕布”的云量最佳区间：30% ~ 70%</h5>
                <p>
                  如果高空万里无云，只有单调渐变；若中高云层达 100% 且密不透风，光线无法透入。透光的高积云、卷积云是最好的“天空荧幕”。
                </p>

                <h5 className="font-bold text-slate-900">3. 火烧云的三段演变</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>日落前 10 分钟</strong>：金黄明亮阶段，地景拉出长长金光。</li>
                  <li><strong>日落后 5 ~ 15 分钟</strong>：真正的火烧云爆发巅峰！红橙色彩最浓郁饱满。</li>
                  <li><strong>日落后 20 ~ 35 分钟</strong>：蓝调紫霞阶段，天顶深蓝与天边粉紫交织。</li>
                </ul>
              </div>
            </div>
          )}

          {activeTopic === 'camera' && (
            <div className="space-y-3.5">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700 border border-slate-200">
                  <thead className="bg-slate-50 text-slate-800">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200">景观类型</th>
                      <th className="p-2.5 border-b border-slate-200">推荐镜头焦段</th>
                      <th className="p-2.5 border-b border-slate-200">曝光参数参考</th>
                      <th className="p-2.5 border-b border-slate-200">滤镜与配件</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-bold text-sky-700">云海</td>
                      <td className="p-2.5">16-35mm 广角 / 70-200mm 长焦</td>
                      <td className="p-2.5 font-mono">f/8-f/11, ISO 100, 1/125s 或慢门丝绢流云(10-30s)</td>
                      <td className="p-2.5">ND64/ND1000 减光镜、CPL偏振镜</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-700">朝霞/晚霞</td>
                      <td className="p-2.5">24-70mm 标准变焦 / 超广角</td>
                      <td className="p-2.5 font-mono">f/8, ISO 100, 曝光补偿 -0.7EV (压暗保色彩)</td>
                      <td className="p-2.5">软渐变灰滤镜 (Soft GND 0.9)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  安全出行提示：高山清晨与傍晚气温较低，风力较大，尤其是安吉天池、临安太子尖等高海拔处。请备齐防风保暖外套、手电筒或头灯。
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
