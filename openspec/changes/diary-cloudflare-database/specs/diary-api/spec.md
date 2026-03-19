## ADDED Requirements

### Requirement: Get diary list API

The system SHALL provide a `GET /api/diary/list` endpoint that returns all diary IDs.

#### Scenario: Successful list retrieval

- **WHEN** a GET request is made to `/api/diary/list`
- **THEN** the system SHALL return a JSON response with `{ success: true, data: ["20260318", "20260316", ...] }`

#### Scenario: Empty list

- **WHEN** no diaries exist in the database
- **THEN** the system SHALL return `{ success: true, data: [] }`

### Requirement: Get diary by ID API

The system SHALL provide a `GET /api/diary/:id` endpoint that returns a single diary.

#### Scenario: Successful diary retrieval

- **WHEN** a GET request is made to `/api/diary/20260318` with a valid ID
- **THEN** the system SHALL return `{ success: true, data: { id: "20260318", content: "...", created_at: "...", updated_at: "..." } }`

#### Scenario: Diary not found

- **WHEN** a GET request is made to `/api/diary/invalid-id`
- **THEN** the system SHALL return `{ success: false, error: "Diary not found" }` with 404 status

### Requirement: Create diary API

The system SHALL provide a `POST /api/diary` endpoint to create a new diary.

#### Scenario: Successful creation

- **WHEN** a POST request is made to `/api/diary` with body `{ id: "20260319", content: "Today's diary..." }`
- **THEN** the system SHALL create the diary and return `{ success: true, data: { id: "20260319", content: "..." } }` with 201 status

#### Scenario: Duplicate ID

- **WHEN** a POST request is made with an ID that already exists
- **THEN** the system SHALL return `{ success: false, error: "Diary already exists" }` with 409 status

#### Scenario: Invalid ID format

- **WHEN** a POST request is made with an invalid ID format (not YYYYMMDD)
- **THEN** the system SHALL return `{ success: false, error: "Invalid ID format" }` with 400 status

### Requirement: Update diary API

The system SHALL provide a `PUT /api/diary/:id` endpoint to update an existing diary.

#### Scenario: Successful update

- **WHEN** a PUT request is made to `/api/diary/20260318` with body `{ content: "Updated content..." }`
- **THEN** the system SHALL update the diary and return `{ success: true, data: { id: "20260318", content: "..." } }`

#### Scenario: Diary not found

- **WHEN** a PUT request is made to `/api/diary/invalid-id`
- **THEN** the system SHALL return `{ success: false, error: "Diary not found" }` with 404 status
