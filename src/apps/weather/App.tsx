import React, { useState, useEffect, useCallback } from 'react';
import { LocationItem, DailyForecastEvaluation, PhenomenonType, WeatherApiResponse } from './types';
import { getLastActiveLocation, setLastActiveLocation } from './utils/locations';
import { fetchWeatherForecast, getCurrentCoordinates } from './utils/api';
import { evaluateForecast } from './utils/weatherModel';
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { PhenomenonTabBar } from './components/PhenomenonTabBar';
import { PhenomenonDetailView } from './components/PhenomenonDetailView';
import { SkyTimeline } from './components/SkyTimeline';
import { LocationModal } from './components/LocationModal';
import { ObservationGuideModal } from './components/ObservationGuideModal';
import { AlertCircle, RefreshCw, Sparkles, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(() =>
    getLastActiveLocation()
  );
  const [evaluations, setEvaluations] = useState<DailyForecastEvaluation[]>([]);
  const [rawApiData, setRawApiData] = useState<WeatherApiResponse | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  // Tab-based switching: 'travel_weather' (Tab 1) | 'cloud_sea' (Tab 2) | 'sunrise_glow' (Tab 3) | 'sunset_glow' (Tab 4)
  const [activeTab, setActiveTab] = useState<PhenomenonType>('travel_weather');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showSkyTimeline, setShowSkyTimeline] = useState<boolean>(false);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Load weather forecast
  const loadForecast = useCallback(async (loc: LocationItem) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchWeatherForecast(loc.latitude, loc.longitude);
      setRawApiData(data);
      const evals = evaluateForecast(data);
      setEvaluations(evals);
      setSelectedDayIdx(0);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setErrorMsg(err.message || '获取天气预报失败，请检查网络后重试');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast(currentLocation);
    setLastActiveLocation(currentLocation);
  }, [currentLocation, loadForecast]);

  // Handle Location Switch
  const handleSelectLocation = (loc: LocationItem) => {
    setCurrentLocation(loc);
  };

  // Handle Geolocation
  const handleLocateUser = async () => {
    setIsLocating(true);
    try {
      const coords = await getCurrentCoordinates();
      const newLoc: LocationItem = {
        id: `gps_${Date.now()}`,
        name: '当前设备位置',
        admin1: '定位点',
        latitude: coords.latitude,
        longitude: coords.longitude,
        isCustom: true,
        category: 'custom',
      };
      setCurrentLocation(newLoc);
    } catch (err: any) {
      alert(err.message || '定位失败，请手动选择地点');
    } finally {
      setIsLocating(false);
    }
  };

  const currentDay = evaluations[selectedDayIdx];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-800">
      {/* Top Header */}
      <Header
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onLocateUser={handleLocateUser}
        onRefresh={() => loadForecast(currentLocation)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        isLoading={isLoading}
        isLocating={isLocating}
      />

      {/* Main Container: max-w-4xl with bottom padding for fixed bottom bar */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6 space-y-4 pb-28 sm:pb-32">
        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => loadForecast(currentLocation)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 transition"
            >
              重试
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && evaluations.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
            <RefreshCw className="w-7 h-7 animate-spin text-sky-600" />
            <div className="text-sm font-semibold text-slate-700">
              正在解算 {currentLocation.name} 气象与天象指数...
            </div>
            <div className="text-xs text-slate-500">
              解算分层云量、体感温湿、降水概率与最佳时段
            </div>
          </div>
        ) : currentDay ? (
          <>
            {/* 7-Day Quick Strip */}
            <DateSelector
              days={evaluations}
              selectedIndex={selectedDayIdx}
              onSelectIndex={setSelectedDayIdx}
              activePhenomenon={activeTab}
            />

            {/* Detailed Phenomenon View for Active Tab */}
            <PhenomenonDetailView
              prediction={currentDay.predictions[activeTab]}
              sunrise={currentDay.sunrise}
              sunset={currentDay.sunset}
              weatherDesc={currentDay.weatherDesc}
            />

            {/* Optional 24-Hour Sky Cloud Layer Stratification (Collapsible to keep UI ultra clean) */}
            {rawApiData && (
              <div className="pt-2">
                <button
                  id="toggle-sky-timeline-btn"
                  onClick={() => setShowSkyTimeline(!showSkyTimeline)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-600 text-xs font-semibold flex items-center justify-between transition shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>24小时垂直分层云量与微气候时间轴（深入剖析）</span>
                  </div>
                  {showSkyTimeline ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showSkyTimeline && (
                  <div className="mt-3 animate-fadeIn">
                    <SkyTimeline
                      hourly={rawApiData.hourly}
                      targetDate={currentDay.date}
                      sunriseTime={currentDay.sunrise}
                      sunsetTime={currentDay.sunset}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-4 text-center text-xs text-slate-500 mb-16 sm:mb-14">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-slate-700">天象与出游预测</span>
            <span>· 杭州及周边综合户外出行指南</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>数据源: Open-Meteo 免费气象接口</span>
            <span>·</span>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-slate-800 underline underline-offset-2 transition"
            >
              成因与观测指南
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile-First Bottom Navigation Bar: 4 Tabs (出游·云海·朝霞·晚霞) */}
      {currentDay && (
        <PhenomenonTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
      />

      {/* Observation Guide Modal */}
      <ObservationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
