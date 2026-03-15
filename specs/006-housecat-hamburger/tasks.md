# Tasks: HousecatPage Hamburger Menu on Small Screens

**Input**: Design documents from `/specs/006-housecat-hamburger/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Not requested — verification tasks included in final phase.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different concerns, no dependency on incomplete tasks)
- **[Story]**: Which user story — US1 (hamburger toggle), US2 (active state in panel)
- Exact file paths included in every task

---

## Phase 1: Setup

**Purpose**: Add the icon imports and new state variables that all later tasks depend on.

- [x] T001 Add `Navigation24Regular` and `Dismiss24Regular` imports from `"@fluentui/react-icons"` at the top of `src/components/HousecatPage.tsx`
- [x] T002 Add `const [menuOpen, setMenuOpen] = useState<boolean>(false)` and `const menuRef = useRef<HTMLDivElement | null>(null)` inside the `HousecatPage` component function in `src/components/HousecatPage.tsx`

---

## Phase 2: Foundational — Outside-click & Escape Dismissal

**Purpose**: Wire up the document-level event listeners that close the menu. Must be in place before the panel JSX is added so the cleanup contract is testable.

**⚠️ CRITICAL**: T004 (panel JSX) depends on `menuRef` and `setMenuOpen` from Phase 1 being in place.

- [x] T003 [US1] Add a `useEffect` in `src/components/HousecatPage.tsx` that, when `menuOpen` is `true`, attaches `mousedown` and `touchstart` listeners on `document` that call `setMenuOpen(false)` when the event target is outside `menuRef.current`, and a `keydown` listener that calls `setMenuOpen(false)` when `e.key === "Escape"`. Return a cleanup function that removes all three listeners. Dependency array: `[menuOpen]`.

---

## Phase 3: User Story 1 — Hamburger Toggle & Mobile Panel (Priority: P1) 🎯 MVP

**Goal**: At ≤768 px the horizontal nav is hidden and a hamburger icon appears. Tapping opens a full-width panel of nav links; tapping a link navigates and closes the panel.

**Independent Test**: Open any `/new/*` page with DevTools viewport set to 375 px. Confirm the `<ul>` nav is not visible and the hamburger button is. Tap to open — all nav links appear. Tap a link — navigation occurs and the panel closes. Confirm no horizontal scrollbar. Widen viewport to 1024 px — confirm hamburger is gone and `<ul>` nav is visible.

### Styles

- [x] T004 [P] [US1] In `src/components/HousecatPage.tsx`, add `position: "relative"` to the existing `header` makeStyles entry so the absolute-positioned panel anchors correctly
- [x] T005 [P] [US1] In `src/components/HousecatPage.tsx`, add `@media (max-width: 768px): { display: "none" }` to the existing `nav` makeStyles entry (the `<ul>`) so the desktop nav hides on mobile
- [x] T006 [P] [US1] In `src/components/HousecatPage.tsx`, add a new `hamburgerBtn` makeStyles entry: `display: "none"`, `background: "none"`, `border: "none"`, `cursor: "pointer"`, `padding: "4px"`, `color: "#555"`, `alignItems: "center"`, `justifyContent: "center"`, with `@media (max-width: 768px): { display: "flex" }`
- [x] T007 [P] [US1] In `src/components/HousecatPage.tsx`, add a new `mobileMenuPanel` makeStyles entry: `position: "absolute"`, `top: "100%"`, `left: "0"`, `right: "0"`, `backgroundColor: "#fff"`, `boxShadow: "0 4px 16px rgba(0,0,0,0.08)"`, `zIndex: "200"`, `display: "flex"`, `flexDirection: "column"`, `paddingBlock: "16px"`, `borderTop: "1px solid #e6e6e2"`
- [x] T008 [P] [US1] In `src/components/HousecatPage.tsx`, add a new `mobileMenuItem` makeStyles entry with `Source Sans Pro` typography, `fontSize: "0.85rem"`, `letterSpacing: "3px"`, `textTransform: "uppercase"`, `color: "#999"`, `paddingBlock: "14px"`, `paddingInline: "24px"`, `:hover: { color: "#333" }`

### JSX

- [x] T009 [US1] In `src/components/HousecatPage.tsx`, add the hamburger `<button>` element inside `<header>`, after the `<ul>` nav and before `<hr>`, with `className={styles.hamburgerBtn}`, `onClick={() => setMenuOpen((o) => !o)}`, `aria-label={menuOpen ? "Close menu" : "Open menu"}`, `aria-expanded={menuOpen}`, rendering `<Dismiss24Regular />` when `menuOpen` is true and `<Navigation24Regular />` when false
- [x] T010 [US1] In `src/components/HousecatPage.tsx`, add the mobile menu panel: `{menuOpen && (<div ref={menuRef} className={styles.mobileMenuPanel}>...</div>)}` inside `<header>`, after the hamburger button and before `<hr>`, rendering one `<div>` per menu item with `className={styles.mobileMenuItem}` and `onClick` that calls `navigate(item.navTitle)` then `setMenuOpen(false)`

**Checkpoint**: US1 complete — hamburger appears on mobile, panel opens/closes, outside-click and Escape dismiss it, link tap navigates and closes.

---

## Phase 4: User Story 2 — Active State in Mobile Panel (Priority: P2)

**Goal**: The current page's link is visually distinguished inside the open mobile menu panel.

**Independent Test**: Navigate to `/new/about`, shrink to 375 px, open the hamburger menu. Confirm the "About" entry has a visually different style compared to other links (darker colour or left accent border).

- [x] T011 [US2] In `src/components/HousecatPage.tsx`, add a new `mobileMenuItemActive` makeStyles entry with the same base typography as `mobileMenuItem` but `color: "#333"` and `borderLeft: "2px solid #333"` to mirror the desktop active state
- [x] T012 [US2] In `src/components/HousecatPage.tsx`, update the mobile panel JSX added in T010 to apply `styles.mobileMenuItemActive` when `props.navTitle === item.navTitle`, and `styles.mobileMenuItem` otherwise

**Checkpoint**: US2 complete — active page link is visually distinguished in the open mobile panel.

---

## Phase 5: Verification

**Purpose**: Confirm all five success criteria and zero regressions.

- [x] T013 [P] [US1] Verify at 375 px viewport: hamburger button is visible, `<ul>` nav is not visible (SC-001)
- [x] T014 [P] [US1] Verify at 1024 px viewport: hamburger button is not visible, all nav links with `navText` are visible in the header row (SC-002)
- [x] T015 [P] [US1] Verify tap flow: open menu → tap a link → correct navigation occurs → panel closes (SC-003, FR-005)
- [x] T016 [P] [US1] Verify outside-click and Escape key both close the panel without navigating (FR-006)
- [x] T017 [P] [US1] Verify no horizontal scrollbar appears from 320 px to 1920 px (SC-004, FR-008)
- [x] T018 [P] [US2] Verify active-link styling is visible inside the open panel on at least two different `/new/*` pages (FR-007)
- [x] T019 [P] Regression check: navigate to `/new`, `/new/home`, `/new/portfolio`, `/new/about`, `/new/contact` at desktop width — all load, all nav links work, logo navigates to `/new` (SC-005)

---

## Dependencies & Execution Order

```
T001 → T002 → T003
                 ↓
T004 (P) ─┐
T005 (P) ─┤
T006 (P) ─┤→ T009 → T010 → T011 → T012 → T013–T019 (all parallel)
T007 (P) ─┤
T008 (P) ─┘
```

- T001–T003: Sequential setup (imports → state → effect)
- T004–T008: Parallel style additions (all different makeStyles keys)
- T009–T010: Sequential JSX (T010 extends T009's button)
- T011–T012: Sequential active state (T012 updates T010's JSX)
- T013–T019: All parallel (read-only verification, no edits)

---

## Parallel Execution Examples

**Phase 3 styles (T004–T008) — all parallel:**

```
T004 (header position) | T005 (nav hide) | T006 (hamburgerBtn) | T007 (mobileMenuPanel) | T008 (mobileMenuItem)
```

**Phase 5 verification (T013–T019) — all parallel:**

```
T013 (375px check) | T014 (1024px check) | T015 (tap flow) | T016 (dismiss) | T017 (no scroll) | T018 (active state) | T019 (regression)
```

---

## Implementation Strategy

### MVP (US1 only — T001–T010 + T013–T017, T019)

1. Phase 1: Imports + state (T001–T002)
2. Phase 2: Dismiss effect (T003)
3. Phase 3 styles in parallel: T004–T008
4. Phase 3 JSX: T009 → T010
5. **STOP AND VALIDATE**: Open browser at 375 px, confirm hamburger works end-to-end

### Full Delivery (add US2)

6. Phase 4: T011 → T012
7. Phase 5: T013–T019 all in parallel

---

## Task Summary

| Phase        | Tasks  | Parallel Tasks | User Story |
| ------------ | ------ | -------------- | ---------- |
| Setup        | 2      | 0              | —          |
| Foundational | 1      | 0              | US1        |
| US1 (styles) | 5      | 5              | US1        |
| US1 (JSX)    | 2      | 0              | US1        |
| US2          | 2      | 0              | US2        |
| Verification | 7      | 7              | US1 + US2  |
| **Total**    | **19** | **12**         |            |
