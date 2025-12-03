import axios from "axios";
import { Request, Response } from "express";

interface DouyinHotSearchItem {
  rank: number;
  title: string;
  hot: string;
  link: string;
  iconType: string | null;
  originalData?: any;
}

interface DouyinRawResponse {
  data: {
    word_list?: Array<{
      word: string;
      hot_value: number;
      word_cover?: {
        url_list: string[];
      };
      event_time: number;
    }>;
    active_time?: string;
  };
}

interface CacheData {
  list: DouyinHotSearchItem[];
  summary: string;
  timestamp: number;
}

let cache: CacheData | null = null;
const CACHE_DURATION = 180 * 1000; // 3 minutes

/**
 * 爬取抖音热搜榜 (API 版本)
 */
export async function getDouyinHotSearch(): Promise<DouyinHotSearchItem[]> {
  try {
    const response = await axios.get<DouyinRawResponse>(
      "https://aweme-lq.snssdk.com/aweme/v1/hot/search/list/?aid=1128&version_code=880",
      {
        timeout: 10000,
      }
    );

    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.word_list)
    ) {
      return response.data.data.word_list.map((item, index) => ({
        rank: index + 1,
        title: item.word,
        hot: (item.hot_value / 10000).toFixed(1) + "万", // Convert to "万" format
        link: `https://www.douyin.com/search/${encodeURIComponent(item.word)}`,
        iconType: getIconType(index),
        originalData: {
          ...item,
          cover: item.word_cover?.url_list[0],
        },
      }));
    }

    return [];
  } catch (error) {
    console.error("获取抖音热搜榜错误:", error);
    return [];
  }
}

function getIconType(index: number): string | null {
  if (index === 0) return "top"; // Use 'top' or similar for the first item if desired
  if (index < 3) return "hot";
  return null;
}

/**
 * 抖音热搜榜接口路由处理
 */
export async function douyinHotSearchHandler(req: Request, res: Response) {
  try {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return res.json({
        code: 0,
        message: "获取成功 (Cached)",
        data: {
          list: cache.list,
          summary: cache.summary,
          count: cache.list.length,
          timestamp: new Date(cache.timestamp).toISOString(),
        },
      });
    }

    const hotSearchList = await getDouyinHotSearch();
    let summary = "";

    // Update cache
    cache = {
      list: hotSearchList,
      summary,
      timestamp: Date.now(),
    };

    res.json({
      code: 0,
      message: "获取成功",
      data: {
        list: hotSearchList,
        summary: summary,
        count: hotSearchList.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("抖音热搜榜接口错误:", error);

    res.status(500).json({
      code: 500,
      message: error.message || "获取抖音热搜榜失败，请稍后再试",
    });
  }
}
