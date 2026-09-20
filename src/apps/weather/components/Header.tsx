import React from 'react';
import {
  MapPin,
  Mountain,
  Navigation,
  RefreshCw,
  Search,
  BookOpen,
  CloudSun,
} from 'lucide-react';
import { LocationItem } from '../types';

interface HeaderProps {
  currentLocation: LocationItem;
  onOpenLocationModal: () => void;
  onLocateUser: () => void;
  onRefresh: () => void;
  onOpenGuide: () => void;
  isLoading: boolean;
  isLocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onOpenLocationModal,
  onLocateUser,
  onRefresh,
  onOpenGuide,
  isLoading,
  isLocating,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 sm:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & App Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-amber-400 p-0.5 shadow-sm shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <CloudSun className="w-4 h-4 text-sky-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  天象观测预测
                </h1>
                <span className="text-[11px] font-medium px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  杭州及周边
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                出游 · 云海 · 朝霞 · 晚霞 综合气象指数与出行指南
              </p>
            </div>
          </div>

          {/* Mobile Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              id="mobile-guide-btn"
              onClick={onOpenGuide}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="观测指南"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              id="mobile-refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50"
              title="刷新天气"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Location selector & action pill */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {/* Main Location Switcher Button */}
          <button
            id="location-switcher-btn"
            onClick={onOpenLocationModal}
            className="flex-1 min-w-0 sm:flex-initial sm:min-w-[280px] sm:max-w-md flex items-center justify-between gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left border border-slate-200/90 hover:border-slate-300 transition group shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="text-xs sm:text-sm font-bold text-slate-800 truncate"
                    title={currentLocation.name}
                  >
                    {currentLocation.name.split('(')[0].trim()}
                  </span>
                  {currentLocation.elevation !== undefined && (
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 text-slate-700 shrink-0 inline-flex items-center gap-0.5">
                      <Mountain className="w-2.5 h-2.5" />
                      {currentLocation.elevation}m
                    </span>
                  )}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  {currentLocation.admin2 || currentLocation.admin1 || '自定义'} · {currentLocation.latitude.toFixed(2)}°N, {currentLocation.longitude.toFixed(2)}°E
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-100/80 px-2 py-1 rounded-lg shrink-0 group-hover:bg-sky-200/70 transition ml-1">
              <Search className="w-3 h-3 shrink-0" />
              <span className="shrink-0">换地点</span>
            </div>
          </button>

          {/* Quick GPS Geolocation Button */}
          <button
            id="gps-locate-btn"
            onClick={onLocateUser}
            disabled={isLocating}
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1 text-xs shrink-0 disabled:opacity-50 font-medium"
            title="定位到我当前位置"
          >
            <Navigation className={`w-4 h-4 text-sky-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isLocating ? '定位中...' : '定位'}</span>
          </button>

          {/* Desktop Guide & Refresh Buttons */}
          <button
            id="desktop-guide-btn"
            onClick={onOpenGuide}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition text-xs shrink-0 font-medium"
            title="天象形成原理与摄影指南"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>指南</span>
          </button>

          <button
            id="desktop-refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition text-xs shrink-0 disabled:opacity-50 font-medium"
            title="更新实时天气预报"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-600' : ''}`} />
            <span>刷新</span>
          </button>
        </div>
      </div>
    </header>
  );
};
