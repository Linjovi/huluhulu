import {
  HourlyWeatherData,
  DailyWeatherData,
  DailyForecastEvaluation,
  PhenomenonPrediction,
  EvaluationFactor,
  WeatherApiResponse,
} from '../types';
import { calculateMoonInfo, formatHourTime, shiftTimeString } from './astronomy';

// Weather code description dictionary (WMO codes)
export function getWeatherCodeInfo(code: number): { desc: string; icon: string } {
  if (code === 0) return { desc: '晴空万里', icon: 'Sun' };
  if (code === 1) return { desc: '大部分晴朗', icon: 'SunMedium' };
  if (code === 2) return { desc: '局部多云', icon: 'CloudSun' };
  if (code === 3) return { desc: '阴天', icon: 'Cloud' };
  if (code >= 45 && code <= 48) return { desc: '有雾/雾气升腾', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { desc: '毛毛细雨', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { desc: '雨天', icon: 'CloudRain' };
  if (code >= 71 && code <= 77) return { desc: '雪天', icon: 'CloudSnow' };
  if (code >= 80 && code <= 82) return { desc: '阵雨', icon: 'CloudRain' };
  if (code >= 95) return { desc: '雷阵雨', icon: 'CloudLightning' };
  return { desc: '多云', icon: 'Cloud' };
}

interface EvaluationContext {
  dateStr: string;
  sunriseTime: string; // "05:45"
  sunsetTime: string;  // "18:20"
  elevation: number;
  hourly: {
    time: string;
    hourIndex: number;
    hourNum: number;
    temp: number;
    humidity: number;
    dewPoint: number;
    precipProb: number;
    precip: number;
    code: number;
    cloudTotal: number;
    cloudLow: number;
    cloudMid: number;
    cloudHigh: number;
    visibilityKm: number;
    windSpeed: number;
  }[];
}

/**
 * Filter hourly data for a single day (00:00 to 23:00)
 */
function extractDayHours(
  hourly: HourlyWeatherData,
  targetDate: string
): EvaluationContext['hourly'] {
  const result: EvaluationContext['hourly'] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const t = hourly.time[i];
    if (t.startsWith(targetDate)) {
      const hourNum = parseInt(t.substring(11, 13), 10);
      result.push({
        time: t,
        hourIndex: i,
        hourNum,
        temp: hourly.temperature_2m[i] ?? 15,
        humidity: hourly.relative_humidity_2m[i] ?? 60,
        dewPoint: hourly.dew_point_2m ? hourly.dew_point_2m[i] ?? 10 : (hourly.temperature_2m[i] - 3),
        precipProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] ?? 0 : 0,
        precip: hourly.precipitation ? hourly.precipitation[i] ?? 0 : 0,
        code: hourly.weather_code[i] ?? 0,
        cloudTotal: hourly.cloud_cover[i] ?? 0,
        cloudLow: hourly.cloud_cover_low[i] ?? 0,
        cloudMid: hourly.cloud_cover_mid[i] ?? 0,
        cloudHigh: hourly.cloud_cover_high[i] ?? 0,
        visibilityKm: Math.round((hourly.visibility[i] ?? 10000) / 1000),
        windSpeed: Math.round(hourly.wind_speed_10m[i] ?? 8),
      });
    }
  }
  return result;
}

/**
 * Evaluate Sea of Clouds (云海)
 */
