# Feature Specification: Sample Pages and Images for the /new Template

**Feature Branch**: `004-new-sample-content`
**Created**: 2026-02-23
**Status**: Draft
**Input**: User description: "Create sample images and pages for the new template"

## User Scenarios & Testing _(mandatory)_

### User Story 1 – Developer previews the /new template with real-looking content (Priority: P1)

A developer working on the housecat-style template (feature 003) can load the site and immediately see all five planned page types — the root landing page, home, portfolio, about, and contact — populated with placeholder content. Navigation links appear, images load, and gallery items are visible. No real production assets are required to verify the template layout.

**Why this priority**: Without sample content in `pages.json` and placeholder images on disk, the template cannot be developed or visually reviewed at all. This is the prerequisite for feature 003.

**Independent Test**: Start the app with the updated `pages.json`. Navigate to `/new`, `/new/home`, `/new/portfolio`, `/new/about`, and `/new/contact`. Each page must load without errors, show a lead image (or placeholder), display its headline and navigation links, and the portfolio page must show a gallery grid.

**Acceptance Scenarios**:

1. **Given** the updated `pages.json` is in place, **When** a developer navigates to `/new`, **Then** the landing page loads with a hero/lead image and a headline, and navigation links to the four sub-pages are present.
2. **Given** the developer navigates to `/new/portfolio`, **When** the page loads, **Then** at least 5 gallery items are visible, each with a thumbnail and a title.
3. **Given** the developer navigates to `/new/about`, **When** the page loads, **Then** a lead image and body text are both visible.
4. **Given** the developer navigates to `/new/contact`, **When** the page loads, **Then** a lead image and placeholder contact text are visible.
5. **Given** the developer navigates to `/yoga` or `/`, **When** the page loads, **Then** those pages are completely unaffected by the new `pages.json` entries.

---

### User Story 2 – Developer sees placeholder images without broken img tags (Priority: P1)

All image paths referenced in the new `/new/*` `pages.json` entries resolve to actual files. No broken image icons appear anywhere on the `/new` site.

**Why this priority**: Broken images during template development make it impossible to validate spacing, aspect ratios, and layout behaviour.

**Independent Test**: Open browser devtools Network panel. Navigate to each `/new/*` page. Confirm every image request returns HTTP 200. Confirm no `<img>` shows a broken-image icon.

**Acceptance Scenarios**:

1. **Given** the developer loads any `/new/*` page, **When** all images are requested, **Then** every image resolves to an existing file with no 404 errors.
2. **Given** placeholder images are sourced from an existing folder, **When** they are referenced in `pages.json`, **Then** they are already available without any additional file copy step by the developer.

---

### User Story 3 – Content is discoverable through the image picker (Priority: P2)

The placeholder images placed in `/img/new/` appear in the admin image picker alongside the existing `form` and `yoga` images. A content editor can see and select them when editing `/new/*` pages via the admin GUI.

**Why this priority**: Makes the sample content useful beyond just development — editors can reference and replace images using the existing admin workflow.

**Independent Test**: Open the admin GUI, edit any `/new/*` page, open the image picker, and filter by the `new` folder. Confirm the placeholder images appear.

**Acceptance Scenarios**:

1. **Given** placeholder images are placed in `/img/new/`, **When** `images.json` is updated to include them, **Then** they appear in the image picker under a `new` folder filter.

---

### Edge Cases

- What if a placeholder image path in `pages.json` is misspelled? The affected page shows a broken image — this is caught by the acceptance test in User Story 2.
- What if the `/new` root entry is missing from `pages.json`? Navigation and routing for the `/new` site break entirely — both the root entry and all sub-page entries must be present.
- What if gallery `variants` arrays are empty or absent? The gallery grid still renders with the primary `path`; no crash occurs.

## Requirements _(mandatory)_

### Functional Requirements

**pages.json entries (appended after existing content, existing entries untouched):**

