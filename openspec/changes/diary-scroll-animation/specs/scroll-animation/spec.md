## ADDED Requirements

### Requirement: Content blocks animate on scroll into viewport
The system SHALL animate content blocks when they enter the viewport during scrolling.

#### Scenario: Block enters viewport
- **WHEN** a user scrolls and a content block becomes 20% visible in the viewport
- **THEN** the block SHALL animate from opacity 0 and translateY 30px to opacity 1 and translateY 0

#### Scenario: Animation timing
- **WHEN** a block animation is triggered
- **THEN** the animation SHALL complete within 600ms using cubic-bezier(0.4, 0, 0.2, 1) easing

### Requirement: Animation uses Intersection Observer API
The system SHALL use the native Intersection Observer API to detect viewport entry.

#### Scenario: Observer initialization
- **WHEN** the diary page loads with content blocks
- **THEN** the system SHALL create an Intersection Observer with threshold 0.2

#### Scenario: Cleanup on unmount
- **WHEN** the diary page is unmounted
- **THEN** the system SHALL disconnect the Intersection Observer to prevent memory leaks

### Requirement: Animation respects reduced motion preference
The system SHALL respect the user's prefers-reduced-motion setting.

#### Scenario: Reduced motion enabled
- **WHEN** the user has prefers-reduced-motion: reduce enabled
- **THEN** all blocks SHALL be visible immediately without animation

### Requirement: Each block animates independently
The system SHALL animate each content block independently as it enters the viewport.

#### Scenario: Multiple blocks in viewport
- **WHEN** multiple blocks are in the viewport simultaneously
- **THEN** each block SHALL animate independently based on its own visibility state

### Requirement: Animation triggers only once per block
The system SHALL trigger the entrance animation only once for each block.

#### Scenario: Block re-enters viewport after animation
- **WHEN** a block that has already animated leaves and re-enters the viewport
- **THEN** the block SHALL remain visible without re-triggering the animation
