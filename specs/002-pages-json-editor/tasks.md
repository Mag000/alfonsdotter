# Tasks: Pages.json Content Editor

**Input**: Design documents from `/specs/002-pages-json-editor/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not explicitly requested in specification - test tasks omitted.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Includes exact file paths

---

## Phase 1: Setup (Project Structure)

**Purpose**: Create folder structure and new files scaffold

- [x] T001 Create admin components directory at src/components/admin/
- [x] T002 [P] Create IEditorState.ts interfaces file at src/model/IEditorState.ts
- [x] T003 [P] Update IShopItem.ts to add path (required) and price fields at src/model/IShopItem.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create editorService.ts with JSON load/save/validation functions at src/services/editorService.ts
- [x] T005 [P] Create AdminLogin.tsx password authentication component at src/components/admin/AdminLogin.tsx
- [x] T006 [P] Create PagesEditor.tsx main container with state management at src/components/admin/PagesEditor.tsx
- [x] T007 Add /admin route to App.tsx routing configuration at src/App.tsx
- [x] T008 Create PageList.tsx left panel navigation component at src/components/admin/PageList.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Edit Page Content (Priority: P1) 🎯 MVP

**Goal**: Enable editing basic page content (navTitle, navText, headline, text) through visual interface

**Independent Test**: Load pages.json, edit a page headline, download updated JSON - verify change preserved

### Implementation for User Story 1

- [x] T009 [US1] Create PageForm.tsx with fields for navTitle, navText, headline at src/components/admin/PageForm.tsx
- [x] T010 [US1] Add multi-line Textarea for text field with line break rendering at src/components/admin/PageForm.tsx
- [x] T011 [US1] Implement page selection handler connecting PageList to PageForm at src/components/admin/PagesEditor.tsx
- [x] T012 [US1] Add "Download JSON" button with Blob creation and download at src/components/admin/PagesEditor.tsx
- [x] T013 [US1] Implement unsaved changes detection and beforeunload warning at src/components/admin/PagesEditor.tsx
- [x] T014 [US1] Add undo/redo functionality using history state management at src/components/admin/PagesEditor.tsx

**Checkpoint**: User Story 1 complete - artist can load, edit page content, and download JSON

---

## Phase 4: User Story 2 - Manage Gallery Items (Priority: P2)

**Goal**: Add, edit, and remove gallery items on pages with galleryItems array

**Independent Test**: Add new gallery item to /portfolio page, download JSON, verify item present

### Implementation for User Story 2

- [x] T015 [US2] Create GalleryEditor.tsx component showing gallery items as editable cards at src/components/admin/GalleryEditor.tsx
- [x] T016 [US2] Add "Add Gallery Item" button and form for path, title, description, tagLine at src/components/admin/GalleryEditor.tsx
- [x] T017 [US2] Implement gallery item edit functionality with inline field editing at src/components/admin/GalleryEditor.tsx
- [x] T018 [US2] Add "Remove" button with FluentUI9 Dialog confirmation at src/components/admin/GalleryEditor.tsx
- [x] T019 [US2] Implement variants sub-editor for gallery item variants array at src/components/admin/GalleryEditor.tsx
- [x] T020 [US2] Integrate GalleryEditor into PageForm for pages with galleryItems at src/components/admin/PageForm.tsx

**Checkpoint**: User Story 2 complete - artist can manage gallery items independently

---

## Phase 5: User Story 3 - Manage Shop Items (Priority: P3)

**Goal**: Add, edit, and remove shop items with price field support (SEK or null)

**Independent Test**: Add shop item with price to /shop page, download JSON, verify item with price present

### Implementation for User Story 3

- [x] T021 [US3] Create ShopEditor.tsx component showing shop items as editable cards at src/components/admin/ShopEditor.tsx
- [x] T022 [US3] Add "Add Shop Item" button and form for path, title, description, price at src/components/admin/ShopEditor.tsx
- [x] T023 [US3] Implement price field with SpinButton for SEK value or checkbox for "contact for pricing" at src/components/admin/ShopEditor.tsx
- [x] T024 [US3] Add edit and remove functionality with confirmation dialog at src/components/admin/ShopEditor.tsx
- [x] T025 [US3] Integrate ShopEditor into PageForm for pages with shopItems at src/components/admin/PageForm.tsx

**Checkpoint**: User Story 3 complete - artist can manage shop items independently

---

## Phase 6: User Story 4 - Manage Page Images (Priority: P4)

**Goal**: Configure logo and lead images for pages with preview

**Independent Test**: Change leadImage path on a page, download JSON, verify new path in file

### Implementation for User Story 4

- [x] T026 [P] [US4] Create ImageField.tsx reusable component with path input and preview at src/components/admin/ImageField.tsx
- [x] T027 [US4] Add image error handler showing broken image placeholder with warning at src/components/admin/ImageField.tsx
- [x] T028 [US4] Add altText input field to ImageField component at src/components/admin/ImageField.tsx
- [x] T029 [US4] Integrate ImageField for logoImage and leadImage in PageForm at src/components/admin/PageForm.tsx

**Checkpoint**: User Story 4 complete - artist can configure page images with preview

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, error handling, and UX improvements across all stories

- [x] T030 [P] Add JSON validation with error messages showing line/position on load at src/services/editorService.ts
- [x] T031 [P] Add field validation warnings (empty required fields, invalid paths) at src/services/editorService.ts
- [x] T032 Implement navigation blocking with React Router useBlocker for unsaved changes at src/components/admin/PagesEditor.tsx
- [x] T033 [P] Add FluentUI9 theming and responsive layout for 1024px+ desktop at src/components/admin/PagesEditor.tsx
- [x] T034 Run quickstart.md validation checklist and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - Can proceed in parallel (if staffed) after Phase 2
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

| Story    | Depends On                      | Can Start After  |
| -------- | ------------------------------- | ---------------- |
| US1 (P1) | Foundational                    | Phase 2 complete |
| US2 (P2) | Foundational, PageForm from US1 | T010 complete    |
| US3 (P3) | Foundational, PageForm from US1 | T010 complete    |
| US4 (P4) | Foundational                    | Phase 2 complete |

### Parallel Opportunities per Phase

**Phase 1**:

```
T002 (IEditorState.ts) | T003 (IShopItem.ts)
```

**Phase 2**:

```
T005 (AdminLogin) | T006 (PagesEditor) | T008 (PageList)
```

**Phase 4-6** (after Phase 3):

```
US2 (Gallery) | US3 (Shop) | US4 (Images) - can run in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T008)
3. Complete Phase 3: User Story 1 (T009-T014)
4. **STOP and VALIDATE**: Load JSON, edit headline, download - verify it works
5. Deploy if ready - artist can start editing content immediately

### Incremental Delivery

1. **MVP**: Setup + Foundational + US1 → Artist can edit page text
2. **+Gallery**: Add US2 → Artist can manage portfolio
3. **+Shop**: Add US3 → Artist can manage shop items
4. **+Images**: Add US4 → Artist can change images with preview
5. Each increment adds value without breaking previous functionality

---

## Task Summary

| Phase        | Tasks  | Parallel Tasks |
| ------------ | ------ | -------------- |
| Setup        | 3      | 2              |
| Foundational | 5      | 3              |
| US1 (P1)     | 6      | 0              |
| US2 (P2)     | 6      | 0              |
| US3 (P3)     | 5      | 0              |
| US4 (P4)     | 4      | 1              |
| Polish       | 5      | 3              |
| **Total**    | **34** | **9**          |

---

## Notes

- No test tasks included (not requested in spec)
- All FluentUI9 components: Input, Textarea, Button, Dialog, Card, SpinButton, Tree
- Line breaks preserved natively by Textarea + JSON.stringify/parse
- Session auth stored in localStorage with 1-hour expiration
- Commit after each task or logical group for safe rollback
