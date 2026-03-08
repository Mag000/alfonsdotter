# Feature Specification: Housecat-Style Page Template

**Feature Branch**: `003-housecat-style-template`
**Created**: 2026-02-23
**Status**: Draft
**Input**: User description: "A new template that follows the same pattern as the other with the pages.json that should be activated if the path starts with /new. The design of the page should assemble the page https://www.housecatillustration.com/. The other templates should be preserved"

## User Scenarios & Testing _(mandatory)_

### User Story 1 – Visitor browses the /new site (Priority: P1)

A visitor opens a URL that starts with `/new` and sees a visually distinct site with a large full-width hero image, a bold headline, and clean horizontal navigation. The look and feel is light, airy, and illustration-friendly — inspired by housecatillustration.com. Nothing about this visit affects the existing yoga or form sites.

**Why this priority**: This is the core deliverable. Without it, no other story has context.

**Independent Test**: Navigate to `/new` in a browser. Verify the hero image fills the viewport width, the headline is displayed, and navigation links appear for all `/new/*` sub-pages. Verify that visiting `/yoga` or `/` still renders the original templates unchanged.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to `/new`, **When** the page loads, **Then** a full-width hero image is displayed with an overlaid or immediately adjacent headline.
2. **Given** the `/new` site has sub-pages defined in the content, **When** the page loads, **Then** a horizontal navigation bar shows only the `/new/*` sub-page links.
3. **Given** a visitor is on any `/new/*` page, **When** they navigate to `/yoga` or `/`, **Then** those pages render with their original templates, unaffected.

---

### User Story 2 – Visitor views the portfolio gallery (Priority: P2)

A visitor on the portfolio page (e.g. `/new/portfolio`) sees a masonry-style image grid. Clicking an image opens a larger view. The gallery is driven entirely by `pages.json` gallery items — no hardcoded content.

**Why this priority**: The gallery is the primary content showcase for an illustrator site.

**Independent Test**: Add gallery items under a `/new/portfolio` entry in `pages.json`. Load the page and confirm items appear in a multi-column grid layout. Click one image to confirm it expands.

**Acceptance Scenarios**:

1. **Given** a portfolio page with gallery items defined in `pages.json`, **When** a visitor loads the page, **Then** images are displayed in a multi-column masonry or grid layout.
2. **Given** a gallery grid is visible, **When** a visitor clicks an image, **Then** a larger version of the image is shown.
3. **Given** no gallery items are defined on the page, **When** the portfolio page loads, **Then** an appropriate empty state is shown rather than a broken layout.

---

### User Story 3 – Visitor views an about/bio section (Priority: P3)

A visitor on an about page (e.g. `/new/about`) sees a portrait image alongside a bio text. Both are sourced from `pages.json`.

**Why this priority**: Supports the personal brand story; important but not blocking for launch.

**Independent Test**: Define a `/new/about` page in `pages.json` with a `leadImage` and `text`. Load the page and confirm the portrait and text appear side-by-side on wider screens, stacked on narrow screens.

**Acceptance Scenarios**:

1. **Given** an about page with `leadImage` and `text` in `pages.json`, **When** a visitor loads the page on desktop, **Then** the image and text are displayed side by side.
2. **Given** the same page on a narrow (mobile) screen, **When** the page loads, **Then** image and text stack vertically without overlap.

---

### User Story 4 – Content editor adds or updates /new pages (Priority: P2)

A content editor adds or modifies pages whose `navTitle` starts with `/new` in `pages.json`. Those pages automatically appear in the `/new` site navigation and use the housecat-style template. No code changes are needed to add new sub-pages.

**Why this priority**: Matches the established content-driven pattern of the existing templates.

**Independent Test**: Add a new entry `{ "navTitle": "/new/workshops", "navText": "Workshops", ... }` to `pages.json`. Reload the site and confirm the page appears in the `/new` navigation and is rendered with the housecat template.

**Acceptance Scenarios**:

1. **Given** a new page entry with `navTitle` starting with `/new` is added to `pages.json`, **When** the site reloads, **Then** the page appears in the `/new` navigation and renders with the housecat-style template.
2. **Given** an existing `/new/*` page entry is removed from `pages.json`, **When** the site reloads, **Then** the corresponding route and nav link no longer exist.

