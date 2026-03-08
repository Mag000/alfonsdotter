# Feature Specification: Housecat Header — Logo Left, Nav Right

**Feature Branch**: `005-housecat-header`
**Created**: 2026-02-23
**Status**: Draft
**Input**: User description: "The logo of the Housecatpage template should be left aligned and the menu right aligned on the same vertical level"

## User Scenarios & Testing _(mandatory)_

### User Story 1 – Visitor sees logo and navigation in a single horizontal header bar (Priority: P1)

A visitor opens any `/new/*` page and immediately sees the site logo on the left side of the header and the navigation links aligned to the right — both sitting on the same horizontal baseline, the way a typical portfolio site header is laid out.

**Why this priority**: This is the entire deliverable. It is a focused visual layout change with no dependencies.

**Independent Test**: Load any `/new/*` page in a browser. Visually confirm that the logo appears in the top-left and the navigation links appear in the top-right, both vertically centred on the same row. Resize the window to confirm the header does not break at any common viewport width.

**Acceptance Scenarios**:

1. **Given** a visitor loads any `/new/*` page, **When** the page renders, **Then** the site logo is displayed on the left side of the header and the navigation links are displayed on the right side, both on the same row.
2. **Given** the header is visible, **When** measured visually, **Then** the vertical midpoint of the logo and the vertical midpoint of the navigation links are aligned to within a few pixels.
3. **Given** a viewport wider than 480 px, **When** the page loads, **Then** logo and nav appear side by side in a single row without wrapping.
4. **Given** a very narrow viewport (≤ 480 px), **When** the page loads, **Then** the header degrades gracefully — logo and nav either stack vertically or the nav collapses — without any elements overflowing or overlapping.

---

### Edge Cases

- What happens when the logo image is taller than the nav text? Both elements should remain vertically centred relative to each other rather than top-aligned.
- What happens when there are many navigation items that cannot fit on one line? The nav may wrap within its own space, but the logo must stay pinned to the left without shifting.
- What happens when there is no logo image available? The navigation links should still appear right-aligned without a gap or layout shift on the left side.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The HousecatPage header MUST arrange the logo and navigation links in a single horizontal row, with the logo flush to the left and the navigation flush to the right.
- **FR-002**: The logo and navigation links MUST be vertically centred relative to each other within the header row.
- **FR-003**: The header layout MUST be responsive: on viewports wider than 480 px the logo-left / nav-right arrangement is preserved; on narrower viewports the header MUST degrade gracefully without content overflow or horizontal scrolling.
- **FR-004**: When no logo image is present, the navigation links MUST remain right-aligned and the layout MUST NOT produce visual imbalance or unexpected spacing.
- **FR-005**: All other aspects of the HousecatPage header — typography, colours, active-link indication, the decorative horizontal rule below the header, and click navigation — MUST remain unchanged.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: On a 1280 px-wide viewport, the logo left edge is within 24 px of the page left boundary and the rightmost navigation link is within 24 px of the page right boundary.
- **SC-002**: The vertical midpoint of the logo and the vertical midpoint of the navigation links differ by no more than 4 px at any viewport width above 480 px.
- **SC-003**: No horizontal scrollbar appears on any viewport from 320 px to 1920 px as a result of this change.
- **SC-004**: All existing `/new/*` routes continue to load and navigate correctly after the change — zero regressions in functionality.

## Assumptions

- The change is scoped entirely to the header section of `HousecatPage.tsx`; no other component or file requires modification.
- The responsive breakpoint for "narrow" is defined at ≤ 480 px, consistent with the component's existing media query conventions.
- The logo image source continues to come from the root `/new` page entry's `logoImage` field — no data model changes are needed.
- The horizontal rule separating the header from the page content remains below the full header row (spanning the full width under both logo and nav).