function evaluateCloudSea(ctx: EvaluationContext): PhenomenonPrediction {
  // Peak observation hours: early morning 05:00 - 08:30, or late afternoon 16:30 - 18:30
  // Morning hours (5, 6, 7, 8)
  const morningHours = ctx.hourly.filter((h) => h.hourNum >= 5 && h.hourNum <= 8);
  const sample = morningHours.length > 0 ? morningHours : ctx.hourly.slice(5, 9);

  const avgHumidity = Math.round(sample.reduce((s, h) => s + h.humidity, 0) / (sample.length || 1));
  const avgCloudLow = Math.round(sample.reduce((s, h) => s + h.cloudLow, 0) / (sample.length || 1));
  const avgCloudMid = Math.round(sample.reduce((s, h) => s + h.cloudMid, 0) / (sample.length || 1));
  const avgCloudHigh = Math.round(sample.reduce((s, h) => s + h.cloudHigh, 0) / (sample.length || 1));
  const avgWind = Math.round(sample.reduce((s, h) => s + h.windSpeed, 0) / (sample.length || 1));
  const avgPrecipProb = Math.round(sample.reduce((s, h) => s + h.precipProb, 0) / (sample.length || 1));
  const avgDewSpread = Math.round(sample.reduce((s, h) => s + Math.abs(h.temp - h.dewPoint), 0) / (sample.length || 1));

  // Base score algorithm
  let score = 20;

  // 1. Low cloud coverage (ideal is 60% - 95% low cloud layer acting as the cloud sea blanket)
  if (avgCloudLow >= 65 && avgCloudLow <= 95) score += 32;
  else if (avgCloudLow >= 45 && avgCloudLow < 65) score += 22;
  else if (avgCloudLow > 95) score += 18; // slightly thick, but might breach summit
  else if (avgCloudLow >= 25) score += 12;

  // 2. High humidity & small dew point spread (fog / condensation formation)
  if (avgHumidity >= 85) score += 24;
  else if (avgHumidity >= 70) score += 16;
  else if (avgHumidity >= 55) score += 8;

  if (avgDewSpread <= 2.5) score += 12;
  else if (avgDewSpread <= 4.5) score += 6;

  // 3. Mid/High cloud clearance (above the cloud sea, sky must be clear/sunny)
  const overheadCloud = (avgCloudMid + avgCloudHigh) / 2;
  if (overheadCloud <= 25) score += 18;
  else if (overheadCloud <= 50) score += 10;
  else score -= 8; // covered by high overcast

  // 4. Wind stability (calm winds let clouds pool in the valleys, strong wind tears it apart)
  if (avgWind <= 12) score += 10;
  else if (avgWind <= 20) score += 4;
  else if (avgWind > 28) score -= 15;

  // 5. Elevation bonus (cloud seas usually form at 800m - 2000m)
  if (ctx.elevation >= 800) score += 6;
  if (ctx.elevation >= 1300) score += 4;
  if (ctx.elevation < 200) score -= 8; // flat terrain rarely has mountain cloud sea

  // Heavy rain penalty
  if (avgPrecipProb > 70) score -= 25;

  score = Math.max(10, Math.min(99, score));

  // Determine level
  let level: PhenomenonPrediction['level'] = 'poor';
  let levelLabel = '云海概率低';
  let levelBadgeColor = 'bg-slate-500/20 text-slate-300 border-slate-600/30';
  let summary = '当前气象条件下，低空水汽或凝结高度不足，难以形成漫延的云海大观。';

  if (score >= 80) {
    level = 'excellent';
    levelLabel = '漫山云海·极佳';
    levelBadgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    summary = '极佳观测期！低空水汽充分饱和汇聚成云浪，高空晴朗通透，山峰如海中仙岛。';
  } else if (score >= 62) {
    level = 'good';
    levelLabel = '大概率可见·良好';
    levelBadgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    summary = '水汽与低空逆温条件较好，清晨山谷易聚集大面积浓雾云浪，适合提早守候。';
  } else if (score >= 45) {
    level = 'moderate';
    levelLabel = '局地散云·一般';
    levelBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    summary = '可能出现局地小范围谷地薄雾或流云，规模相对分散，建议结合山地局部地形观测。';
  }

  const factors: EvaluationFactor[] = [
    {
      name: '低层云被覆盖度',
      value: `${avgCloudLow}%`,
      status: avgCloudLow >= 60 ? 'optimal' : avgCloudLow >= 35 ? 'good' : 'moderate',
      hint: avgCloudLow >= 60 ? '低云聚集充沛，具备云海厚度' : '低层云量偏少，可能仅有轻雾',
      weightLabel: '核心'
    },
    {
      name: '近地相对湿度',
      value: `${avgHumidity}%`,
      status: avgHumidity >= 80 ? 'optimal' : avgHumidity >= 65 ? 'good' : 'moderate',
      hint: avgHumidity >= 80 ? '湿度接近饱和，极利于水汽凝结' : '水汽略显干燥，凝聚慢',
      weightLabel: '核心'
    },
    {
      name: '高空晴朗透光度',
      value: `${Math.round(100 - overheadCloud)}%`,
      status: overheadCloud <= 30 ? 'optimal' : overheadCloud <= 60 ? 'good' : 'unfavorable',
      hint: overheadCloud <= 30 ? '头顶碧空万里，蓝天云海对比鲜明' : '中高层有云遮挡部分阳光',
      weightLabel: '关键'
    },
    {
      name: '山谷气流风速',
      value: `${avgWind} km/h`,
      status: avgWind <= 15 ? 'optimal' : avgWind <= 24 ? 'good' : 'unfavorable',
      hint: avgWind <= 15 ? '微风平缓，利于云层安稳滞留谷底' : '风速略偏大，云浪易被吹散',
      weightLabel: '参考'
    },
    {
      name: '地形海拔契合度',
      value: ctx.elevation ? `${ctx.elevation} 米` : '未标定',
      status: ctx.elevation >= 800 ? 'optimal' : ctx.elevation >= 400 ? 'good' : 'moderate',
      hint: ctx.elevation >= 800 ? '海拔高于常规逆温凝结层' : '地势较低，建议登至高处眺望',
      weightLabel: '地形'
    }
  ];

  const sunriseHHMM = ctx.sunriseTime || '06:00';
  const bestTimeStart = shiftTimeString(sunriseHHMM, -40);
  const bestTimeEnd = shiftTimeString(sunriseHHMM, 120);

  // Hourly curve
  const hourlyScores = ctx.hourly.map((h) => {
    let hScore = score;
    if (h.hourNum >= 5 && h.hourNum <= 8) hScore = Math.min(99, hScore + 10);
    else if (h.hourNum >= 16 && h.hourNum <= 18) hScore = Math.min(99, hScore + 4);
    else hScore = Math.max(10, hScore - 20);

    return {
      hour: h.time,
      displayHour: `${String(h.hourNum).padStart(2, '0')}:00`,
      score: hScore,
      cloudCover: h.cloudTotal,
      detail: `低云${h.cloudLow}% 湿度${h.humidity}% 风速${h.windSpeed}km/h`,
    };
  });

  return {
    id: 'cloud_sea',
    title: '云海漫延',
    subtitle: '山峦沉浮·翻滚云浪',
    score,
    level,
    levelLabel,
    levelBadgeColor,
    bestTimeWindow: `${bestTimeStart} - ${bestTimeEnd} (清晨日出前后最盛)`,
    bestTimeShort: `${bestTimeStart} - ${bestTimeEnd}`,
    countdownHint: `最佳观测时段通常为清晨日出逆温层稳定期`,
    summary,
    factors,
    photographerTips: '推荐机位选在海拔 1000m 以上开阔观景台或东向山崖；搭配广角镜头拍壮阔气势，长焦镜头压缩山峰孤岛特写；加装 ND 减光镜可拍摄如丝绢般流动的云瀑慢门。',
    equipmentAdvice: '广角变焦镜头、长焦镜头(70-200mm)、ND1000减光镜、稳固三脚架、保暖冲锋衣',
    hourlyScores,
  };
}

/**
 * Evaluate Sunrise Glow (朝霞)
 */
