# Feature Specification: HousecatPage Hamburger Menu on Small Screens

**Feature Branch**: `006-housecat-hamburger`
**Created**: 2026-02-23
**Status**: Draft
**Input**: User description: "On smaller screens, i would like a hamburger menu on the housecatpage pages"

## User Scenarios & Testing _(mandatory)_

### User Story 1 – Visitor navigates the site on a mobile device (Priority: P1)

A visitor opens a `/new/*` page on a phone or small tablet. Instead of a row of small navigation links crammed into a narrow header, they see a single hamburger icon (☰) on the right side of the header. Tapping it opens a menu showing all navigation links. Tapping a link navigates to that page and the menu closes. Tapping outside the menu or the icon again also closes it.

**Why this priority**: This is the entire deliverable. Without it, the nav is unusable on small screens.

**Independent Test**: Open any `/new/*` page at a viewport width of 375 px (iPhone SE). Confirm the horizontal nav links are hidden and a hamburger icon is visible. Tap the icon — confirm all nav links appear. Tap a link — confirm navigation occurs and the menu closes. Tap outside — confirm the menu closes. Check that on a 900 px viewport the hamburger is gone and the regular nav is visible.

**Acceptance Scenarios**:

1. **Given** a viewport width at or below the mobile breakpoint, **When** the page loads, **Then** the horizontal navigation links are hidden and a hamburger icon is displayed in the header.
2. **Given** the hamburger icon is visible, **When** a visitor taps it, **Then** an overlay or dropdown panel appears showing all navigation links.
3. **Given** the menu panel is open, **When** a visitor taps any navigation link, **Then** the browser navigates to that page and the menu closes automatically.
4. **Given** the menu panel is open, **When** a visitor taps outside the menu panel, **Then** the menu closes without navigating.
5. **Given** a viewport width above the mobile breakpoint, **When** the page loads, **Then** the hamburger icon is hidden and the regular horizontal navigation is shown — identical to the current desktop behaviour.

---

### User Story 2 – Visitor can see which page they are on from inside the open menu (Priority: P2)

When the mobile menu panel is open, the link for the currently active page is visually distinguished from the others — the same active styling used in the desktop nav is mirrored inside the mobile menu.

**Why this priority**: Orientation within the site is important for usability; however the menu still functions without this styling so it is lower priority.

**Independent Test**: Navigate to `/new/about`. Shrink the viewport below the breakpoint, open the hamburger menu, and confirm the "About" link appears different (e.g. darker colour or underline) compared to the other links.

**Acceptance Scenarios**:

1. **Given** the mobile menu panel is open on any page, **When** the visitor views the menu, **Then** the link for the current page is visually distinct from inactive links.

---

### Edge Cases

- What happens when there is only one navigation link? The hamburger should still appear and the single link should be tappable.
- What happens when the page is scrolled and the user opens the menu? The menu panel should appear overlaid on the current scroll position without the page jumping.
- What happens when the user rotates the device from portrait to landscape, crossing the breakpoint? The menu panel should close and the desktop nav should appear without a broken layout.
- What happens when there are many navigation links that would overflow the menu panel height? The menu panel should be scrollable rather than clipping links.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: At viewport widths at or below 768 px, the HousecatPage header MUST hide the horizontal navigation links and display a hamburger toggle icon instead.
- **FR-002**: At viewport widths above 768 px, the hamburger icon MUST be hidden and the horizontal navigation links MUST be displayed — identical to the current desktop layout.
- **FR-003**: Tapping or clicking the hamburger icon MUST toggle a menu panel open or closed.
- **FR-004**: The menu panel MUST list all `/new/*` navigation links (those with a `navText` value), one per row, in the same order as the desktop nav.
- **FR-005**: Tapping a menu link MUST navigate to the corresponding page and close the menu panel.
- **FR-006**: Tapping or clicking outside the open menu panel MUST close it without navigating.
- **FR-007**: The currently active page link MUST be visually distinguished inside the open menu panel, consistent with the active state used in the desktop nav.
- **FR-008**: The menu panel MUST not cause horizontal overflow or a horizontal scrollbar at any supported viewport width.
- **FR-009**: All other aspects of the HousecatPage — hero image, content, gallery, footer, and non-nav header elements (logo, rule) — MUST be unaffected by this change.
- **FR-010**: No changes to `pages.json`, `images.json`, routing, or any component other than `HousecatPage.tsx` are required to implement this feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: At a 375 px viewport width, the horizontal nav links are not visible and exactly one hamburger icon is visible in the header.
- **SC-002**: At a 1024 px viewport width, the hamburger icon is not visible and all nav links with a `navText` value are visible in the header row.
- **SC-003**: Opening the menu, tapping a link, and arriving at the target page requires no more than 2 taps from any `/new/*` page on a mobile device.
- **SC-004**: No horizontal scrollbar appears at any viewport width from 320 px to 1920 px as a result of this change.
- **SC-005**: All existing `/new/*` routes continue to load and navigate correctly after the change — zero regressions in routes, content, gallery, or desktop layout.

## Assumptions

- The mobile breakpoint is defined at 768 px, which covers phones and most portrait-orientation tablets. This is a wider threshold than the existing 480 px header-stacking breakpoint from feature 005; both can coexist since the hamburger replaces the nav entirely below 768 px.
- The menu panel design should follow the housecat aesthetic: white or off-white background, `Source Sans Pro` typeface, subtle border or shadow, light and minimal — no heavy dark overlays.
- No icon library needs to be added; the hamburger can be rendered as plain Unicode (☰) or three CSS-drawn bars to keep the dependency footprint minimal.
- The feature is scoped to `HousecatPage.tsx` only. The existing `Menu.tsx` component used by `ResponsivePage` is not affected.
