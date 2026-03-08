# Tasks: Housecat Header — Logo Left, Nav Right

**Input**: Design documents from `/specs/005-housecat-header/`
**Prerequisites**: plan.md ✅, spec.md ✅

**Tests**: Not requested — verification tasks included in polish phase.

**Organization**: Single user story, single file. Tasks ordered by dependency within that file.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to — US1
- Exact file paths included in every task

---

## Phase 1: Foundational — Header Row Layout

**Purpose**: Replace the current column-stacked header with a horizontal row that places the logo on the left and navigation on the right. All three tasks edit the same file and must be applied together.

**⚠️ CRITICAL**: T002 and T003 depend on T001 being correct first.

- [x] T001 [US1] In `src/components/HousecatPage.tsx`, change the `header` makeStyles entry from `flexDirection: "column"` / `alignItems: "center"` to `flexDirection: "row"`, `justifyContent: "space-between"`, `alignItems: "center"`, `paddingInline: "24px"`, `paddingBlock: "24px"`, `width: "100%"`, `boxSizing: "border-box"`
- [x] T002 [US1] In `src/components/HousecatPage.tsx`, update the `nav` wrapper makeStyles entry so it no longer forces its own centering — set `display: "flex"`, `alignItems: "center"` (the `<ul>` inside already handles gap and wrap)
- [x] T003 [US1] In `src/components/HousecatPage.tsx`, add a `@media (max-width: 480px)` responsive override to the `header` makeStyles entry: `flexDirection: "column"`, `alignItems: "center"`, `gap: "16px"` — so logo stacks above nav on narrow screens

---

## Phase 2: Verification

**Purpose**: Confirm all four success criteria and no regressions.

- [ ] T004 [P] [US1] Visually verify at 1280 px viewport: logo left edge is within 24 px of the page left boundary and the rightmost nav link is within 24 px of the page right boundary (SC-001)
- [ ] T005 [P] [US1] Visually verify vertical centring: logo midpoint and nav midpoint are within ~4 px of each other at viewports wider than 480 px (SC-002)
- [ ] T006 [P] [US1] Visually verify responsive behaviour: no horizontal scrollbar appears from 320 px to 1920 px; at ≤ 480 px logo and nav stack vertically without overflow (SC-003, FR-003)
- [ ] T007 [P] [US1] Regression check: navigate to `/new`, `/new/home`, `/new/portfolio`, `/new/about`, `/new/contact` — all load correctly, nav links navigate correctly, active-link style still highlights the current page (SC-004)

---

## Dependencies & Execution Order

```
T001 → T002 → T003 → T004 (parallel)
                    → T005 (parallel)
                    → T006 (parallel)
                    → T007 (parallel)
```

T001–T003 are sequential (same file, same header block).  
T004–T007 are all parallel (read-only visual checks, no file edits).

---

## Implementation Strategy

All three implementation tasks (T001–T003) touch the same `header` and `nav` style entries in `HousecatPage.tsx`. Apply them in one editing session for a clean diff. Then verify with T004–T007 in the browser.

**MVP**: T001 alone produces the visible result. T002 and T003 refine alignment and responsiveness.

---

## Task Summary

| Phase        | Tasks | Parallel Tasks | User Story |
| ------------ | ----- | -------------- | ---------- |
| Foundational | 3     | 0              | US1        |
| Verification | 4     | 4              | US1        |
| **Total**    | **7** | **4**          |            |

