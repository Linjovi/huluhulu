import React, { useState } from 'react';
import { HourlyWeatherData, PhenomenonType } from '../types';
import {
  Layers,
  Cloud,
  Sun,
  Droplets,
  Wind,
  Eye,
  Footprints,
  Sparkles,
  Sunset,
  Sunrise,
  Compass,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SkyTimelineProps {
  hourly: HourlyWeatherData;
  targetDate: string; // YYYY-MM-DD
  sunriseTime: string;
  sunsetTime: string;
  activePhenomenon: PhenomenonType;
}

export const SkyTimeline: React.FC<SkyTimelineProps> = ({
  hourly,
  targetDate,
  sunriseTime,
  sunsetTime,
  activePhenomenon,
}) => {
  const dayIndices: number[] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    if (hourly.time[i].startsWith(targetDate)) {
      dayIndices.push(i);
    }
  }

  // Default selected hour based on phenomenon
  const getDefaultIndex = () => {
    if (dayIndices.length === 0) return 0;
    if (activePhenomenon === 'travel_weather') {
      // 10:00 AM
      const idx10 = dayIndices.find((i) => hourly.time[i]?.includes('T10:00'));
      return idx10 !== undefined ? idx10 : dayIndices[Math.min(10, dayIndices.length - 1)];
    }
    if (activePhenomenon === 'sunrise' || activePhenomenon === 'sunrise_glow' || activePhenomenon === 'cloud_sea') {
      // Near sunrise hour
      const sunriseHourPrefix = sunriseTime.substring(0, 2);
      const srIdx = dayIndices.find((i) =>
        hourly.time[i]?.split('T')[1]?.startsWith(sunriseHourPrefix)
      );
      return srIdx !== undefined ? srIdx : dayIndices[Math.min(6, dayIndices.length - 1)];
    }
    if (activePhenomenon === 'sunset_glow') {
      // Near sunset hour
      const sunsetHourPrefix = sunsetTime.substring(0, 2);
      const ssIdx = dayIndices.find((i) =>
        hourly.time[i]?.split('T')[1]?.startsWith(sunsetHourPrefix)
      );
      return ssIdx !== undefined ? ssIdx : dayIndices[Math.min(18, dayIndices.length - 1)];
    }
    return dayIndices.length > 8 ? dayIndices[8] : dayIndices[0];
  };

  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(getDefaultIndex);

  // Sync default selection whenever target date or phenomenon changes to avoid UI flicker or lost selection
  React.useEffect(() => {
    setSelectedHourIdx(getDefaultIndex());
  }, [targetDate, activePhenomenon, sunriseTime, sunsetTime]);

  if (dayIndices.length === 0) return null;

  const activeIdx = dayIndices.includes(selectedHourIdx)
    ? selectedHourIdx
    : (getDefaultIndex() ?? dayIndices[0] ?? 0);
  const activeTimeStr = hourly.time[activeIdx]?.split('T')[1]?.substring(0, 5) || '12:00';
  const activeHourNum = parseInt(activeTimeStr.split(':')[0], 10);
  const activeTemp = hourly.temperature_2m?.[activeIdx];
  const activeHumidity = hourly.relative_humidity_2m?.[activeIdx];
  const activeWind = hourly.wind_speed_10m?.[activeIdx];
  const activePrecipProb = hourly.precipitation_probability?.[activeIdx] ?? 0;
  const activePrecip = hourly.precipitation?.[activeIdx] ?? 0;
  const activeVis = hourly.visibility?.[activeIdx]
    ? Math.round(hourly.visibility[activeIdx] / 1000)
    : undefined;

  const lowCloud = hourly.cloud_cover_low?.[activeIdx] ?? 0;
  const midCloud = hourly.cloud_cover_mid?.[activeIdx] ?? 0;
  const highCloud = hourly.cloud_cover_high?.[activeIdx] ?? 0;

  // Header content per phenomenon
  const getHeaderInfo = () => {
    switch (activePhenomenon) {
      case 'travel_weather':
        return {
          icon: <Footprints className="w-4 h-4 text-emerald-600" />,
          title: '24小时逐时徒步舒适度与气象要素深入剖析',
          desc: '逐时解析气温波动、降雨概率、风力等级与体感舒适度，精准规避恶劣天气',
          badgeTheme: 'border-emerald-200 bg-emerald-50/60',
        };
      case 'cloud_sea':
        return {
          icon: <Cloud className="w-4 h-4 text-sky-600" />,
          title: '云海微气象与逆温层深入剖析',
          desc: '解析低空层积云高度、地表水汽滞留率、逆温阻挡层与峰顶晴空开阔度',
          badgeTheme: 'border-sky-200 bg-sky-50/60',
        };
      case 'sunrise':
      case 'sunrise_glow':
        return {
          icon: <Sunrise className="w-4 h-4 text-amber-600" />,
          title: '日出光路与东向地平通透度深入剖析',
          desc: '解析东向地平低云遮挡度、天空晴朗开阔度与破晓金轮跃出窗口',
          badgeTheme: 'border-amber-200 bg-amber-50/60',
        };
      case 'sunset_glow':
      default:
        return {
          icon: <Sunset className="w-4 h-4 text-rose-600" />,
          title: '晚霞火烧云光路与垂直分层深入剖析',
          desc: '解析西向日落地平低云透光率、中高层漫反射天幕与落日余晖演化',
          badgeTheme: 'border-rose-200 bg-rose-50/60',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  // Selected hour status interpretation per phenomenon
  const renderActiveHourBadges = () => {
    switch (activePhenomenon) {
      case 'travel_weather': {
        const isComfortable =
          activeTemp !== undefined && activeTemp >= 16 && activeTemp <= 26 && activePrecipProb < 25;
        return (
          <div className="flex items-center flex-wrap gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono self-start sm:self-auto">
            <span className="font-bold text-slate-900">{activeTimeStr} 徒步要素:</span>
            {activeTemp !== undefined && (
              <span className="text-slate-800 font-semibold">{activeTemp}°C</span>
            )}
            <span
              className={`font-semibold ${
                activePrecipProb >= 40
                  ? 'text-rose-600'
                  : activePrecipProb >= 20
                  ? 'text-amber-600'
                  : 'text-emerald-700'
              }`}
            >
              {activePrecipProb}% 降水率{activePrecip > 0 ? ` (${activePrecip}mm)` : ''}
            </span>
            {activeWind !== undefined && (
              <span className="text-slate-600">{Math.round(activeWind)} km/h 风速</span>
            )}
            {activeHumidity !== undefined && (
              <span className="text-slate-600">{activeHumidity}% 湿度</span>
            )}
            <span
              className={`px-1.5 py-0.2 rounded font-sans text-[11px] font-bold ${
                isComfortable
                  ? 'bg-emerald-100 text-emerald-800'
                  : activePrecipProb >= 40
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isComfortable
                ? '舒适宜徒步'
                : activePrecipProb >= 40
                ? '有雨慎行'
                : activeTemp !== undefined && activeTemp > 28
                ? '偏热防晒'
                : '一般'}
            </span>
          </div>
        );
      }
      case 'cloud_sea': {
        return (
          <div className="flex items-center flex-wrap gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono self-start sm:self-auto">
            <span className="font-bold text-slate-900">{activeTimeStr} 云海成因:</span>
            <span className="text-sky-700 font-semibold">低层云: {lowCloud}%</span>
            {activeHumidity !== undefined && (
              <span className="text-indigo-700">{activeHumidity}% 水汽湿度</span>
            )}
            {activeVis !== undefined && (
              <span className="text-slate-600">能见度 {activeVis}km</span>
            )}
            {activeTemp !== undefined && <span className="text-slate-700">{activeTemp}°C</span>}
          </div>
        );
      }
      case 'sunrise':
      case 'sunrise_glow': {
        const totalCloud = hourly.cloud_cover?.[activeIdx] ?? 0;
        return (
          <div className="flex items-center flex-wrap gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono self-start sm:self-auto">
            <span className="font-bold text-slate-900">{activeTimeStr} 日出要素:</span>
            <span className="text-emerald-700 font-semibold">
              东向低云: {lowCloud}% {lowCloud <= 15 ? '(极佳无阻)' : lowCloud <= 35 ? '(轻度低云)' : '(低云遮挡)'}
            </span>
            <span className="text-amber-700">
              天空总云量: {totalCloud}%
            </span>
            {activeVis !== undefined && (
              <span className="text-slate-600">视线能见度 {activeVis}km</span>
            )}
          </div>
        );
      }
      case 'sunset_glow': {
        return (
          <div className="flex items-center flex-wrap gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono self-start sm:self-auto">
            <span className="font-bold text-slate-900">{activeTimeStr} 晚霞光路:</span>
            <span className="text-emerald-700 font-semibold">
              西向低云: {lowCloud}% {lowCloud < 30 ? '(通道开阔)' : '(局部遮挡)'}
            </span>
            <span className="text-rose-700">
              火烧云中高层: {Math.round((midCloud + highCloud) / 2)}%
            </span>
            {activeVis !== undefined && (
              <span className="text-slate-600">通透度 {activeVis}km</span>
            )}
          </div>
        );
      }
    }
  };

  // Phenomenon-tailored Deep Dive Mechanism Card
  const renderDeepDiveExplanation = () => {
    switch (activePhenomenon) {
      case 'travel_weather':
        return (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              徒步气象成因与行前剖析：
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🌡️ 体感温湿与能耗
                </span>
                人体徒步持续发热，15℃~23℃ 搭配微风最为舒适；午后若超 28℃ 体能消耗加剧，需备足电解质水并避开烈日。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🌧️ 降水对路况影响
                </span>
                降水概率大于 30% 或有短时阵雨，山林石阶与青苔泥路摩擦力骤降，建议备伞并选择平缓硬化绿道。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🌲 黄金徒步起止建议
                </span>
                推荐上午 08:30-11:30 或下午 15:30-17:30，光照柔和温和，山野微风宜人，兼具安全性与赏景视野。
              </div>
            </div>
          </div>
        );
      case 'cloud_sea':
        return (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              云海微气象形成机理剖析：
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🌫️ 逆温层锁水成海
                </span>
                夜间地面强烈辐射冷却，冷空气下沉滞留谷底，形成“下冷上暖”逆温层，使低空水汽无法向上对流消散。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  💧 雨后初晴饱和水汽
                </span>
                前 1~2 天有降水提供充分地表水汽，次日清晨转晴、近地湿度大于 85%，低层云量富集极易形成厚重云海。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🏔️ 峰顶视线晴空比
                </span>
                观赏云海需峰顶位于逆温层之上（低层云之上），头顶中高云小于 40%，方可居高临下俯瞰连绵浩瀚云涛。
              </div>
            </div>
          </div>
        );
      case 'sunrise':
      case 'sunrise_glow':
        return (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              日出破晓观赏气象机理剖析：
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🌅 东方地平通透通道（核心）
                </span>
                日出时刻东方地平线无厚重低云遮挡（低云 ≤ 15% 最佳）。低云是地平线日出的头号克星，云墙过厚会直接阻断红日跃出的第一瞬间。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  ☀️ 晴空开阔与日轮锐度
                </span>
                总云量越低（&lt; 25%）日轮越纯粹圆润、剪影鲜明；少量轻薄卷云可散射出柔和晨金光华，但厚中云容易遮挡日盘。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  ⏱️ 破晓至金光万道演化
                </span>
                日出前 20 分钟（天际线橙红弧光、黎明曙光），日出时刻（半轮红日跃出、金辉喷涌），日出后 25 分钟（旭日跃上地平、大地镀金）。
              </div>
            </div>
          </div>
        );
      case 'sunset_glow':
        return (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              晚霞与火烧云成因机理剖析：
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🌇 西方地平光路通透
                </span>
                日落方向地平线无浓密雨云封锁，阳光在大气中经历极长光程，蓝紫光被散射耗尽，仅留红橙金光斜射云底。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🔥 火烧云天幕漫反射
                </span>
                太阳刚没入地平线下 0°~6°，阳光自下而上照射高积云或卷层云底部，呈现大面积如烈火燃烧般的晚霞天幕。
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🌆 暮色余晖演变时序
                </span>
                日落前 10 分钟为暖黄斜光；日落后 5~20 分钟火烧云色彩最为绚丽；日落后 25 分钟转入深邃暮色紫蓝调。
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            {headerInfo.icon}
            {headerInfo.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{headerInfo.desc}</p>
        </div>

        {/* Selected Hour Micro-Climate Badge */}
        {renderActiveHourBadges()}
      </div>

      {/* Hourly Visual Timeline */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="flex items-end gap-1.5 min-w-[700px] h-32 pt-4 px-1">
          {dayIndices.map((idx) => {
            const timeStr = hourly.time[idx]?.split('T')[1]?.substring(0, 5) || '';
            const hourNumber = parseInt(timeStr.split(':')[0], 10);
            const isSunriseHour = timeStr.startsWith(sunriseTime.substring(0, 2));
            const isSunsetHour = timeStr.startsWith(sunsetTime.substring(0, 2));
            const isSelected = idx === activeIdx;

            const hTemp = hourly.temperature_2m?.[idx] ?? 20;
            const hRainProb = hourly.precipitation_probability?.[idx] ?? 0;
            const hLow = hourly.cloud_cover_low?.[idx] ?? 0;
            const hMid = hourly.cloud_cover_mid?.[idx] ?? 0;
            const hHigh = hourly.cloud_cover_high?.[idx] ?? 0;

            // Height scaling
            const scale = 0.8;
            const lowPx = Math.round(hLow * scale);
            const midPx = Math.round(hMid * scale);
            const highPx = Math.round(hHigh * scale);

            // For hiking: height is based on temp & outdoor comfort, color indicates weather/rain
            const hikingBarHeight = Math.max(8, Math.round(((hTemp + 5) / 45) * 60));
            const isHikingGolden = hourNumber >= 8 && hourNumber <= 17;

            return (
              <div
                key={idx}
                id={`timeline-hour-${hourNumber}`}
                onClick={() => setSelectedHourIdx(idx)}
                className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer group relative transition-all rounded-lg p-0.5 ${
                  isSelected ? 'bg-sky-50 ring-1 ring-sky-500' : 'hover:bg-slate-50'
                }`}
              >
                {/* Specific Visual Stacks based on phenomenon */}
                {activePhenomenon === 'travel_weather' ? (
                  // Hiking Mode: Temperature & Weather Comfort Bar
                  <div className="w-full flex flex-col justify-end items-center h-20">
                    <span className="text-[9px] font-mono text-slate-500 mb-0.5">
                      {Math.round(hTemp)}°
                    </span>
                    <div
                      style={{ height: `${hikingBarHeight}px` }}
                      className={`w-full rounded-t-sm transition-all ${
                        hRainProb >= 40
                          ? 'bg-rose-400'
                          : hRainProb >= 20
                          ? 'bg-amber-400'
                          : isHikingGolden
                          ? 'bg-emerald-400 group-hover:bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                      title={`${hourNumber}:00 | ${hTemp}°C | 降水率: ${hRainProb}%`}
                    />
                  </div>
                ) : (
                  // Sky & Cloud Sea Mode: Stacked Cloud Bars Stack
                  <div className="w-full flex flex-col-reverse justify-start items-center gap-0.5 h-20">
                    {/* Low Cloud Bar */}
                    {lowPx > 0 && (
                      <div
                        style={{ height: `${Math.max(3, lowPx * 0.25)}px` }}
                        className={`w-full rounded-xs transition ${
                          activePhenomenon === 'cloud_sea'
                            ? 'bg-sky-400 group-hover:bg-sky-500'
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        title={`低层云: ${hLow}%`}
                      />
                    )}
                    {/* Mid Cloud Bar */}
                    {midPx > 0 && (
                      <div
                        style={{ height: `${Math.max(3, midPx * 0.25)}px` }}
                        className="w-full rounded-xs bg-indigo-300 group-hover:bg-indigo-400 transition"
                        title={`中层云: ${hMid}%`}
                      />
                    )}
                    {/* High Cloud Bar */}
                    {highPx > 0 && (
                      <div
                        style={{ height: `${Math.max(3, highPx * 0.25)}px` }}
                        className="w-full rounded-xs bg-rose-300 group-hover:bg-rose-400 transition"
                        title={`高层云: ${hHigh}%`}
                      />
                    )}
                  </div>
                )}

                {/* Event Marker */}
                <div className="h-4 flex items-center justify-center my-1">
                  {isSunriseHour ? (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded leading-tight">
                      日出
                    </span>
                  ) : isSunsetHour ? (
                    <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1 rounded leading-tight">
                      日落
                    </span>
                  ) : activePhenomenon === 'travel_weather' && hourNumber === 10 ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-0.5 rounded leading-tight">
                      黄金
                    </span>
                  ) : null}
                </div>

                {/* Hour Label */}
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'font-bold text-sky-800' : 'text-slate-500'
                  }`}
                >
                  {timeStr.substring(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend based on phenomenon */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-2 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
        {activePhenomenon === 'travel_weather' ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
              <span>适宜徒步温层 (无雨)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
              <span>可能微量降水 (备伞)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-400" />
              <span>较明显降水 (慎行)</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-400" />
              <span>低层云 (0-2km · 云海主层)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-300" />
              <span>中层云 (2-6km · 漫射透光)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-300" />
              <span>高层云 (&gt;6km · 朝暮天幕)</span>
            </div>
          </div>
        )}

        <span className="text-[11px] text-slate-400">点击时刻可切换查看该点微气候指标</span>
      </div>

      {/* Distinct Phenomenon Deep Dive Analysis Card */}
      {renderDeepDiveExplanation()}
    </div>
  );
};
