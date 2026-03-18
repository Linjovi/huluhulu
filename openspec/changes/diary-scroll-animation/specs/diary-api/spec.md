## ADDED Requirements

### Requirement: API returns rich text content for client-side parsing
The diary API SHALL continue to return rich text HTML content for client-side parsing into blocks.

#### Scenario: Successful diary fetch with rich text
- **WHEN** a client requests a diary entry via GET /api/blog/get?id={id}
- **THEN** the response SHALL include a "content" field containing the rich text HTML
- **AND** the client SHALL parse the HTML into blocks for animated rendering

#### Scenario: Rich text format
- **WHEN** a diary entry contains formatted content
- **THEN** the content field SHALL contain valid HTML with supported tags (p, div, img, h1-h6, br, span, strong, em)

### Requirement: API maintains existing response structure
The diary API SHALL maintain the existing response structure without changes.

#### Scenario: Response structure unchanged
- **WHEN** a diary entry is successfully retrieved
- **THEN** the data object SHALL include: id, title, content, mood, weather, date, and author fields
- **AND** the response format SHALL remain backward compatible
