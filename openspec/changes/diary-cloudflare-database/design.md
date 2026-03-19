## Context

当前日记系统使用静态文件存储方案：
- 日记内容存储在 `public/diary/content/{date}.txt` 文件中
- 日记列表存储在 `public/diary/content/index.json` 中
- 前端通过读取这些静态文件渲染日记内容

这种方案无法支持在线编辑功能，用户需要手动修改 txt 文件并重新部署。

## Goals / Non-Goals

**Goals:**
- 将日记数据迁移到 Cloudflare D1 数据库
- 实现日记的在线创建和编辑功能
- 保持现有日记页面的展示功能不变
- 提供数据迁移脚本将现有 txt 文件导入数据库

**Non-Goals:**
- 日记删除功能（暂不实现）
- 用户认证系统（假设单用户场景）
- 富文本编辑器（保持纯文本格式）

## Decisions

### 数据库表结构

使用单表设计，表名为 `diaries`：

```sql
CREATE TABLE diaries (
  id TEXT PRIMARY KEY,  -- 日期格式 YYYYMMDD
  content TEXT NOT NULL, -- 日记纯文本内容
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Rationale:**
- 使用日期作为主键，保持与现有系统一致的 ID 格式
- 单表设计足够满足当前需求，避免过度设计
- 保留 created_at 和 updated_at 用于追踪

### API 设计

采用 RESTful 风格：

- `GET /api/diary/list` - 获取日记列表（返回日期数组）
- `GET /api/diary/:id` - 获取单篇日记
- `POST /api/diary` - 创建日记
- `PUT /api/diary/:id` - 更新日记

**Rationale:**
- 与项目现有 API 风格保持一致
- 路径参数使用日期 ID，语义清晰

### 编辑页面设计

- 路由：`/blog/edit?id=xxx`
- 使用 query 参数而非 path 参数，与现有详情页 `/blog/detail?id=xxx` 保持一致
- 新增时 id 参数为空或省略
- 编辑时 id 参数为日期字符串

### 数据迁移

编写一次性脚本 `scripts/migrate-diaries.ts`：
1. 读取 `public/diary/content/` 目录下的所有 txt 文件
2. 将内容插入 D1 数据库
3. 保留静态文件作为备份

## Risks / Trade-offs

- **[Risk]** D1 数据库有写入限制（每秒 5 次写入）
  - **Mitigation:** 日记编辑频率低，不会触及限制；如需批量导入使用事务批量提交

- **[Risk]** 数据迁移后静态文件与数据库不同步
  - **Mitigation:** 迁移后静态文件仅作为备份，所有读写操作都通过数据库

- **[Trade-off]** 纯文本格式不支持富文本编辑
  - **Acceptance:** 保持与现有系统一致，如需富文本后续可升级

## Migration Plan

1. **准备阶段**
   - 创建 D1 表结构
   - 运行数据迁移脚本

2. **部署阶段**
   - 部署 API 接口
   - 部署编辑页面
   - 更新前端读取逻辑（优先从 API 读取，降级到静态文件）

3. **验证阶段**
   - 测试日记列表接口
   - 测试日记详情接口
   - 测试创建和编辑功能

4. **清理阶段**（可选）
   - 移除静态文件读取逻辑
   - 删除备份文件

## Open Questions

无
