## Why

当前日记页面使用富文本一次性渲染所有内容，缺乏叙事节奏感和视觉吸引力。用户希望通过滚动触发的分段动画效果，让日记阅读体验更加生动有趣，同时支持图文混排的内容结构。

## What Changes

- **富文本解析器**: 新增前端 HTML 解析器，将富文本内容解析为段落块结构
- **前端页面重构**: 重写 `blog.tsx`，实现滚动触发的逐段动画显示效果
- **动画系统**: 添加 Intersection Observer 驱动的入场动画，每段内容独立触发
- **组件化渲染**: 根据块类型（文本/图片）使用不同组件渲染

## Capabilities

### New Capabilities

- `diary-block-structure`: 富文本解析为段落块的数据结构定义
- `scroll-animation`: 滚动触发的内容分段动画显示系统
- `diary-content-renderer`: 日记内容渲染器，根据块类型渲染不同组件

### Modified Capabilities

- `diary-api`: 无变更，API 继续返回富文本 HTML，由前端解析

## Impact

- **数据库**: 无变更，保持现有 `content` 富文本字段
- **API**: 无变更，`/api/blog/get` 继续返回富文本 HTML
- **前端**: `blog.tsx` 重构，移除 `dangerouslySetInnerHTML`，新增解析器和动画系统
- **数据迁移**: 无需迁移，现有数据完全兼容
