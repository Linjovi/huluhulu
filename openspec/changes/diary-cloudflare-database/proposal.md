## Why

当前日记系统使用静态文件存储（txt 文件 + index.json），无法支持在线编辑和动态更新。用户需要将日记数据迁移到 Cloudflare D1 数据库，并新增编辑页面实现日记的在线创建和修改功能。

## What Changes

- **数据存储迁移**: 从静态文件存储迁移到 Cloudflare D1 数据库
- **新增编辑页面**: `/blog/edit?id=xxx` 页面，支持新增和编辑日记
- **新增 API 接口**: 日记的增删改查接口（暂不实现删除功能）
- **数据迁移脚本**: 将现有静态文件数据导入 D1 数据库

## Capabilities

### New Capabilities

- `diary-database`: Cloudflare D1 数据库表结构与数据访问层
- `diary-api`: 日记 CRUD API 接口（创建、读取、更新）
- `diary-editor`: 日记编辑页面，支持新增和编辑功能

### Modified Capabilities

无现有 capability 需要修改。

## Impact

- **数据库**: 新增 Cloudflare D1 数据库表
- **API**: 新增 `/api/diary/*` 系列接口
- **前端**: 新增 `blog/edit` 页面入口
- **数据迁移**: 需要将现有 `diary/content/` 目录下的 txt 文件导入数据库
- **部署配置**: 需要配置 wrangler.toml 中的 D1 数据库绑定