function evaluateSunriseGlow(ctx: EvaluationContext): PhenomenonPrediction {
  const sunriseHHMM = ctx.sunriseTime || '06:00';
  const sunriseHour = parseInt(sunriseHHMM.split(':')[0], 10) || 6;

  // Sample dawn hours around sunrise (sunriseHour - 1 to sunriseHour)
  const dawnHours = ctx.hourly.filter(
    (h) => h.hourNum === sunriseHour - 1 || h.hourNum === sunriseHour
  );
  const sample = dawnHours.length > 0 ? dawnHours : ctx.hourly.slice(5, 7);

  const avgCloudLow = Math.round(sample.reduce((s, h) => s + h.cloudLow, 0) / (sample.length || 1));
  const avgCloudMid = Math.round(sample.reduce((s, h) => s + h.cloudMid, 0) / (sample.length || 1));
  const avgCloudHigh = Math.round(sample.reduce((s, h) => s + h.cloudHigh, 0) / (sample.length || 1));
  const avgVisibility = Math.round(sample.reduce((s, h) => s + h.visibilityKm, 0) / (sample.length || 1));
  const avgPrecipProb = Math.round(sample.reduce((s, h) => s + h.precipProb, 0) / (sample.length || 1));

  // Mid + High cloud is the "screen" for scattering dawn rays (ideal: 30% - 70%)
  const screenCloud = Math.round((avgCloudMid * 1.2 + avgCloudHigh * 1.0) / 2.2);

  let score = 25;

  // 1. Low cloud must be low on horizon (under 30%) so sun can shoot rays up
  if (avgCloudLow <= 15) score += 30;
  else if (avgCloudLow <= 30) score += 20;
  else if (avgCloudLow <= 50) score += 8;
  else score -= 15; // thick low clouds block sunrise

  // 2. Scattering screen cloud (mid/high)
  if (screenCloud >= 35 && screenCloud <= 70) score += 32;
  else if (screenCloud >= 20 && screenCloud < 35) score += 18;
  else if (screenCloud > 70 && screenCloud <= 85) score += 12;
  else if (screenCloud < 10) score += 5; // totally clear dawn (nice gradient, but little clouds)

  // 3. Visibility
  if (avgVisibility >= 15) score += 15;
  else if (avgVisibility >= 8) score += 8;
  else score -= 10;

  // 4. Rain penalty
  if (avgPrecipProb > 50) score -= 25;

  score = Math.max(10, Math.min(99, score));

  let level: PhenomenonPrediction['level'] = 'poor';
  let levelLabel = '朝霞几率低';
  let levelBadgeColor = 'bg-slate-500/20 text-slate-300 border-slate-600/30';
  let summary = '东面地平线云层较重或高空无漫射云体，难以呈现大面积绚丽晨霞。';

  if (score >= 80) {
    level = 'excellent';
    levelLabel = '火红漫天·极佳';
    levelBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    summary = '极佳观测期！东面低空通透无阻，中高空卷云如画布，晨光初照将出现壮丽的紫金红霞。';
  } else if (score >= 60) {
    level = 'good';
    levelLabel = '绚丽晨霞·良好';
    levelBadgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    summary = '天空条件优良，日出前后将有层次丰富的暖橙色霞光与天色冷暖对撞。';
  } else if (score >= 40) {
    level = 'moderate';
    levelLabel = '淡雅微霞·一般';
    levelBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    summary = '有适度晨光，但受云量或通透度影响，色彩饱满度与扩散面积有限。';
  }

  const bestStart = shiftTimeString(sunriseHHMM, -35);
  const bestEnd = shiftTimeString(sunriseHHMM, 15);

  const factors: EvaluationFactor[] = [
    {
      name: '东向地平通透度 (低云)',
      value: `低云 ${avgCloudLow}%`,
      status: avgCloudLow <= 25 ? 'optimal' : avgCloudLow <= 45 ? 'good' : 'unfavorable',
      hint: avgCloudLow <= 25 ? '东面低空无厚重云层遮挡晨曦' : '低空云体较多，可能遮蔽地平线光线',
      weightLabel: '核心'
    },
    {
      name: '中高空漫射云被 (天幕)',
      value: `中高云 ${screenCloud}%`,
      status: screenCloud >= 30 && screenCloud <= 70 ? 'optimal' : 'good',
      hint: screenCloud >= 30 && screenCloud <= 70 ? '云量适中且有空隙，能充分承接折射霞光' : '云层稍厚或过少',
      weightLabel: '核心'
    },
    {
      name: '水平大气能见度',
      value: `${avgVisibility} km`,
      status: avgVisibility >= 15 ? 'optimal' : avgVisibility >= 8 ? 'good' : 'moderate',
      hint: avgVisibility >= 15 ? '大气洁净通透，瑞利散射色彩纯净' : '能见度一般，略有雾霾',
      weightLabel: '关键'
    },
    {
      name: '降水干扰概率',
      value: `${avgPrecipProb}%`,
      status: avgPrecipProb <= 20 ? 'optimal' : avgPrecipProb <= 45 ? 'good' : 'unfavorable',
      hint: avgPrecipProb <= 20 ? '无降水云团干扰' : '可能有间歇阵雨',
      weightLabel: '参考'
    }
  ];

  const hourlyScores = ctx.hourly.map((h) => {
    let hScore = score;
    if (h.hourNum === sunriseHour - 1 || h.hourNum === sunriseHour) {
      hScore = Math.min(99, hScore + 8);
    } else {
      hScore = Math.max(10, Math.round(hScore * 0.4));
    }
    return {
      hour: h.time,
      displayHour: `${String(h.hourNum).padStart(2, '0')}:00`,
      score: hScore,
      cloudCover: h.cloudTotal,
      detail: `总云${h.cloudTotal}% 中高云${Math.round((h.cloudMid + h.cloudHigh)/2)}%`,
    };
  });

  return {
    id: 'sunrise_glow',
    title: '朝霞吐艳',
    subtitle: '破晓晨曦·金光浸染',
    score,
    level,
    levelLabel,
    levelBadgeColor,
    bestTimeWindow: `${bestStart} - ${bestEnd} (日出前35分至日出后15分)`,
    bestTimeShort: `${bestStart} - ${bestEnd}`,
    countdownHint: `日出预测时间为 ${sunriseHHMM}，建议提前40分钟抵达机位架设设备`,
    summary,
    factors,
    photographerTips: '朝霞色彩演变极为迅速：日出前 30 分钟为深蓝与紫红对撞期（蓝调时段），日出前 15 分钟为金红高潮期。曝光宜以天空亮部为准，避免过曝失去云彩纹理。',
    equipmentAdvice: '渐变灰滤镜(GND)、偏振镜(CPL)、三脚架、快门线、长焦地景压缩镜头',
    hourlyScores,
  };
}

