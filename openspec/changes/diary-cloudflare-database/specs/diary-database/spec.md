## ADDED Requirements

### Requirement: Diary table structure

The system SHALL maintain a `diaries` table in Cloudflare D1 with the following schema:
- `id` TEXT PRIMARY KEY - 日期格式 YYYYMMDD
- `content` TEXT NOT NULL - 日记纯文本内容
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

#### Scenario: Table creation

- **WHEN** the database migration is executed
- **THEN** the `diaries` table SHALL be created with the specified schema

### Requirement: Diary data access

The system SHALL provide data access functions for diary operations:
- `getDiaryList()` - 获取所有日记日期列表
- `getDiaryById(id: string)` - 根据 ID 获取单篇日记
- `createDiary(id: string, content: string)` - 创建新日记
- `updateDiary(id: string, content: string)` - 更新现有日记

#### Scenario: Get diary list

- **WHEN** `getDiaryList()` is called
- **THEN** the system SHALL return an array of diary IDs sorted by date descending

#### Scenario: Get diary by ID

- **WHEN** `getDiaryById(id)` is called with a valid ID
- **THEN** the system SHALL return the diary data including id, content, created_at, and updated_at

#### Scenario: Get non-existent diary

- **WHEN** `getDiaryById(id)` is called with an invalid ID
- **THEN** the system SHALL return null

#### Scenario: Create diary

- **WHEN** `createDiary(id, content)` is called with valid parameters
- **THEN** the system SHALL insert a new record with the current timestamp

#### Scenario: Update diary

- **WHEN** `updateDiary(id, content)` is called with a valid ID
- **THEN** the system SHALL update the content and set updated_at to current timestamp
