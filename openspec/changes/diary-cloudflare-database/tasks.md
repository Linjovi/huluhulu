## 1. 数据库准备

- [x] 1.1 创建 D1 数据库迁移文件 `migrations/0001_create_diaries.sql`
- [x] 1.2 执行数据库迁移创建 diaries 表
- [x] 1.3 创建数据访问层 `functions/services/diary.ts`（getDiaryList, getDiaryById, createDiary, updateDiary）

## 2. API 接口开发

- [x] 2.1 创建 `functions/api/diary/list.ts` - GET /api/diary/list 接口
- [x] 2.2 创建 `functions/api/diary/[id].ts` - GET /api/diary/:id 接口
- [x] 2.3 创建 `functions/api/diary/create.ts` - POST /api/diary 接口
- [x] 2.4 创建 `functions/api/diary/update.ts` - PUT /api/diary/:id 接口

## 3. 数据迁移

- [x] 3.1 创建迁移脚本 `scripts/migrate-diaries.ts`
- [x] 3.2 执行迁移脚本将 txt 文件导入数据库

## 4. 编辑页面开发

- [x] 4.1 创建 `src/blog-edit.html` 和 `src/blog-edit.tsx` 入口文件
- [x] 4.2 更新 `webpack.config.js` 添加 blog-edit 入口
- [x] 4.3 创建 `src/apps/diary/components/DiaryEditor.tsx` 编辑器组件
- [x] 4.4 创建 `src/apps/diary/api.ts` 前端 API 调用函数

## 5. 前端集成

- [x] 5.1 更新 `src/apps/diary/components/DiaryContent.tsx` 从 API 获取数据
- [x] 5.2 在 `/blog` 列表页添加"新建日记"入口按钮
- [x] 5.3 在 `/blog/detail` 详情页添加"编辑"入口按钮

## 6. 测试验证

- [x] 6.1 测试日记列表接口
- [x] 6.2 测试日记详情接口
- [x] 6.3 测试新建日记功能
- [x] 6.4 测试编辑日记功能
