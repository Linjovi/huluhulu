import axios from "axios";

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
