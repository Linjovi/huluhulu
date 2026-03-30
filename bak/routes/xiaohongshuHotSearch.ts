import axios from "axios";
import { Request, Response } from "express";

const xhsApiUrl = "https://edith.xiaohongshu.com/api/sns/v1/search/hot_list";

const xhsHeaders = {
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.7(0x18000733) NetType/WIFI Language/zh_CN",
  referer: "https://app.xhs.cn/",
  "xy-direction": "22",
  shield:
    "XYAAAAAQAAAAEAAABTAAAAUzUWEe4xG1IYD9/c+qCLOlKGmTtFa+lG434Oe+FTRagxxoaz6rUWSZ3+juJYz8RZqct+oNMyZQxLEBaBEL+H3i0RhOBVGrauzVSARchIWFYwbwkV",
  "xy-platform-info":
    "platform=iOS&version=8.7&build=8070515&deviceId=C323D3A5-6A27-4CE6-AA0E-51C9D4C26A24&bundle=com.xingin.discover",
  "xy-common-params":
    "app_id=ECFAAF02&build=8070515&channel=AppStore&deviceId=C323D3A5-6A27-4CE6-AA0E-51C9D4C26A24&device_fingerprint=20230920120211bd7b71a80778509cf4211099ea911000010d2f20f6050264&device_fingerprint1=20230920120211bd7b71a80778509cf4211099ea911000010d2f20f6050264&device_model=phone&fid=1695182528-0-0-63b29d709954a1bb8c8733eb2fb58f29&gid=7dc4f3d168c355f1a886c54a898c6ef21fe7b9a847359afc77fc24ad&identifier_flag=0&lang=zh-Hans&launch_id=716882697&platform=iOS&project_id=ECFAAF&sid=session.1695189743787849952190&t=1695190591&teenager=0&tz=Asia/Shanghai&uis=light&version=8.7",
};

interface RednoteRawResponse {
  success: boolean;
  msg: string;
  data: {
    items: {
      word_type: string;
      score: string;
      rank_change: number;
      title_img: string;
      title: string;
      id: string;
      icon?: string;
      type: string;
    }[];
    is_new_hot_list_exp: boolean;
    host: string;
    background_color: object;
    scene: string;
    result: { success: boolean };
    word_request_id: string;
    hot_list_id: string;
    title: string;
  };
  code: number;
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
    const response = await axios.get<RednoteRawResponse>(xhsApiUrl, {
      headers: xhsHeaders,
      timeout: 10000, // 10s timeout
    });

    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.items)
    ) {
      return response.data.data.items.map((item, idx) => ({
        rank: idx + 1,
        title: item.title,
        link: `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(
          item.title
        )}&type=51`,
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
