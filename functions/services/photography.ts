import { Env } from "../types";

export const DEFAULT_STYLES: Record<string, string> = {
  清除路人:
    "专业后期修图，智能移除画面背景中的路人、杂物和干扰元素，智能填充背景，保持画面自然完整，构图干净整洁。",
  一键美化:
    "大师级人像精修，自然磨皮美白，亮眼提神，五官立体化，肤色均匀通透，调整光影质感，增强画面清晰度，杂志封面级修图。",
  动漫风格:
    "二次元动漫风格，日本动画电影质感，新海诚画风，唯美光影，细腻笔触，梦幻色彩，2D插画效果。",
  更换天气: "调整环境天气效果，模拟自然真实的气象氛围，将天气更改为：",
};

export function getPhotographyStylePrompt(title: string): string | null {
  if (DEFAULT_STYLES[title]) {
    return DEFAULT_STYLES[title];
  }
  return null;
}
