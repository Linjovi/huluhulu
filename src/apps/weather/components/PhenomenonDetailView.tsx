import React, { useState, useMemo, useEffect } from 'react';
import {
  PhenomenonPrediction,
  PhenomenonType,
  FactorStatus,
} from '../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Info,
  CloudFog,
  Sunrise,
  Sunset,
  ChevronRight,
  TrendingUp,
  Compass,
  Footprints,
} from 'lucide-react';

interface PhenomenonDetailViewProps {
  prediction: PhenomenonPrediction;
  sunrise: string;
  sunset: string;
  weatherDesc: string;
}

export const PhenomenonDetailView: React.FC<PhenomenonDetailViewProps> = ({
  prediction,
  sunrise,
  sunset,
  weatherDesc,
}) => {
  const [showTips, setShowTips] = useState(false);

  // Default selected hour (peak score hour or first optimal hour)
  const defaultHourIndex = useMemo(() => {
    if (!prediction.hourlyScores || prediction.hourlyScores.length === 0) return 0;
    let maxIdx = 0;
    let maxScore = -1;
    prediction.hourlyScores.forEach((h, idx) => {
      if (h.score > maxScore) {
        maxScore = h.score;
        maxIdx = idx;
      }
    });
    return maxIdx;
  }, [prediction.id, prediction.hourlyScores]);

  const [selectedHour, setSelectedHour] = useState<number>(defaultHourIndex);

  useEffect(() => {
    setSelectedHour(defaultHourIndex);
  }, [defaultHourIndex, prediction.id]);

  // Ensure activeHourIndex is always within valid bounds so UI never flickers or collapses
  const activeHourIndex =
    selectedHour >= 0 && selectedHour < (prediction.hourlyScores?.length ?? 0)
      ? selectedHour
      : defaultHourIndex;
  const activeHourData = prediction.hourlyScores?.[activeHourIndex];

  const getTheme = (type: PhenomenonType) => {
    switch (type) {
      case 'travel_weather':
        return {
          icon: <Footprints className="w-5 h-5 text-emerald-600" />,
          title: '户外徒步',
          pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          accentColor: 'text-emerald-600',
          gaugeColor: 'stroke-emerald-500',
          progressBg: 'bg-emerald-500',
          bannerBg: 'from-emerald-50/90 via-white to-teal-50/40 border-emerald-200',
          bestTimeBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        };
      case 'cloud_sea':
        return {
          icon: <CloudFog className="w-5 h-5 text-sky-600" />,
          title: '云海漫延',
          pillBg: 'bg-sky-50 text-sky-700 border-sky-200',
          accentColor: 'text-sky-600',
          gaugeColor: 'stroke-sky-500',
          progressBg: 'bg-sky-500',
          bannerBg: 'from-sky-50/80 via-white to-sky-50/40 border-sky-200',
          bestTimeBg: 'bg-sky-50 border-sky-200 text-sky-900',
        };
      case 'sunrise':
      case 'sunrise_glow':
        return {
          icon: <Sunrise className="w-5 h-5 text-rose-600" />,
          title: '红日初升',
          pillBg: 'bg-rose-50 text-rose-700 border-rose-200',
          accentColor: 'text-rose-600',
          gaugeColor: 'stroke-rose-500',
          progressBg: 'bg-rose-500',
          bannerBg: 'from-rose-50/80 via-white to-amber-50/40 border-rose-200',
          bestTimeBg: 'bg-rose-50 border-rose-200 text-rose-900',
        };
      case 'sunset_glow':
      default:
        return {
          icon: <Sunset className="w-5 h-5 text-amber-600" />,
          title: '晚霞暮色',
          pillBg: 'bg-amber-50 text-amber-700 border-amber-200',
          accentColor: 'text-amber-600',
          gaugeColor: 'stroke-amber-500',
          progressBg: 'bg-amber-500',
          bannerBg: 'from-amber-50/80 via-white to-orange-50/40 border-amber-200',
          bestTimeBg: 'bg-amber-50 border-amber-200 text-amber-900',
        };
    }
  };

  const theme = getTheme(prediction.id);

  const getStatusBadge = (status: FactorStatus) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 leading-none">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            极佳
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 shrink-0 leading-none">
            <CheckCircle2 className="w-2.5 h-2.5 text-sky-600" />
            良好
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 shrink-0 leading-none">
            <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
            一般
          </span>
        );
      case 'unfavorable':
      default:
        return (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0 leading-none">
            <AlertCircle className="w-2.5 h-2.5 text-slate-400" />
            不利
          </span>
        );
    }
  };

  // Circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prediction.score / 100) * circumference;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className={`rounded-2xl border ${theme.bannerBg} bg-gradient-to-br p-4 sm:p-6 shadow-sm`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Left: Phenomenon name & verdict */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200">
                {theme.icon}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {prediction.title}
              </h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${theme.pillBg}`}>
                {prediction.levelLabel}
              </span>
              <span className="text-xs text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                {weatherDesc}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
              {prediction.summary}
            </p>

            {/* Sun / Ephemeris Quick Reference */}
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
              <span>日出: <strong className="font-mono text-slate-700">{sunrise}</strong></span>
              <span>·</span>
              <span>日落: <strong className="font-mono text-slate-700">{sunset}</strong></span>
            </div>
          </div>

          {/* Right: Circular score gauge */}
          <div className="flex items-center gap-4 shrink-0 bg-white/90 p-3.5 rounded-2xl border border-slate-200/80 shadow-xs self-center sm:self-auto">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  className="stroke-slate-100"
                  strokeWidth="7"
                  fill="none"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  className={`${theme.gaugeColor} transition-all duration-700 ease-out`}
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-mono font-black ${theme.accentColor} leading-none`}>
                  {prediction.score}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {prediction.id === 'travel_weather' ? '徒步指数' : '观测指数'}
                </span>
              </div>
            </div>

            <div className="text-left">
              <div className="text-xs text-slate-600 font-medium">
                {prediction.id === 'travel_weather' ? '出行评级' : '可观测评级'}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {prediction.id === 'travel_weather'
                  ? prediction.score >= 80
                    ? '强烈推荐'
                    : prediction.score >= 60
                    ? '适宜徒步'
                    : '谨慎出行'
                  : prediction.score >= 80
                  ? '极力推荐'
                  : prediction.score >= 60
                  ? '值得一守'
                  : '建议观望'}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                满分 100 分制
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Best Observation Window / Hiking Window */}
        <div className={`mt-4 p-3.5 sm:p-4 rounded-xl border ${theme.bestTimeBg} space-y-2.5 shadow-xs`}>
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
              <Clock className="w-4 h-4 text-slate-700" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold tracking-wider text-slate-600 mb-0.5">
                {prediction.id === 'travel_weather' ? '推荐徒步出行时间' : '最佳观测时间窗口'}
              </div>
              <div className="text-sm sm:text-base font-mono font-black text-slate-900 leading-snug">
                {prediction.bestTimeWindow}
              </div>
            </div>
          </div>

          {prediction.countdownHint && (
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/90 px-3 py-2 rounded-lg border border-slate-200/80 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 self-start mt-0.5" />
              <span className="flex-1 font-medium">{prediction.countdownHint}</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Meteorological Factors (Compact & Clean) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2 sm:mb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            气象成因核心指标
          </h3>
          <span className="text-[11px] text-slate-500">ECMWF / GFS 云量与气象解算</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
          {prediction.factors.map((factor, idx) => (
            <div
              key={idx}
              className="px-2.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-center gap-1 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  {factor.weightLabel && (
                    <span className="text-[9px] font-medium px-1 py-0.2 rounded bg-slate-200/80 text-slate-600 shrink-0 leading-tight">
                      {factor.weightLabel}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {factor.name}
                  </span>
                </div>
                {getStatusBadge(factor.status)}
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-slate-900 text-xs shrink-0">
                  {factor.value}
                </span>
                <span className="text-[11px] text-slate-500 truncate text-right">
                  {factor.hint}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24-Hour Observation Score Trend Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 min-h-[34px]">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 shrink-0">
            <Clock className="w-4 h-4 text-sky-600" />
            {prediction.id === 'travel_weather'
              ? '24 小时逐时适宜指数走势'
              : '24 小时观测指数走势'}
          </h3>

          {activeHourData && (
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-100/90 px-2.5 py-1.5 rounded-lg border border-slate-200/80 shrink-0 self-start sm:self-auto">
              <span className="font-bold text-sky-700">
                {activeHourData.displayHour}
              </span>
              <span className="font-bold text-amber-600">
                {activeHourData.score}分
              </span>
              <span className="text-slate-600 font-sans text-[11px] truncate max-w-[160px] sm:max-w-[260px]">
                {activeHourData.detail}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-end gap-1 overflow-x-auto pb-2 pt-2 scrollbar-thin scrollbar-thumb-slate-300">
          {prediction.hourlyScores.map((h, i) => {
            const barHeight = Math.max(6, Math.round((h.score / 100) * 50));
            const isHighlight = h.score >= 60;
            const isSelected = activeHourIndex === i;

            return (
              <div
                key={i}
                id={`score-hour-${i}`}
                onClick={() => setSelectedHour(i)}
                title={`点击查看 ${h.displayHour} 详情 (${h.score}分)`}
                className={`shrink-0 flex flex-col items-center gap-1 w-8 sm:w-9 cursor-pointer transition-all rounded-lg p-0.5 ${
                  isSelected
                    ? 'bg-sky-50 ring-1.5 ring-sky-500 shadow-xs'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Vertical Bar */}
                <div className="w-5 bg-slate-100 rounded-t-sm flex items-end justify-center h-14">
                  <div
                    style={{ height: `${barHeight}px` }}
                    className={`w-full rounded-t-sm transition-all duration-200 ${
                      isHighlight
                        ? `${theme.progressBg} shadow-xs`
                        : 'bg-slate-300'
                    }`}
                  />
                </div>

                {/* Hour label */}
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'font-bold text-sky-800' : 'text-slate-500'
                  }`}
                >
                  {h.displayHour.substring(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photography & Outing Advice Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                prediction.id === 'travel_weather'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              {prediction.id === 'travel_weather' ? (
                <Footprints className="w-4 h-4" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {prediction.id === 'travel_weather'
                  ? '出游路线建议与出行装备'
                  : '摄影机位与装备建议'}
              </h4>
              <p className="text-xs text-slate-500">
                {prediction.id === 'travel_weather'
                  ? '推荐适合的户外活动路线、穿衣穿鞋与随身防护清单'
                  : '推荐镜头焦段、构图角度与曝光补偿提示'}
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-slate-400 transition-transform ${
              showTips ? 'rotate-90' : ''
            }`}
          />
        </button>

        {showTips && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-2.5 animate-fadeIn">
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                {prediction.id === 'travel_weather'
                  ? '🌲 适宜出游活动与路线推荐：'
                  : '📸 构图与曝光参考：'}
              </span>
              <p className="leading-relaxed text-slate-600 whitespace-pre-line">
                {prediction.photographerTips}
              </p>
            </div>
            {prediction.equipmentAdvice && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">
                  🎒 出行推荐携带：
                </span>
                <span className="text-slate-600">{prediction.equipmentAdvice}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
