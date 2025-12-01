import axios from "axios";
import { Request, Response } from "express";
import { getHotSearchSummary } from "../services/aiSummary";

interface XiaohongshuItem {
  rank: number;
  title: string;
  score: string;
  word_type: string;
  work_type_icon: string;
  link: string;
}

interface StandardHotSearchItem {
  rank: number | string | null;
  title: string;
  link: string | null;
  hot: string | null;
  iconType: string | null;
}

interface CacheData {
  list: StandardHotSearchItem[];
  summary: string;
  timestamp: number;
}

let cache: CacheData | null = null;
const CACHE_DURATION = 180 * 1000; // 3 minutes

export async function getXiaohongshuHotSearch(): Promise<
  StandardHotSearchItem[]
> {
  try {
    const response = await axios.get(
      "https://service-60s-202900-6-1388644494.sh.run.tcloudbase.com/v2/rednote",
      {
        timeout: 10000, // 10s timeout
      }
    );

    if (
      response.data &&
      response.data.code === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data.map((item: XiaohongshuItem) => ({
        rank: item.rank,
        title: item.title,
        link: item.link,
        hot: item.score,
        iconType: mapIconType(item.word_type),
      }));
    }

    return [];
  } catch (error) {
    console.error("获取小红书热搜失败:", error);
    return [];
  }
}

function mapIconType(wordType: string): string | null {
  switch (wordType) {
    case "热":
      return "hot";
    case "新":
      return "new";
    case "无":
    default:
      return null;
  }
}

/**
 * 小红书热搜榜接口路由处理
 */
export async function xiaohongshuHotSearchHandler(req: Request, res: Response) {
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

    const hotSearchList = await getXiaohongshuHotSearch();
    let summary = "";

    // Generate summary
    if (hotSearchList.length > 0) {
      try {
        summary = await getHotSearchSummary("小红书", hotSearchList);
      } catch (err) {
        console.error("生成小红书热搜总结失败:", err);
      }
    }

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
    console.error("小红书热搜榜接口错误:", error);

    res.status(500).json({
      code: 500,
      message: error.message || "获取小红书热搜榜失败，请稍后再试",
    });
  }
}