/**
 * Evaluate Sunset Glow (晚霞 / 火烧云)
 */
function evaluateSunsetGlow(ctx: EvaluationContext): PhenomenonPrediction {
  const sunsetHHMM = ctx.sunsetTime || '18:20';
  const sunsetHour = parseInt(sunsetHHMM.split(':')[0], 10) || 18;

  // Sample dusk hours around sunset (sunsetHour to sunsetHour + 1)
  const duskHours = ctx.hourly.filter(
    (h) => h.hourNum === sunsetHour || h.hourNum === sunsetHour + 1
  );
  const sample = duskHours.length > 0 ? duskHours : ctx.hourly.slice(17, 19);

  const avgCloudLow = Math.round(sample.reduce((s, h) => s + h.cloudLow, 0) / (sample.length || 1));
  const avgCloudMid = Math.round(sample.reduce((s, h) => s + h.cloudMid, 0) / (sample.length || 1));
  const avgCloudHigh = Math.round(sample.reduce((s, h) => s + h.cloudHigh, 0) / (sample.length || 1));
  const avgVisibility = Math.round(sample.reduce((s, h) => s + h.visibilityKm, 0) / (sample.length || 1));
  const avgPrecipProb = Math.round(sample.reduce((s, h) => s + h.precipProb, 0) / (sample.length || 1));

  const screenCloud = Math.round((avgCloudMid * 1.1 + avgCloudHigh * 1.1) / 2.2);

  let score = 25;

  // 1. Low clouds in the west must not block the setting sun
  if (avgCloudLow <= 20) score += 32;
  else if (avgCloudLow <= 35) score += 20;
  else if (avgCloudLow <= 50) score += 6;
  else score -= 18;

  // 2. Mid & High clouds acting as fire canvas
  if (screenCloud >= 35 && screenCloud <= 75) score += 34;
  else if (screenCloud >= 20 && screenCloud < 35) score += 18;
  else if (screenCloud > 75 && screenCloud <= 88) score += 10;
  else if (screenCloud < 15) score += 6;

  // 3. Atmospheric clarity
  if (avgVisibility >= 15) score += 12;
  else if (avgVisibility >= 8) score += 6;
  else score -= 8;

  if (avgPrecipProb > 50) score -= 25;

  score = Math.max(10, Math.min(99, score));

  let level: PhenomenonPrediction['level'] = 'poor';
  let levelLabel = '晚霞几率低';
  let levelBadgeColor = 'bg-slate-500/20 text-slate-300 border-slate-600/30';
  let summary = '西面云层过厚封锁夕照通道，或缺乏中高空受光云层，出现火烧云概率低。';

  if (score >= 80) {
    level = 'excellent';
    levelLabel = '绝美火烧云·极佳';
    levelBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    summary = '极佳观测期！具备标准火烧云气象结构，西侧低空开阔，中高云层丰满，落日余晖将烧红半边天！';
  } else if (score >= 60) {
    level = 'good';
    levelLabel = '瑰丽晚霞·良好';
    levelBadgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    summary = '暮色光影优良，日落后 20 分钟内将出现温暖浓郁的暖金与粉紫色云霞。';
  } else if (score >= 40) {
    level = 'moderate';
    levelLabel = '温和夕照·一般';
    levelBadgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    summary = '局部天空有温和夕阳散射，由于中高空云团分布不均，霞光面积相对克制。';
  }

  const bestStart = shiftTimeString(sunsetHHMM, -15);
  const bestEnd = shiftTimeString(sunsetHHMM, 35);

  const factors: EvaluationFactor[] = [
    {
      name: '西向地平光路 (低云遮挡)',
      value: `低云 ${avgCloudLow}%`,
      status: avgCloudLow <= 25 ? 'optimal' : avgCloudLow <= 40 ? 'good' : 'unfavorable',
      hint: avgCloudLow <= 25 ? '落日入射角度完美，无厚重低云遮挡' : '西侧有云遮挡，余晖受阻',
      weightLabel: '核心'
    },
    {
      name: '天幕承载云量 (火烧云层)',
      value: `中高云 ${screenCloud}%`,
      status: screenCloud >= 35 && screenCloud <= 75 ? 'optimal' : 'good',
      hint: screenCloud >= 35 && screenCloud <= 75 ? '中高层卷云/透光高积云，火烧云天幕成型' : '云层较少或过于密实',
      weightLabel: '核心'
    },
    {
      name: '水平能见度',
      value: `${avgVisibility} km`,
      status: avgVisibility >= 15 ? 'optimal' : avgVisibility >= 8 ? 'good' : 'moderate',
      hint: avgVisibility >= 15 ? '空气通透澄澈，色彩反差与饱和度高' : '存在轻度霾气，色彩略显灰蒙',
      weightLabel: '关键'
    },
    {
      name: '降水与雷暴概率',
      value: `${avgPrecipProb}%`,
      status: avgPrecipProb <= 20 ? 'optimal' : avgPrecipProb <= 45 ? 'good' : 'unfavorable',
      hint: avgPrecipProb <= 20 ? '气压稳定，无降雨云层冲刷' : '有局部阵雨可能',
      weightLabel: '参考'
    }
  ];

  const hourlyScores = ctx.hourly.map((h) => {
    let hScore = score;
    if (h.hourNum === sunsetHour || h.hourNum === sunsetHour + 1) {
      hScore = Math.min(99, hScore + 8);
    } else {
      hScore = Math.max(10, Math.round(hScore * 0.35));
    }
    return {
      hour: h.time,
      displayHour: `${String(h.hourNum).padStart(2, '0')}:00`,
      score: hScore,
      cloudCover: h.cloudTotal,
      detail: `总云${h.cloudTotal}% 中高云${Math.round((h.cloudMid + h.cloudHigh)/2)}%`,
    };
  });

  return {
    id: 'sunset_glow',
    title: '晚霞暮色',
    subtitle: '夕阳熔金·火烧云卷',
    score,
    level,
    levelLabel,
    levelBadgeColor,
    bestTimeWindow: `${bestStart} - ${bestEnd} (日落前15分至日落后35分)`,
    bestTimeShort: `${bestStart} - ${bestEnd}`,
    countdownHint: `日落预测时间为 ${sunsetHHMM}，切勿在日落瞬间离开，日落后15分钟常是火烧云顶峰`,
    summary,
    factors,
    photographerTips: '晚霞呈现三段阶梯式演变：① 日落前金黄刺眼；② 日落后 5-15 分钟红黄云彩爆裂（火烧云最佳窗口）；③ 日落后 20-35 分钟天空转入冷暖对冲紫粉蓝调。请使用三脚架并适度减弱曝光突出色彩饱和。',
    equipmentAdvice: '偏振镜(CPL)、软渐变滤镜(Soft GND0.9)、广角变焦镜头、稳固脚架',
    hourlyScores,
  };
}

