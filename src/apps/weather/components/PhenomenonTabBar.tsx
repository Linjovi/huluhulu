import React from 'react';
import { PhenomenonType } from '../types';
import { Footprints, CloudFog, Sunrise, Sunset } from 'lucide-react';

interface PhenomenonTabBarProps {
  activeTab: PhenomenonType;
  onTabChange: (tab: PhenomenonType) => void;
}

export const PhenomenonTabBar: React.FC<PhenomenonTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: {
    id: PhenomenonType;
    label: string;
    fullLabel: string;
    icon: (isActive: boolean) => React.ReactNode;
    activeText: string;
    activeBg: string;
  }[] = [
    {
      id: 'travel_weather',
      label: '徒步',
      fullLabel: '徒步指数',
      icon: (isActive) => (
        <Footprints
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        />
      ),
      activeText: 'text-emerald-700 font-bold',
      activeBg: 'bg-emerald-50/90',
    },
    {
      id: 'cloud_sea',
      label: '云海',
      fullLabel: '云海漫延',
      icon: (isActive) => (
        <CloudFog
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        />
      ),
      activeText: 'text-sky-700 font-bold',
      activeBg: 'bg-sky-50/90',
    },
    {
      id: 'sunrise',
      label: '日出',
      fullLabel: '红日初升',
      icon: (isActive) => (
        <Sunrise
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 text-rose-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        />
      ),
      activeText: 'text-rose-700 font-bold',
      activeBg: 'bg-rose-50/90',
    },
    {
      id: 'sunset_glow',
      label: '晚霞',
      fullLabel: '晚霞暮色',
      icon: (isActive) => (
        <Sunset
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        />
      ),
      activeText: 'text-amber-700 font-bold',
      activeBg: 'bg-amber-50/90',
    },
  ];

  return (
    <nav
      id="mobile-bottom-tab-bar"
      aria-label="天象与出游指数切换"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 transition-all"
    >
      <div className="max-w-xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive =
              activeTab === tab.id ||
              (tab.id === 'sunrise' && (activeTab as string) === 'sunrise_glow') ||
              (tab.id === 'sunrise_glow' && (activeTab as string) === 'sunrise');

            return (
              <button
                key={tab.id}
                id={`bottom-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 touch-manipulation min-h-[50px] ${
                  isActive
                    ? `${tab.activeBg} shadow-xs ring-1 ring-slate-200/80`
                    : 'hover:bg-slate-50 text-slate-500'
                }`}
              >
                {/* Active Top Indicator Line */}
                {isActive && (
                  <span
                    className={`absolute top-0 inset-x-3 h-0.5 rounded-full ${
                      tab.id === 'travel_weather'
                        ? 'bg-emerald-500'
                        : tab.id === 'cloud_sea'
                        ? 'bg-sky-500'
                        : tab.id === 'sunrise' || tab.id === 'sunrise_glow'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  />
                )}

                {/* Clean Icon */}
                <div className="flex items-center justify-center">
                  {tab.icon(isActive)}
                </div>

                {/* Label text */}
                <span
                  className={`text-xs mt-1 transition-colors leading-tight ${
                    isActive ? tab.activeText : 'text-slate-600 font-medium'
                  }`}
                >
                  <span className="inline sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
