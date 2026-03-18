## ADDED Requirements

### Requirement: Diary block structure supports text and image types
The system SHALL parse rich text HTML into a block-based content structure that supports text and image content types.

#### Scenario: Text block parsing
- **WHEN** the system parses rich text containing paragraph or div elements
- **THEN** the system SHALL create text blocks with the element's text content

#### Scenario: Image block parsing
- **WHEN** the system parses rich text containing img elements
- **THEN** the system SHALL create image blocks with src as content and alt as caption

### Requirement: Each block has a unique identifier
The system SHALL assign a unique identifier to each parsed block within a diary entry.

#### Scenario: Block identifier generation
- **WHEN** rich text is parsed into blocks
- **THEN** each block SHALL have a unique id field based on its index for React key prop usage

### Requirement: HTML parser supports common rich text tags
The system SHALL parse common rich text HTML tags into appropriate block types.

#### Scenario: Supported text tags
- **WHEN** the parser encounters p, div, h1-h6, span elements
- **THEN** the system SHALL create text blocks with the element's content

#### Scenario: Supported image tags
- **WHEN** the parser encounters img elements
- **THEN** the system SHALL create image blocks with src and optional caption

#### Scenario: Line break handling
- **WHEN** the parser encounters br elements
- **THEN** the system SHALL handle them appropriately within text blocks

### Requirement: Parser handles unknown tags gracefully
The system SHALL handle unknown or unsupported HTML tags without breaking.

#### Scenario: Unknown tag fallback
- **WHEN** the parser encounters an unsupported HTML tag
- **THEN** the system SHALL extract its text content and create a text block