/**
 * Evaluate Starry Sky & Milky Way (星空 / 银河)
 */
function evaluateStarrySky(ctx: EvaluationContext): PhenomenonPrediction {
  const moonInfo = calculateMoonInfo(ctx.dateStr);

  // Night hours: 21:00 to 04:00
  const nightHours = ctx.hourly.filter((h) => h.hourNum >= 21 || h.hourNum <= 4);
  const sample = nightHours.length > 0 ? nightHours : ctx.hourly.filter((h) => h.hourNum >= 20);

  const avgCloudTotal = Math.round(sample.reduce((s, h) => s + h.cloudTotal, 0) / (sample.length || 1));
  const avgHumidity = Math.round(sample.reduce((s, h) => s + h.humidity, 0) / (sample.length || 1));
  const avgVisibility = Math.round(sample.reduce((s, h) => s + h.visibilityKm, 0) / (sample.length || 1));
  const avgWind = Math.round(sample.reduce((s, h) => s + h.windSpeed, 0) / (sample.length || 1));
  const avgPrecipProb = Math.round(sample.reduce((s, h) => s + h.precipProb, 0) / (sample.length || 1));

  let score = 30;

  // 1. Night cloud cover (0% is absolute king for astronomy)
  if (avgCloudTotal <= 10) score += 42;
  else if (avgCloudTotal <= 25) score += 28;
  else if (avgCloudTotal <= 45) score += 12;
  else if (avgCloudTotal <= 70) score -= 10;
  else score -= 35;

  // 2. Moon light interference
  if (moonInfo.illuminationPct <= 15) score += 20; // new moon
  else if (moonInfo.illuminationPct <= 35) score += 12;
  else if (moonInfo.illuminationPct <= 65) score += 0;
  else score -= 18; // full moon washes out Milky Way

  // 3. Humidity (low humidity prevents lens fogging and light scattering)
  if (avgHumidity <= 60) score += 12;
  else if (avgHumidity <= 75) score += 6;
  else score -= 8;

  // 4. Visibility & Transparency
  if (avgVisibility >= 20) score += 12;
  else if (avgVisibility >= 12) score += 6;
  else score -= 10;

  // 5. Elevation advantage (less atmosphere, darker skies)
  if (ctx.elevation >= 1500) score += 8;
  else if (ctx.elevation >= 800) score += 4;

  if (avgPrecipProb > 30) score -= 25;

  score = Math.max(10, Math.min(99, score));

  let level: PhenomenonPrediction['level'] = 'poor';
  let levelLabel = '观星条件不佳';
  let levelBadgeColor = 'bg-slate-500/20 text-slate-300 border-slate-600/30';
  let summary = '夜间云量偏厚或受较强月光干扰，星光黯淡，不适宜天文深空或银河拍摄。';

  if (score >= 80) {
    level = 'excellent';
    levelLabel = '璀璨银河·极佳';
    levelBadgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    summary = '顶级暗夜观测窗口！夜空晴朗通透无云，月光干扰极微弱，肉眼可见银河如练、群星闪烁！';
  } else if (score >= 60) {
    level = 'good';
    levelLabel = '繁星满天·良好';
    levelBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    summary = '天象条件较好，夜空透明度高，适合观测主要星座、大三角及拍摄壮观星轨。';
  } else if (score >= 40) {
    level = 'moderate';
    levelLabel = '偶见亮星·一般';
    levelBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    summary = '受部分碎云或月光冲刷影响，仅可辨识一二等亮星，暗弱天体能见度受限。';
  }

  // Estimated Bortle scale (rough approximation based on altitude, cloud, moon)
  const bortleEst = ctx.elevation > 2000 && score > 75 ? 'Class 2-3 (极优暗夜)' :
                    ctx.elevation > 800 && score > 60 ? 'Class 3-4 (乡村郊野)' :
                    score > 50 ? 'Class 4-5 (城郊交界)' : 'Class 6-7 (光污染显著)';

  const factors: EvaluationFactor[] = [
    {
      name: '夜间总云量 (黑空纯度)',
      value: `${avgCloudTotal}%`,
      status: avgCloudTotal <= 15 ? 'optimal' : avgCloudTotal <= 35 ? 'good' : 'unfavorable',
      hint: avgCloudTotal <= 15 ? '夜空几乎万里无云，恒星无遮挡' : '存在部分低云或中云飘过',
      weightLabel: '核心'
    },
    {
      name: `月相与照度 (${moonInfo.phaseName})`,
      value: `月面亮度 ${moonInfo.illuminationPct}%`,
      status: moonInfo.illuminationPct <= 25 ? 'optimal' : moonInfo.illuminationPct <= 60 ? 'good' : 'unfavorable',
      hint: moonInfo.moonDescription,
      weightLabel: '核心'
    },
    {
      name: '夜间相对湿度 (防结露)',
      value: `${avgHumidity}%`,
      status: avgHumidity <= 65 ? 'optimal' : avgHumidity <= 80 ? 'good' : 'unfavorable',
      hint: avgHumidity <= 65 ? '空气干燥，镜头镜片不易结露起雾' : '湿度偏高，务必携带镜头加热带',
      weightLabel: '关键'
    },
    {
      name: '大气透明度与能见度',
      value: `${avgVisibility} km`,
      status: avgVisibility >= 18 ? 'optimal' : avgVisibility >= 10 ? 'good' : 'moderate',
      hint: avgVisibility >= 18 ? '通透度极佳，天顶星等极限高' : '低空通透度一般',
      weightLabel: '关键'
    },
    {
      name: '暗空参考等级评估',
      value: bortleEst,
      status: score >= 70 ? 'optimal' : 'good',
      hint: '结合海拔、光害估算与当前气象环境',
      weightLabel: '指数'
    }
  ];

  const hourlyScores = ctx.hourly.map((h) => {
    let hScore = score;
    // midnight peak
    if (h.hourNum >= 22 || h.hourNum <= 3) {
      hScore = Math.min(99, hScore + 6);
    } else if (h.hourNum >= 7 && h.hourNum <= 18) {
      hScore = 0; // Daytime
    } else {
      hScore = Math.max(10, Math.round(hScore * 0.4));
    }

    return {
      hour: h.time,
      displayHour: `${String(h.hourNum).padStart(2, '0')}:00`,
      score: hScore,
      cloudCover: h.cloudTotal,
      detail: `云量${h.cloudTotal}% 湿度${h.humidity}%`,
    };
  });

  return {
    id: 'starry_sky',
    title: '浩瀚星空',
    subtitle: '银河璀璨·繁星如织',
    score,
    level,
    levelLabel,
    levelBadgeColor,
    bestTimeWindow: `21:30 - 次日04:00 (避开余晖与晨光的天文纯黑期)`,
    bestTimeShort: `21:30 - 04:00`,
    countdownHint: `当前月相：${moonInfo.phaseName} (月照 ${moonInfo.illuminationPct}%)，请关注深夜月落/月升时间`,
    summary,
    factors,
    photographerTips: '银河核心摄影建议：光圈全开(f/1.4 - f/2.8)，快门遵循 500/焦点法则(如 20mm 镜头约 15-20 秒)，ISO 3200-6400；夜间温差大务必携带镜头加热带或暖宝宝防止前组镜片凝结水雾。',
    equipmentAdvice: '大光圈超广角镜头(14-24mm F2.8)、稳固金属三脚架、镜头除雾加热带、红光手电筒(保护暗适应)、保暖防风衣物',
    hourlyScores,
  };
}

