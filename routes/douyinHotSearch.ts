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

interface DouyinApiItem {
  title: string;
  hot_value: number;
  cover: string;
  link: string;
  event_time: string;
  event_time_at: number;
  active_time: string;
  active_time_at: number;
}

/**
 * 爬取抖音热搜榜 (API 版本)
 */
export async function getDouyinHotSearch(): Promise<DouyinHotSearchItem[]> {
  try {
    const response = await axios.get(
      "https://service-60s-202900-6-1388644494.sh.run.tcloudbase.com/v2/douyin",
      {
        timeout: 10000,
      }
    );

    if (
      response.data &&
      response.data.code === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data.map((item: DouyinApiItem, index: number) => ({
        rank: index + 1,
        title: item.title,
        hot: (item.hot_value / 10000).toFixed(1) + "万", // Convert to "万" format
        link: item.link,
        iconType: getIconType(index),
        originalData: item,
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
    const hotSearchList = await getDouyinHotSearch();

    res.json({
      code: 0,
      message: "获取成功",
      data: {
        list: hotSearchList,
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
