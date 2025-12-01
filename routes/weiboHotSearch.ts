import axios from "axios";
import { Request, Response } from "express";

interface WeiboHotSearchItem {
  rank: number | string | null;
  title: string;
  link: string | null;
  hot: string | null;
  iconType: string | null;
}

interface WeiboApiItem {
  title: string;
  hot_value: number;
  link: string;
}

/**
 * 获取微博热搜榜 (API 版本)
 */
export async function getWeiboHotSearch(): Promise<WeiboHotSearchItem[]> {
  try {
    const response = await axios.get(
      "https://service-60s-202900-6-1388644494.sh.run.tcloudbase.com/v2/weibo",
      {
        timeout: 10000,
      }
    );

    if (
      response.data &&
      response.data.code === 200 &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data.map((item: WeiboApiItem, index: number) => ({
        rank: index + 1,
        title: item.title,
        link: item.link,
        hot: item.hot_value ? item.hot_value.toString() : null,
        iconType: index < 3 ? "hot" : null, // Top 3 get 'hot' icon
      }));
    }

    return [];
  } catch (error) {
    console.error("获取微博热搜榜错误:", error);
    return [];
  }
}

/**
 * 微博热搜榜接口路由处理
 */
export async function weiboHotSearchHandler(req: Request, res: Response) {
  try {
    const hotSearchList = await getWeiboHotSearch();

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
    console.error("微博热搜榜接口错误:", error);

    res.status(500).json({
      code: 500,
      message: error.message || "获取微博热搜榜失败，请稍后再试",
    });
  }
}