/**
 * Evaluate general outdoor travel and outing weather suitability
 */
export function evaluateTravelWeather(
  ctx: EvaluationContext,
  dailyMaxTemp: number,
  dailyMinTemp: number,
  uvIndexMax?: number
): PhenomenonPrediction {
  const daytimeHours = ctx.hourly.filter((h) => h.hourNum >= 7 && h.hourNum <= 18);
  const sample = daytimeHours.length > 0 ? daytimeHours : ctx.hourly;

  const totalRain = sample.reduce((sum, h) => sum + (h.precip || 0), 0);
  const maxRainProb = Math.max(...sample.map((h) => h.precipProb || 0), 0);
  const avgTemp = sample.reduce((sum, h) => sum + h.temp, 0) / (sample.length || 1);
  const avgHumidity = Math.round(sample.reduce((sum, h) => sum + h.humidity, 0) / (sample.length || 1));
  const avgWind = Math.round(sample.reduce((sum, h) => sum + h.windSpeed, 0) / (sample.length || 1));
  const maxWind = Math.max(...sample.map((h) => h.windSpeed || 0), 0);
  const avgVis = Math.round(sample.reduce((sum, h) => sum + h.visibilityKm, 0) / (sample.length || 1));
  const avgCloud = Math.round(sample.reduce((sum, h) => sum + h.cloudTotal, 0) / (sample.length || 1));
  const uv = uvIndexMax ?? (avgCloud < 40 ? 5 : 3);

  let score = 55;

  // 1. Precipitation (dominant outdoor factor)
  if (totalRain === 0 && maxRainProb <= 15) {
    score += 25;
  } else if (totalRain < 0.2 && maxRainProb <= 35) {
    score += 12;
  } else if (totalRain <= 1.5 && maxRainProb <= 55) {
    score -= 12;
  } else if (totalRain <= 4) {
    score -= 28;
  } else {
    score -= 42;
  }

  // 2. Temperature comfort (Jiangnan spring/autumn 18-26°C optimal)
  if (dailyMaxTemp >= 18 && dailyMaxTemp <= 26 && dailyMinTemp >= 11) {
    score += 18;
  } else if (dailyMaxTemp >= 15 && dailyMaxTemp <= 29) {
    score += 10;
  } else if (dailyMaxTemp > 34 || dailyMaxTemp < 6) {
    score -= 16;
  } else {
    score += 4;
  }

  // 3. Wind comfort
  if (avgWind <= 15 && maxWind <= 24) {
    score += 10;
  } else if (avgWind <= 22) {
    score += 4;
  } else if (maxWind >= 35) {
    score -= 15;
  }

  // 4. Air visibility
  if (avgVis >= 18) {
    score += 10;
  } else if (avgVis >= 10) {
    score += 5;
  } else if (avgVis < 5) {
    score -= 10;
  }

  // 5. Cloud & sunshine balance
  if (avgCloud >= 15 && avgCloud <= 65) {
    score += 8; // pleasant broken cloud coverage prevents harsh sunburn
  } else if (avgCloud < 15) {
    score += 6;
  } else if (avgCloud > 85 && totalRain === 0) {
    score += 2;
  }

  score = Math.max(15, Math.min(99, score));

  let level: PhenomenonPrediction['level'] = 'poor';
  let levelLabel = '天气欠佳·不宜户外';
  let levelBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  let summary = '受降水、大风或体感不适影响，山地步道湿滑，户外游览体验受限，建议推迟出行或选择室内展馆游览。';

  if (score >= 85) {
    level = 'excellent';
    levelLabel = '黄金出游·极佳';
    levelBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    summary = '气象条件极为理想！气温温润舒适，微风和煦且全天无有效降雨，适宜登山徒步、露营野餐、西湖漫步或骑行出游。';
  } else if (score >= 70) {
    level = 'good';
    levelLabel = '适宜出行·良好';
    levelBadgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
    summary = '总体天气较佳，体感温和，适合绝大部分户外游览活动，早晚略有温差或偶有微风，适宜规划半日或全日出游。';
  } else if (score >= 50) {
    level = 'moderate';
    levelLabel = '局部适宜·一般';
    levelBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    summary = '气象条件中等，可能存在偏凉/偏热或局部零星小雨风险，建议规划平缓路线，随身备伞并根据温差增减衣物。';
  }

  // Factors
  const factors: EvaluationFactor[] = [
    {
      name: '降水风险',
      value:
        totalRain === 0
          ? maxRainProb <= 15
            ? '0% · 全天干爽无雨'
            : `${maxRainProb}% · 偶有阴云但无降水`
          : `${totalRain.toFixed(1)}mm · 有降雨概率`,
      status: totalRain === 0 && maxRainProb <= 20 ? 'optimal' : totalRain <= 0.5 ? 'good' : totalRain <= 2 ? 'moderate' : 'unfavorable',
      hint: totalRain === 0 ? '地面干燥安全，无需携带雨具' : '建议随身备便携折叠雨伞防小雨',
      weightLabel: '核心关键',
    },
    {
      name: '体感温湿',
      value: `${Math.round(dailyMinTemp)}℃ ~ ${Math.round(dailyMaxTemp)}℃ · 湿度${avgHumidity}%`,
      status: dailyMaxTemp >= 18 && dailyMaxTemp <= 26 ? 'optimal' : dailyMaxTemp >= 14 && dailyMaxTemp <= 30 ? 'good' : 'moderate',
      hint: dailyMaxTemp >= 18 && dailyMaxTemp <= 26 ? '人体温润黄金区间，久走不燥' : '早晚温差明显，请备轻便外套',
      weightLabel: '舒适度',
    },
    {
      name: '紫外防晒',
      value: `UV ${uv.toFixed(0)} · ${uv >= 7 ? '强紫外线' : uv >= 4 ? '中等偏强' : '温和舒适'}`,
      status: uv <= 4 ? 'optimal' : uv <= 6 ? 'good' : 'moderate',
      hint: uv >= 5 ? '正午前后阳光较强，备遮阳帽与防晒' : '紫外线温和，无灼伤晒伤风险',
      weightLabel: '户外防晒',
    },
    {
      name: '风力体感',
      value: `${avgWind <= 12 ? '1-2级微风' : avgWind <= 20 ? '3级和风' : '4级微劲风'} (${avgWind} km/h)`,
      status: avgWind <= 15 ? 'optimal' : avgWind <= 22 ? 'good' : 'moderate',
      hint: avgWind <= 15 ? '和风拂面，适宜草坪露营放风筝与徒步' : '风力稍明显，山脊注意防风防凉',
      weightLabel: '体感轻重',
    },
    {
      name: '空气通透',
      value: `${avgVis} km · ${avgVis >= 20 ? '通透极佳' : avgVis >= 12 ? '通透良好' : '轻度薄雾'}`,
      status: avgVis >= 18 ? 'optimal' : avgVis >= 10 ? 'good' : 'moderate',
      hint: avgVis >= 15 ? '视野宽广明亮，适宜登高远眺拍摄风光' : '能见度一般，适合近景林道漫步',
      weightLabel: '视野开阔',
    },
    {
      name: '穿衣与装备',
      value:
        dailyMaxTemp >= 22
          ? '透气T恤/速干长袖 + 舒适防滑鞋'
          : dailyMaxTemp >= 15
          ? '长袖衬衫 + 防风夹克/卫衣 + 徒步鞋'
          : '保暖打底 + 抓绒软壳/冲锋衣 + 登山鞋',
      status: 'optimal',
      hint: '建议洋葱式多层穿搭，便于运动发热时随时穿脱',
      weightLabel: '出行贴士',
    },
  ];

  // Best time window
  let bestTimeWindow = '全天 08:30 - 17:00 (黄金游玩时段)';
  let bestTimeShort = '08:30 - 17:00';
  if (totalRain > 0 && maxRainProb > 40) {
    bestTimeWindow = '上午 08:30 - 12:00 (避开午后可能的降雨)';
    bestTimeShort = '08:30 - 12:00';
  } else if (dailyMaxTemp > 30) {
    bestTimeWindow = '清晨 07:30 - 10:30 & 傍晚 16:00 - 18:30 (避开正午烈日)';
    bestTimeShort = '早晚清凉时段';
  }

  // Hourly scores (24 hours)
  const hourlyScores = ctx.hourly.map((h) => {
    let hScore = 60;
    if (h.precip > 0.5 || h.precipProb > 60) hScore -= 40;
    else if (h.precipProb > 30) hScore -= 15;
    else hScore += 20;

    if (h.temp >= 18 && h.temp <= 25) hScore += 15;
    else if (h.temp >= 14 && h.temp <= 28) hScore += 8;
    else hScore -= 10;

    if (h.windSpeed <= 15) hScore += 8;
    if (h.visibilityKm >= 15) hScore += 5;

    // Night penalty for general daytime outing
    if (h.hourNum < 6 || h.hourNum > 21) hScore -= 15;

    hScore = Math.max(10, Math.min(99, hScore));

    return {
      hour: h.time,
      displayHour: `${String(h.hourNum).padStart(2, '0')}:00`,
      score: hScore,
      cloudCover: h.cloudTotal,
      detail: `${Math.round(h.temp)}℃ · ${h.precipProb}%雨率 · ${Math.round(h.windSpeed)}km/h风`,
    };
  });

  return {
    id: 'travel_weather',
    title: '户外出游指数',
    subtitle: '徒步·露营·骑行·景区游览综合适宜度',
    score,
    level,
    levelLabel,
    levelBadgeColor,
    bestTimeWindow,
    bestTimeShort,
    countdownHint:
      totalRain === 0
        ? `全天干爽无雨，气温${Math.round(dailyMinTemp)}~${Math.round(dailyMaxTemp)}℃，非常适宜出行`
        : `局部有雨量，建议带伞或规划室内外结合路线`,
    summary,
    factors,
    photographerTips:
      '【推荐游玩类型】：\n1. 绿道慢骑与西湖漫步：断桥-白堤-苏堤、湘湖一期、千岛湖骑行绿道。\n2. 森林山野轻徒步：龙井十里琅珰、九溪十八涧、法喜寺-三天竺幽静竹林步道。\n3. 草坪野餐与家庭露营：良渚古城遗址大草坪、铜鉴湖花海露营地、青山湖水上森林。\n4. 登高望远：宝石山蛤蟆峰看主城全貌、半山望宸阁远眺杭城风貌。',
    equipmentAdvice:
      '轻便运动/徒步鞋、轻量双肩背包、防晒帽、太阳镜、防晒喷雾、便携保温水杯、充电宝；早晚备薄外套，如有降水概率携带折叠晴雨伞。',
    hourlyScores,
  };
}

