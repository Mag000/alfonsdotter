# Tasks: Sample Pages and Images for the /new Template

**Input**: Design documents from `/specs/004-new-sample-content/`  
**Prerequisites**: plan.md ✗ (not needed — pure content feature), spec.md ✅

**Tests**: Not requested in specification — test tasks omitted.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to — US1, US2, US3
- Exact file paths included in every task

---

## Phase 1: Setup

**Purpose**: Create the `/img/new/` folder so image copy tasks have a target.

- [x] T001 Create directory `public/img/new/`

---

## Phase 2: Foundational — Placeholder Images

**Purpose**: Copy five existing images into `/img/new/` so all image paths in `pages.json` resolve immediately. Blocks both US1 and US2.

**⚠️ CRITICAL**: Phase 3 (pages.json) cannot be verified without these files in place.

- [x] T002 [P] Copy `public/img/form/AF_Citat.jpg` → `public/img/new/hero.jpg` (home page hero)
- [x] T003 [P] Copy `public/img/form/Logo_Form.jpg` → `public/img/new/logo.jpg` (site logo)
- [x] T004 [P] Copy `public/img/form/AF_Om.jpg` → `public/img/new/about.jpg` (about page portrait)
- [x] T005 [P] Copy `public/img/form/AF_Kontakt.jpg` → `public/img/new/contact.jpg` (contact page lead)
- [x] T006 [P] Copy `public/img/form/AF_Portfolio.jpg` → `public/img/new/portfolio.jpg` (portfolio page lead)

**Checkpoint**: All five `/img/new/*.jpg` files exist on disk — US2 (no broken images) is satisfied.

---

## Phase 3: User Story 1 + 2 — pages.json Entries (Priority: P1) 🎯 MVP

**Goal**: Add all `/new/*` page entries to `pages.json` so the developer can navigate to `/new`, `/new/home`, `/new/portfolio`, `/new/about`, and `/new/contact` and see real-looking content.

**Independent Test**: Start the dev server. Navigate to each of the five routes. Each must load without JavaScript errors, show a lead image, display a headline, and show navigation links to the four sub-pages. No broken image icons anywhere.

### Implementation for User Story 1 + 2

- [x] T007 [US1] Add `/new` root entry to `public/pages.json` with `logoImage: { path: "/img/new/logo.jpg" }`, `leadImage: { path: "/img/new/hero.jpg" }`, and `headline: "Welcome"` — appended after existing entries, existing entries untouched. This ensures the root `/new` URL renders a visible headline instead of blank content if the housecat template displays the root page directly before `/new/home` is implemented.
- [x] T008 [US1] Add `/new/home` entry to `public/pages.json`:
  ```json
  {
    "navTitle": "/new/home",
    "navText": "Home",
    "headline": "Let's create magic together!",
    "text": "Hi, I'm a freelance illustrator and graphic designer with a knack for lightheartedness.\n\nI would love to work with you and create sweet, fun and playful illustrations that bring magic to your projects. I'm available for a wide range of illustration projects — from children's books and packaging design to editorial work.\n\nGet in touch and let's make something beautiful.",
    "leadImage": { "path": "/img/new/hero.jpg" }
  }
  ```
- [x] T009 [US1] Add `/new/portfolio` entry to `public/pages.json` with `navText: "Portfolio"`, `leadImage: { "path": "/img/new/portfolio.jpg" }`, and the following 5 gallery items reusing existing `/img/gallery/` files (no new files needed):
  ```json
  "galleryItems": [
    { "path": "/img/gallery/Arg_beskuren.jpg",                          "title": "Illustration I",   "description": "Personal work" },
    { "path": "/img/gallery/Dass_beskuren.jpg",                         "title": "Illustration II",  "description": "Editorial commission" },
    { "path": "/img/gallery/Dissociation_beskuren.jpg",                 "title": "Illustration III", "description": "Personal work" },
    { "path": "/img/gallery/Glimmingehus_beskuren.jpg",                 "title": "Illustration IV",  "description": "Book cover" },
    { "path": "/img/gallery/Nyfiken på hus_Östra torp dag_beskuren.jpg","title": "Illustration V",   "description": "Packaging design" }
  ]
  ```
