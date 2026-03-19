## ADDED Requirements

### Requirement: Edit page routing

The system SHALL provide an edit page accessible at `/blog/edit?id=xxx`.

#### Scenario: Access edit page for existing diary

- **WHEN** user navigates to `/blog/edit?id=20260318`
- **THEN** the system SHALL display the edit form with the diary content pre-filled

#### Scenario: Access edit page for new diary

- **WHEN** user navigates to `/blog/edit` (without id parameter)
- **THEN** the system SHALL display an empty form for creating a new diary

### Requirement: Edit form fields

The edit form SHALL include the following fields:
- Date picker for selecting the diary date (ID)
- Textarea for the diary content

#### Scenario: Form display for existing diary

- **WHEN** editing an existing diary
- **THEN** the date field SHALL be disabled (cannot change the ID of existing diary)
- **AND** the content textarea SHALL be pre-filled with existing content

#### Scenario: Form display for new diary

- **WHEN** creating a new diary
- **THEN** the date field SHALL default to today's date
- **AND** the content textarea SHALL be empty

### Requirement: Save diary action

The edit page SHALL provide a save button to persist diary changes.

#### Scenario: Save new diary

- **WHEN** user clicks save on a new diary form
- **THEN** the system SHALL call `POST /api/diary` with the form data
- **AND** redirect to `/blog/detail?id=xxx` on success

#### Scenario: Save existing diary

- **WHEN** user clicks save on an existing diary form
- **THEN** the system SHALL call `PUT /api/diary/:id` with the form data
- **AND** redirect to `/blog/detail?id=xxx` on success

#### Scenario: Save with validation error

- **WHEN** user clicks save with invalid or missing required fields
- **THEN** the system SHALL display validation error messages
- **AND** NOT submit the form

### Requirement: Cancel action

The edit page SHALL provide a cancel button to discard changes.

#### Scenario: Cancel editing

- **WHEN** user clicks cancel
- **THEN** the system SHALL redirect to `/blog` (list page)