/**
 * Main evaluation orchestrator for 7-day forecast
 */
export function evaluateForecast(apiData: WeatherApiResponse): DailyForecastEvaluation[] {
  const result: DailyForecastEvaluation[] = [];
  const daily = apiData.daily;
  if (!daily || !daily.time) return result;

  for (let i = 0; i < daily.time.length; i++) {
    const dateStr = daily.time[i];
    const dateObj = new Date(dateStr + 'T00:00:00');
    
    // Day of week in Chinese
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayOfWeek = days[dateObj.getDay()];

    // Today / Tomorrow label
    const todayStr = new Date().toISOString().split('T')[0];
    let dateLabel = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
    if (dateStr === todayStr) {
      dateLabel = '今天';
    }

    const sunriseIso = daily.sunrise ? daily.sunrise[i] : '';
    const sunsetIso = daily.sunset ? daily.sunset[i] : '';
    const sunriseHHMM = formatHourTime(sunriseIso);
    const sunsetHHMM = formatHourTime(sunsetIso);

    const dayHours = extractDayHours(apiData.hourly, dateStr);

    const ctx: EvaluationContext = {
      dateStr,
      sunriseTime: sunriseHHMM,
      sunsetTime: sunsetHHMM,
      elevation: apiData.elevation || 0,
      hourly: dayHours,
    };

    const tempMax = Math.round(daily.temperature_2m_max[i] ?? 20);
    const tempMin = Math.round(daily.temperature_2m_min[i] ?? 12);
    const uvMax = daily.uv_index_max ? daily.uv_index_max[i] : undefined;

    const travelWeatherPred = evaluateTravelWeather(ctx, tempMax, tempMin, uvMax);
    const cloudSeaPred = evaluateCloudSea(ctx);
    const sunriseGlowPred = evaluateSunriseGlow(ctx);
    const sunsetGlowPred = evaluateSunsetGlow(ctx);
    const starrySkyPred = evaluateStarrySky(ctx);

    const weatherCode = daily.weather_code ? daily.weather_code[i] : 0;
    const weatherInfo = getWeatherCodeInfo(weatherCode);

    // Pick top phenomenon highlight
    const scores = [
      { name: '出游', score: travelWeatherPred.score, obj: travelWeatherPred },
      { name: '云海', score: cloudSeaPred.score, obj: cloudSeaPred },
      { name: '朝霞', score: sunriseGlowPred.score, obj: sunriseGlowPred },
      { name: '晚霞', score: sunsetGlowPred.score, obj: sunsetGlowPred },
    ];
    scores.sort((a, b) => b.score - a.score);
    const top = scores[0];

    let highlightMessage = '';
    if (top.score >= 85) {
      highlightMessage = `今日首推【${top.name}】：指数高达 ${top.score} 分，${top.obj.bestTimeShort} 迎来极佳体验窗口！`;
    } else if (top.score >= 65) {
      highlightMessage = `【${top.name}】表现突出（${top.score}分），建议把握 ${top.obj.bestTimeShort}。`;
    } else {
      highlightMessage = `今日气象条件中等，外出游玩或天象观测请备好雨具并注意温差。`;
    }

    result.push({
      date: dateStr,
      dateLabel,
      dayOfWeek,
      weatherCode,
      weatherDesc: weatherInfo.desc,
      tempMax,
      tempMin,
      sunrise: sunriseHHMM,
      sunset: sunsetHHMM,
      moonInfo: calculateMoonInfo(dateStr),
      predictions: {
        travel_weather: travelWeatherPred,
        cloud_sea: cloudSeaPred,
        sunrise_glow: sunriseGlowPred,
        sunset_glow: sunsetGlowPred,
        starry_sky: starrySkyPred,
      },
      highlightMessage,
    });
  }

  return result;
}
