## 1. Frontend Type Definitions

- [x] 1.1 Create `DiaryBlock` interface with id, type, content, caption fields
- [x] 1.2 Define block type constants ('text' | 'image')
- [x] 1.3 Add parsing utility types

## 2. HTML Parser Implementation

- [x] 2.1 Create `parseHtmlToBlocks` utility function using DOMParser
- [x] 2.2 Implement text block parsing (p, div, h1-h6, span, strong, em)
- [x] 2.3 Implement image block parsing (img with src and alt)
- [x] 2.4 Handle br and line break elements
- [x] 2.5 Add fallback for unknown HTML tags
- [x] 2.6 Add unit tests for parser

## 3. Content Block Components

- [x] 3.1 Create `TextBlock` component with proper typography
- [x] 3.2 Create `ImageBlock` component with lazy loading
- [x] 3.3 Create `DiaryBlockRenderer` to route block types
- [x] 3.4 Add skeleton placeholder for image loading state

## 4. Scroll Animation System

- [x] 4.1 Create `useScrollAnimation` hook with Intersection Observer
- [x] 4.2 Implement animation CSS with transform and opacity
- [x] 4.3 Add `prefers-reduced-motion` media query support
- [x] 4.4 Ensure animation triggers only once per block

## 5. Diary Page Refactor

- [x] 5.1 Integrate `parseHtmlToBlocks` into diary data flow
- [x] 5.2 Replace `dangerouslySetInnerHTML` with block-based rendering
- [x] 5.3 Integrate scroll animation with block components
- [x] 5.4 Add error handling for parsing failures
- [x] 5.5 Keep fallback rendering for edge cases

## 6. Testing & Validation

- [x] 6.1 Test parser with various rich text formats
- [x] 6.2 Test diary page with text-only content
- [x] 6.3 Test diary page with image blocks
- [x] 6.4 Test mixed text and image content
- [x] 6.5 Verify animation works on mobile devices
- [x] 6.6 Test with reduced motion preference enabled