- **FR-001**: A root entry with `navTitle: "/new"` MUST be added, containing a `logoImage` path and a `leadImage` path pointing to placeholder images in `/img/new/`.
- **FR-002**: A home/landing sub-page entry with `navTitle: "/new/home"`, `navText: "Home"`, `headline`, `text`, and `leadImage` MUST be added.
- **FR-003**: A portfolio entry with `navTitle: "/new/portfolio"`, `navText: "Portfolio"`, and `leadImage` MUST be added, containing at least **5 gallery items** each with a `path` and `title`. Gallery items MUST reuse existing images already present in `/img/gallery/` so no new files need to be added.
- **FR-004**: An about entry with `navTitle: "/new/about"`, `navText: "About"`, `headline`, `text` (a multi-line placeholder bio), and `leadImage` MUST be added.
- **FR-005**: A contact entry with `navTitle: "/new/contact"`, `navText: "Contact"`, `headline`, `text` (placeholder contact information), and `leadImage` MUST be added.
- **FR-006**: The `text` fields MUST use realistic placeholder content in English (not Lorem Ipsum), relevant to a freelance illustrator persona, so the layout looks credible during review.

**Placeholder images in `/img/new/`:**

- **FR-007**: A `hero.jpg` placeholder image MUST be placed in `/img/new/` for use as the home page lead image. It MUST be a copy or symlink of an existing image already in the repository so no external download is needed.
- **FR-008**: A `logo.jpg` placeholder image MUST be placed in `/img/new/` for use as the site logo.
- **FR-009**: A `about.jpg` placeholder image MUST be placed in `/img/new/` for use as the about page portrait.
- **FR-010**: A `contact.jpg` placeholder image MUST be placed in `/img/new/` for use as the contact page lead image.
- **FR-011**: A `portfolio.jpg` placeholder image MUST be placed in `/img/new/` for use as the portfolio page lead image.

**images.json manifest:**

- **FR-012**: `images.json` MUST be updated to include all five new `/img/new/*.jpg` paths so they appear in the image picker.

### Key Entities

- **Page entry**: A JSON object in `pages.json` describing one navigable page. Fields used by this feature: `navTitle`, `navText`, `headline`, `text`, `leadImage` (`path`), `logoImage` (`path`), `galleryItems` (array of `{ path, title, description }`).
- **Placeholder image**: A JPEG image file placed in `/img/new/` that is copied from an existing file already in the repository. It represents the correct aspect ratio and position for that slot without requiring production artwork.
- **images.json**: A flat JSON array of image path strings used by the admin image picker to enumerate available assets.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 5 routes (`/new`, `/new/home`, `/new/portfolio`, `/new/about`, `/new/contact`) load without JavaScript errors and without any broken images — verifiable in under 2 minutes by opening each URL in a browser.
- **SC-002**: The portfolio page shows exactly **5 or more** gallery items with visible thumbnails and titles.
- **SC-003**: All existing pages (`/yoga`, `/yoga/yoga`, `/`, `/portfolio`, `/om`, `/shop`, `/kontakt`) continue to load and display correctly — no regressions from the `pages.json` additions.
- **SC-004**: All new image paths appear in the admin image picker under the `new` folder filter — verifiable by opening the admin GUI and checking the folder list.
- **SC-005**: No new image files need to be downloaded or created from scratch by the developer — all placeholder images are sourced from files already committed to the repository.

## Assumptions

- Placeholder images for `/img/new/` will be copied from existing files already in the repository (`/img/gallery/` or `/img/form/` images). The specific source files are selected to represent the correct image slot (landscape hero, portrait, square gallery etc.) as best as the existing assets allow.
- The gallery items on the `/new/portfolio` page will reuse paths from `/img/gallery/` — these files already exist and are already listed in `images.json`.
- `pages.json` entries are appended after the existing entries; the file structure and ordering of existing entries is not changed.
- The placeholder bio and contact texts are written in English to match the housecatillustration.com reference persona.