- [x] T010 [US1] Add `/new/about` entry to `public/pages.json`:
  ```json
  {
    "navTitle": "/new/about",
    "navText": "About",
    "headline": "Hi, I'm a freelance illustrator",
    "text": "I create sweet, fun and playful illustrations for children's books, packaging, and editorial projects.\n\nWith a background in graphic design I bring both a creative eye and a structured approach to every project — whether it's a single illustration or a full visual identity.\n\nI'm based in Sweden and available for commissions worldwide.",
    "leadImage": { "path": "/img/new/about.jpg" }
  }
  ```
- [x] T011 [US1] Add `/new/contact` entry to `public/pages.json`:
  ```json
  {
    "navTitle": "/new/contact",
    "navText": "Contact",
    "headline": "Get in touch",
    "text": "I'd love to hear about your project!\n\nFeel free to reach out by email and I'll get back to you within a few days.\n\nEmail: hello@example.com\nInstagram: @example",
    "leadImage": { "path": "/img/new/contact.jpg" }
  }
  ```

**Checkpoint**: US1 + US2 complete — all five `/new/*` routes load with real-looking content and zero broken images.

---

## Phase 4: User Story 3 — Image Picker Discoverability (Priority: P2)

**Goal**: The five `/img/new/*.jpg` placeholder images appear in the admin image picker under a `new` folder filter.

**Independent Test**: Open the admin GUI → edit any `/new/*` page → open the image picker → select the `new` folder filter → confirm all five images appear.

### Implementation for User Story 3

- [x] T012 [US3] Add the five new image paths to `public/images.json` (append before the closing `]`):
  ```json
  "/img/new/hero.jpg",
  "/img/new/logo.jpg",
  "/img/new/about.jpg",
  "/img/new/contact.jpg",
  "/img/new/portfolio.jpg"
  ```

**Checkpoint**: US3 complete — all five images discoverable in the admin image picker.

---

## Phase 5: Polish & Regression Check

**Purpose**: Confirm no regressions on existing pages and all success criteria are met.

- [x] T013 Verify all five `/new/*` routes load without console errors and without broken images (SC-001, SC-002)
- [x] T013a [P] Verify all `text` fields on `/new/home`, `/new/about`, and `/new/contact` contain realistic illustrator-context prose — not Lorem Ipsum, not placeholder variables (FR-006)
- [x] T014 [P] Verify existing routes `/yoga`, `/yoga/yoga`, `/`, `/portfolio`, `/om`, `/shop`, `/kontakt` are unaffected — load each and confirm normal rendering (SC-003)
- [x] T015 [P] Verify the portfolio page shows exactly 5 gallery items with visible thumbnails and titles (SC-002)
- [x] T016 [P] Verify all five `/img/new/*.jpg` entries appear in `images.json` and in the admin image picker under `new` folder (SC-004)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Setup): No dependencies — start immediately
- **Phase 2** (Images): Depends on Phase 1 (directory must exist) — T002 first, T003–T006 in parallel
- **Phase 3** (pages.json): Depends on Phase 2 complete — T007→T008→T009→T010→T011 sequentially (same file)
- **Phase 4** (images.json): Depends on Phase 2 complete — can run in parallel with Phase 3
- **Phase 5** (Verification): Depends on Phases 3 and 4 complete

### Parallel Opportunities

**Phase 2** (after T002):

```
T003 (logo.jpg) | T004 (about.jpg) | T005 (contact.jpg) | T006 (portfolio.jpg)
```

**Phase 4 vs Phase 3** (both depend on Phase 2, not on each other):

```
Phase 3 (pages.json entries) | Phase 4 (images.json update)
```

**Phase 5** (after Phases 3 + 4):

```
T013 (route check) | T014 (regression check) | T015 (gallery count) | T016 (picker check)
```

---

## Implementation Strategy

### MVP First (US1 + US2 only — renders correctly)

1. Phase 1: Create directory (T001)
2. Phase 2: Copy all 5 images (T002–T006)
3. Phase 3: Add all pages.json entries (T007–T011)
4. **STOP and VALIDATE**: Start dev server, open all 5 routes — verify content loads without broken images
5. Feature 003 (housecat template) can now begin development using this content

### Full Delivery (add US3)

6. Phase 4: Update images.json (T012)
7. Phase 5: Full verification (T013–T016)

---

## Task Summary

| Phase        | Tasks  | Parallel Tasks | User Story |
| ------------ | ------ | -------------- | ---------- |
| Setup        | 1      | 0              | —          |
| Foundational | 5      | 4              | US2        |
| US1 + US2    | 5      | 0              | US1, US2   |
| US3          | 1      | 0              | US3        |
| Polish       | 4      | 3              | —          |
| **Total**    | **16** | **7**          |            |

