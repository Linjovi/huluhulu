import React from 'react';
import { DailyForecastEvaluation, PhenomenonType } from '../types';
import { Sun, Cloud, CloudRain, CloudSun, CloudFog, CloudLightning, CloudSnow } from 'lucide-react';

interface DateSelectorProps {
  days: DailyForecastEvaluation[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  activePhenomenon: PhenomenonType;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  days,
  selectedIndex,
  onSelectIndex,
  activePhenomenon,
}) => {
  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    if (code === 1 || code === 2) return <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    if (code === 3) return <Cloud className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    if (code >= 45 && code <= 48) return <CloudFog className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    if (code >= 95) return <CloudLightning className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
    return <CloudSun className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  const getPhenomenonName = (type: PhenomenonType) => {
    switch (type) {
      case 'travel_weather':
        return '出游指数';
      case 'cloud_sea':
        return '云海指数';
      case 'sunrise_glow':
        return '朝霞指数';
      case 'sunset_glow':
      default:
        return '晚霞指数';
    }
  };

  const getPhenomenonColor = (type: PhenomenonType, isSelected: boolean) => {
    if (!isSelected) return 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';
    switch (type) {
      case 'travel_weather':
        return 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-500/30';
      case 'cloud_sea':
        return 'bg-sky-50/90 border-sky-500 ring-1 ring-sky-500/30';
      case 'sunrise_glow':
        return 'bg-rose-50/90 border-rose-500 ring-1 ring-rose-500/30';
      case 'sunset_glow':
      default:
        return 'bg-amber-50/90 border-amber-500 ring-1 ring-amber-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-sky-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-slate-400';
  };

  const formatDateDisplay = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parseInt(parts[1], 10)}-${parseInt(parts[2], 10)}`;
    }
    return dateStr;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xs font-bold text-slate-700 tracking-wide">
            未来 7 天逐日推演
          </h2>
          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {getPhenomenonName(activePhenomenon)}
          </span>
        </div>
        <span className="text-[11px] text-slate-600">点击卡片切换详情</span>
      </div>

      {/* Horizontal scroll strip emphasizing scores */}
      <div className="flex items-stretch gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent snap-x">
        {days.map((day, idx) => {
          const isSelected = idx === selectedIndex;
          const prediction = day.predictions[activePhenomenon];
          const score = prediction?.score ?? 0;
          const scoreColor = getScoreColor(score);

          return (
            <button
              key={day.date}
              id={`date-tab-${idx}`}
              onClick={() => onSelectIndex(idx)}
              className={`snap-start shrink-0 w-[84px] sm:w-auto sm:flex-1 p-2 rounded-2xl border text-center transition-all duration-200 flex flex-col justify-between shadow-xs ${getPhenomenonColor(
                activePhenomenon,
                isSelected
              )}`}
            >
              {/* Header: Date (e.g. 9-21) & Day of week */}
              <div className="flex items-center justify-between text-[11px] font-medium leading-none mb-1.5 px-0.5 whitespace-nowrap gap-1">
                <span className={`whitespace-nowrap ${isSelected ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                  {formatDateDisplay(day.date)}
                </span>
                <span className={`whitespace-nowrap ${isSelected ? 'text-slate-800 font-semibold' : 'text-slate-500 font-normal'}`}>
                  {day.dayOfWeek}
                </span>
              </div>

              {/* Hero: Emphasized Score Number (no box, no '分') */}
              <div className="my-1.5 flex items-center justify-center">
                <span className={`text-2xl sm:text-3xl font-black font-mono leading-none tracking-tight ${scoreColor}`}>
                  {score}
                </span>
              </div>

              {/* Footer: Subtle Weather icon & Temperatures */}
              <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-mono text-slate-500 leading-none whitespace-nowrap">
                {getWeatherIcon(day.weatherCode)}
                <span className="whitespace-nowrap">{day.tempMax}°/{day.tempMin}°</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
