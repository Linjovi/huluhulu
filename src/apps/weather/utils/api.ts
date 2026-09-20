import { LocationItem, WeatherApiResponse } from '../types';

/**
 * Fetch 7-day weather forecast with detailed hourly cloud layers and daily sun markers
 */
export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<WeatherApiResponse> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude.toFixed(4));
  url.searchParams.set('longitude', longitude.toFixed(4));
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'cloud_cover',
      'cloud_cover_low',
      'cloud_cover_mid',
      'cloud_cover_high',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(',')
  );
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'daylight_duration',
      'sunshine_duration',
      'uv_index_max',
    ].join(',')
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    throw new Error(`天气接口响应异常 (${resp.status}): 请稍后重试`);
  }

  const data = (await resp.json()) as WeatherApiResponse;
  return data;
}

/**
 * Search locations using Open-Meteo Geocoding API (free, supports Chinese & global locations)
 */
export async function searchLocations(query: string): Promise<LocationItem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Try Chinese first
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=zh&format=json`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('地点检索服务暂时繁忙');
  }

  interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    country?: string;
    admin1?: string;
    admin2?: string;
  }

  const json = await resp.json();
  let results: GeocodingResult[] = json.results || [];

  // Fallback to English if no results found
  if (results.length === 0) {
    const fallbackUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=10&language=en&format=json`;
    const fallbackResp = await fetch(fallbackUrl);
    if (fallbackResp.ok) {
      const fallbackJson = await fallbackResp.json();
      results = fallbackJson.results || [];
    }
  }

  return results.map((item) => ({
    id: `geo_${item.id}`,
    name: item.name,
    admin1: item.admin1,
    admin2: item.admin2,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation ? Math.round(item.elevation) : undefined,
    isCustom: true,
  }));
}

/**
 * Get current location using HTML5 Geolocation API
 */
export function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('当前浏览器不支持地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let msg = '定位获取失败';
        if (error.code === error.PERMISSION_DENIED) {
          msg = '请在浏览器设置中允许定位权限';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = '位置信息暂不可用';
        } else if (error.code === error.TIMEOUT) {
          msg = '定位请求超时，请重试';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
