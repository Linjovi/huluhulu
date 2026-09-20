import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  MapPin,
  Mountain,
  Navigation,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { LocationItem } from '../types';
import {
  PRESET_LOCATIONS,
  getSavedLocations,
  saveLocation,
  removeSavedLocation,
} from '../utils/locations';
import { searchLocations } from '../utils/api';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationItem;
  onSelectLocation: (loc: LocationItem) => void;
  onLocateUser: () => void;
  isLocating: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onLocateUser,
  isLocating,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'saved'>('presets');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedLocs, setSavedLocs] = useState<LocationItem[]>(() => getSavedLocations());

  // Sub-filter for presets
  const [presetCategory, setPresetCategory] = useState<'all' | 'hangzhou' | 'zhejiang' | 'national'>('hangzhou');

  // Custom Coordinate Form state
  const [customName, setCustomName] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [customElev, setCustomElev] = useState('');

  const isLocationSaved = (id: string) => savedLocs.some((x) => x.id === id);

  const filteredPresets = useMemo(() => {
    let list = PRESET_LOCATIONS;
    if (presetCategory !== 'all') {
      list = list.filter((item) => item.category === presetCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.admin1?.toLowerCase().includes(q) ||
          item.admin2?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [presetCategory, searchQuery]);

  if (!isOpen) return null;

  const handleToggleSave = (e: React.MouseEvent, loc: LocationItem) => {
    e.stopPropagation();
    if (isLocationSaved(loc.id)) {
      removeSavedLocation(loc.id);
      setSavedLocs(getSavedLocations());
    } else {
      saveLocation(loc);
      setSavedLocs(getSavedLocations());
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchLocations(searchQuery.trim());
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreateCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    const elev = customElev ? parseFloat(customElev) : undefined;

    if (isNaN(lat) || isNaN(lon)) {
      alert('请输入有效的纬度和经度数字');
      return;
    }

    const newLoc: LocationItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim() || `坐标点 (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      latitude: lat,
      longitude: lon,
      elevation: elev,
      isCustom: true,
      category: 'custom',
    };

    saveLocation(newLoc);
    setSavedLocs(getSavedLocations());
    onSelectLocation(newLoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="location-modal"
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">切换观测地点</h2>
              <p className="text-xs text-slate-500">支持杭州及周边名山、全国景点与自定义经纬度</p>
            </div>
          </div>
          <button
            id="close-location-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & GPS Locate Button */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/70 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="location-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索城市、山岳或景区 (如：天目山、覆卮山)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs sm:text-sm font-semibold transition"
            >
              {isSearching ? '搜索中' : '搜索'}
            </button>
          </div>

          {/* Quick GPS Geolocation Button */}
          <button
            id="modal-gps-btn"
            onClick={() => {
              onLocateUser();
              onClose();
            }}
            disabled={isLocating}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? '正在获取设备 GPS 坐标...' : '一键定位到我当前设备位置'}</span>
          </button>
        </div>

        {/* Tabs: Presets vs Custom vs Saved */}
        <div className="flex border-b border-slate-200 text-xs font-bold px-4 bg-white">
          <button
            id="tab-presets"
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'presets'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            推荐景点 ({PRESET_LOCATIONS.length})
          </button>
          <button
            id="tab-saved"
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'saved'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            已收藏 ({savedLocs.length})
          </button>
          <button
            id="tab-custom-coords"
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            自定义经纬度
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300">
          {/* Online Search Results (if available) */}
          {searchResults.length > 0 && (
            <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs font-bold text-sky-900 px-1">
                <span>网络搜索结果 ({searchResults.length})</span>
                <button
                  onClick={() => setSearchResults([])}
                  className="text-slate-400 hover:text-slate-600 text-[11px]"
                >
                  清空搜索
                </button>
              </div>
              <div className="space-y-1.5">
                {searchResults.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-white hover:bg-sky-100/50 border border-slate-200 flex items-center justify-between cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{loc.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {loc.admin1} {loc.admin2} · {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleToggleSave(e, loc)}
                      className="p-1 rounded text-slate-400 hover:text-amber-600"
                    >
                      {isLocationSaved(loc.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Preset Locations View */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setPresetCategory('hangzhou')}
                  className={`px-3 py-1 rounded-full border transition shrink-0 ${
                    presetCategory === 'hangzhou'
                      ? 'bg-sky-600 border-sky-600 text-white font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  杭州主城及周边
                </button>
                <button
                  onClick={() => setPresetCategory('zhejiang')}
                  className={`px-3 py-1 rounded-full border transition shrink-0 ${
                    presetCategory === 'zhejiang'
                      ? 'bg-sky-600 border-sky-600 text-white font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  湖州安吉/绍兴/台州/丽水
                </button>
                <button
                  onClick={() => setPresetCategory('national')}
                  className={`px-3 py-1 rounded-full border transition shrink-0 ${
                    presetCategory === 'national'
                      ? 'bg-sky-600 border-sky-600 text-white font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  全国经典胜地
                </button>
                <button
                  onClick={() => setPresetCategory('all')}
                  className={`px-3 py-1 rounded-full border transition shrink-0 ${
                    presetCategory === 'all'
                      ? 'bg-sky-600 border-sky-600 text-white font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  全部
                </button>
              </div>

              {/* Presets List */}
              <div className="space-y-2">
                {filteredPresets.map((loc) => {
                  const isCurrent =
                    currentLocation.id === loc.id ||
                    (Math.abs(currentLocation.latitude - loc.latitude) < 0.01 &&
                      Math.abs(currentLocation.longitude - loc.longitude) < 0.01);
                  const isSaved = isLocationSaved(loc.id);

                  return (
                    <div
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        isCurrent
                          ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400/30'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin
                          className={`w-4 h-4 shrink-0 ${
                            isCurrent ? 'text-sky-600' : 'text-slate-400'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {loc.name}
                            </span>
                            {loc.elevation !== undefined && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0 inline-flex items-center gap-0.5">
                                <Mountain className="w-2.5 h-2.5" />
                                {loc.elevation}m
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {loc.admin1} {loc.admin2} · {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => handleToggleSave(e, loc)}
                          className={`p-1.5 rounded-lg transition ${
                            isSaved
                              ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={isSaved ? '取消收藏' : '加入收藏'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        {isCurrent && (
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                            当前地点
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Saved Locations */}
          {activeTab === 'saved' && (
            <div className="space-y-2">
              {savedLocs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  暂无收藏地点，您可以在搜索或推荐列表中点击书签图标收藏常用机位。
                </div>
              ) : (
                savedLocs.map((loc) => {
                  const isCurrent = currentLocation.id === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        isCurrent
                          ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400/30'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {loc.name}
                            </span>
                            {loc.elevation !== undefined && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {loc.elevation}m
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleToggleSave(e, loc)}
                        className="p-1.5 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 transition"
                        title="取消收藏"
                      >
                        <BookmarkCheck className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Custom Coordinate Form */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCreateCustomLocation} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-xs leading-relaxed">
                输入任意露营营地、山峰观景台的精确 GPS 坐标与海拔，即可实时推演气象与天象指数。
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  地点名称（可选）
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="例如：临安太子尖三号营地"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    纬度 (Latitude) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    placeholder="如：30.13"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    经度 (Longitude) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    placeholder="如：118.92"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  海拔高度 (米/m，影响云海推算)
                </label>
                <input
                  type="number"
                  value={customElev}
                  onChange={(e) => setCustomElev(e.target.value)}
                  placeholder="如：1558"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-xs transition"
              >
                保存并查看此地天象
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
