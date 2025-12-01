import { HotSearchItem } from "./types";

interface HotSearchResponse {
  code: number;
  data: {
    list: HotSearchItem[];
    summary?: string;
    count: number;
    timestamp: string;
  };
  message?: string;
}

export const getWeiboHotSearch = async (): Promise<{
  list: HotSearchItem[];
  summary?: string;
}> => {
  try {
    const response = await fetch("/api/weibo-hot-search");

    if (!response.ok) {
      throw new Error("获取热搜失败，请稍后再试");
    }

    const result: HotSearchResponse = await response.json();

    if (result.code !== 0) {
      throw new Error(result.message || "获取热搜返回错误");
    }

    return { list: result.data.list, summary: result.data.summary };
  } catch (error) {
    console.error("Error fetching weibo hot search:", error);
    throw error;
  }
};

export const getDouyinHotSearch = async (): Promise<{
  list: HotSearchItem[];
  summary?: string;
}> => {
  try {
    const response = await fetch("/api/douyin-hot-search");

    if (!response.ok) {
      throw new Error("获取热搜失败，请稍后再试");
    }

    const result: HotSearchResponse = await response.json();

    if (result.code !== 0) {
      throw new Error(result.message || "获取热搜返回错误");
    }

    return { list: result.data.list, summary: result.data.summary };
  } catch (error) {
    console.error("Error fetching douyin hot search:", error);
    throw error;
  }
};

export const getXiaohongshuHotSearch = async (): Promise<{
  list: HotSearchItem[];
  summary?: string;
}> => {
  try {
    const response = await fetch("/api/xiaohongshu-hot-search");

    if (!response.ok) {
      throw new Error("获取热搜失败，请稍后再试");
    }

    const result: HotSearchResponse = await response.json();

    if (result.code !== 0) {
      throw new Error(result.message || "获取热搜返回错误");
    }

    return { list: result.data.list, summary: result.data.summary };
  } catch (error) {
    console.error("Error fetching xiaohongshu hot search:", error);
    throw error;
  }
};