---

### Edge Cases

- What happens when a visitor navigates directly to a `/new/*` URL that has no matching entry in `pages.json`? A 404 or redirect to `/new` should be shown rather than a blank/broken page.
- What happens when a `/new` page has no `leadImage` defined? The hero area should degrade gracefully (e.g., a colour background instead of a broken image slot).
- What happens if `navText` is missing for a `/new/*` page? It should be excluded from the navigation, consistent with existing template behaviour.
- What happens when there are no gallery items on a gallery page? An empty state message prevents a visually broken layout.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST render pages whose `navTitle` starts with `/new` using the new housecat-style template, independently of the existing yoga and form templates.
- **FR-002**: The system MUST render existing `/yoga/*` and form (`/`, `/portfolio`, `/om`, etc.) pages using their original templates, completely unaffected by this feature.
- **FR-003**: The new template MUST display a full-width hero image at the top of the page, sourced from the page's `leadImage` field in `pages.json`.
- **FR-004**: The new template MUST display a headline text sourced from the `headline` field in `pages.json`, positioned prominently over or adjacent to the hero image.
- **FR-005**: The new template MUST include a horizontal navigation bar that shows only links to `/new/*` sub-pages that have a `navText` value.
- **FR-006**: The new template MUST render `galleryItems` (when present) in a multi-column masonry or grid layout.
- **FR-007**: Clicking a gallery image MUST open a larger or full-size view of that image.
- **FR-008**: The new template MUST display `text` content (when present) as a readable body text block.
- **FR-009**: The new template MUST be responsive: side-by-side layouts on desktop, stacked layouts on mobile (≥ 320px viewport width).
- **FR-010**: The new template MUST display a footer with at minimum a contact/email link, configurable through `pages.json`.
- **FR-011**: All content for the `/new` site MUST be definable entirely through `pages.json` without any code changes.

### Visual Design Requirements

- **VD-001**: The colour palette MUST be light and airy — white or off-white backgrounds with restrained use of dark colours.
- **VD-002**: Typography MUST use a clean, elegant typeface suited to an illustration portfolio (thin serif or modern sans-serif).
- **VD-003**: Navigation MUST be minimal and horizontal — no sidebars or heavy chrome.
- **VD-004**: The overall aesthetic MUST closely resemble [housecatillustration.com](https://www.housecatillustration.com/): spacious, image-forward, and light in tone.

### Key Entities

- **Page** (reused from existing model): A content entry in `pages.json`. Relevant fields for the `/new` template: `navTitle`, `navText`, `headline`, `text`, `leadImage`, `logoImage`, `galleryItems`.
- **Template** (conceptual): The visual layout applied to a group of pages based on `navTitle` prefix. Three templates will coexist after this feature: `yoga` (`/yoga/*`), `form` (default), and `housecat` (`/new/*`).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All pages with `navTitle` starting with `/new` render with the housecat-style layout — verifiable by visual comparison against the housecatillustration.com reference site.
- **SC-002**: All existing `/yoga/*` and form pages render identically to their pre-feature state — verifiable by side-by-side comparison before and after the change.
- **SC-003**: A content editor can add a new `/new/*` page in `pages.json` and see it appear in navigation and render correctly without modifying any code.
- **SC-004**: The new template is fully usable at viewport widths from 320 px to 1920 px — no broken layouts, overlapping text, or horizontal scroll at common device sizes.
- **SC-005**: The hero image, navigation, and primary content sections are all visible on first load without requiring any user interaction to reveal them.

## Assumptions

- The existing `pages.json` data model fields (`navTitle`, `navText`, `headline`, `text`, `leadImage`, `logoImage`, `galleryItems`) are sufficient for all `/new` content without schema changes.
- The `/new` route prefix is not currently used by any existing page entries; it is available exclusively for this new template.
- Social/contact links for the footer can be stored on the root `/new` page entry, consistent with how the `/yoga` root page holds its logo image.
- A logo image for the `/new` header will be provided via the `logoImage` field on the root `/new` page entry, following the existing `/yoga` pattern.
