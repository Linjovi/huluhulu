import React, { useState } from 'react';
import { HourlyWeatherData } from '../types';
import { Layers, Cloud, Sun, Droplets, Wind, Eye } from 'lucide-react';

interface SkyTimelineProps {
  hourly: HourlyWeatherData;
  targetDate: string; // YYYY-MM-DD
  sunriseTime: string;
  sunsetTime: string;
}

export const SkyTimeline: React.FC<SkyTimelineProps> = ({
  hourly,
  targetDate,
  sunriseTime,
  sunsetTime,
}) => {
  const dayIndices: number[] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    if (hourly.time[i].startsWith(targetDate)) {
      dayIndices.push(i);
    }
  }

  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(() => {
    return dayIndices.length > 6 ? dayIndices[6] : dayIndices[0] || 0;
  });

  if (dayIndices.length === 0) return null;

  const activeIdx = selectedHourIdx;
  const activeTimeStr = hourly.time[activeIdx]?.split('T')[1]?.substring(0, 5) || '12:00';
  const activeTemp = hourly.temperature_2m?.[activeIdx];
  const activeHumidity = hourly.relative_humidity_2m?.[activeIdx];
  const activeWind = hourly.wind_speed_10m?.[activeIdx];
  const activeVis = hourly.visibility?.[activeIdx]
    ? Math.round(hourly.visibility[activeIdx] / 1000)
    : undefined;

  const lowCloud = hourly.cloud_cover_low?.[activeIdx] ?? 0;
  const midCloud = hourly.cloud_cover_mid?.[activeIdx] ?? 0;
  const highCloud = hourly.cloud_cover_high?.[activeIdx] ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-600" />
            24小时大气与垂直分层云量
          </h3>
          <p className="text-xs text-slate-500">
            区分低空层积云(雾海)、中空高积云与高空卷云(晚霞天幕)
          </p>
        </div>

        {/* Selected Hour Micro-Climate Badge */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono self-start sm:self-auto">
          <span className="font-bold text-slate-900">{activeTimeStr} 气象指标:</span>
          {activeTemp !== undefined && <span className="text-slate-700">{activeTemp}°C</span>}
          {activeHumidity !== undefined && <span className="text-sky-700">{activeHumidity}% 湿度</span>}
          {activeVis !== undefined && <span className="text-slate-600">能见度 {activeVis}km</span>}
        </div>
      </div>

      {/* Hourly Stacked Cloud Bars */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="flex items-end gap-1.5 min-w-[700px] h-32 pt-4 px-1">
          {dayIndices.map((idx) => {
            const timeStr = hourly.time[idx]?.split('T')[1]?.substring(0, 5) || '';
            const hourNumber = parseInt(timeStr.split(':')[0], 10);
            const isSunriseHour = timeStr.startsWith(sunriseTime.substring(0, 2));
            const isSunsetHour = timeStr.startsWith(sunsetTime.substring(0, 2));
            const isSelected = idx === activeIdx;

            const hLow = hourly.cloud_cover_low?.[idx] ?? 0;
            const hMid = hourly.cloud_cover_mid?.[idx] ?? 0;
            const hHigh = hourly.cloud_cover_high?.[idx] ?? 0;

            const scale = 0.8;
            const lowPx = Math.round(hLow * scale);
            const midPx = Math.round(hMid * scale);
            const highPx = Math.round(hHigh * scale);

            return (
              <div
                key={idx}
                id={`timeline-hour-${hourNumber}`}
                onClick={() => setSelectedHourIdx(idx)}
                className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer group relative transition-all rounded-lg p-0.5 ${
                  isSelected ? 'bg-sky-50 ring-1 ring-sky-500' : 'hover:bg-slate-50'
                }`}
              >
                {/* Visual Cloud Bars Stack */}
                <div className="w-full flex flex-col-reverse justify-start items-center gap-0.5 h-20">
                  {/* Low Cloud Bar */}
                  {lowPx > 0 && (
                    <div
                      style={{ height: `${Math.max(3, lowPx * 0.25)}px` }}
                      className="w-full rounded-xs bg-sky-300 group-hover:bg-sky-400 transition"
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

                {/* Sun Marker */}
                <div className="h-4 flex items-center justify-center my-1">
                  {isSunriseHour ? (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                      日出
                    </span>
                  ) : isSunsetHour ? (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                      日落
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

      {/* Cloud Legend */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-300" />
            <span>低层云(0-2km·云海核心)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-300" />
            <span>中层云(2-6km·透光漫射)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-300" />
            <span>高层云(&gt;6km·晚霞天幕)</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-500">点击时刻可实时查看温度与湿度</span>
      </div>
    </div>
  );
};
