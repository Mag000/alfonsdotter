# Implementation Plan: HousecatPage Hamburger Menu on Small Screens

**Branch**: `006-housecat-hamburger` | **Date**: 2026-02-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-housecat-hamburger/spec.md`

## Summary

Replace the horizontal navigation links in `HousecatPage.tsx` with a hamburger toggle at viewports ≤768 px. Tapping opens a full-width slide-down panel listing all `/new/*` nav links; tapping a link navigates and closes the panel; tapping outside or pressing Escape also closes it. At viewports >768 px the existing desktop nav remains unchanged. Implemented using `useState`, `useRef`, and `useEffect` in the existing functional component. Icons from the already-installed `@fluentui/react-icons` package (`Navigation24Regular` / `Dismiss24Regular`). Zero new dependencies.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode)
**Primary Dependencies**: `@fluentui/react-components` (makeStyles/Griffel), `@fluentui/react-icons` (already installed), React Router v6 (`useNavigate`)
**Storage**: N/A
**Testing**: Not requested for this feature
**Target Platform**: Web browser — mobile (≥320 px) through desktop (≤1920 px)
**Project Type**: Web frontend, single project (`src/`)
**Performance Goals**: Menu open/close must feel instant (<16 ms — one frame)
**Constraints**: No new npm dependencies; change scoped to `HousecatPage.tsx` only
**Scale/Scope**: Single component file, ~40 lines added

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                                 | Status  | Notes                                                                       |
| ------------------------------------ | ------- | --------------------------------------------------------------------------- |
| TypeScript strict, no `any`          | ✅ PASS | All new code typed: `useState<boolean>`, `useRef<HTMLDivElement>`           |
| FluentUI9 `makeStyles` only          | ✅ PASS | All new styles via Griffel `makeStyles`; icons from `@fluentui/react-icons` |
| Functional component, hooks only     | ✅ PASS | `useState`, `useEffect`, `useRef` — no class component                      |
| `useEffect` cleanup                  | ✅ PASS | `document.removeEventListener` in cleanup return                            |
| `I`-prefixed interfaces for new data | ✅ N/A  | No new data model — reuses existing `IPage[]`                               |
| One component per file, PascalCase   | ✅ PASS | Change stays inside `HousecatPage.tsx`                                      |

**Post-design re-check**: All gates still pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/006-housecat-hamburger/
├── plan.md          ✅ this file
├── research.md      ✅ Phase 0 output
├── quickstart.md    ✅ Phase 1 output
└── tasks.md         (Phase 2 — /speckit.tasks)
```

### Source Code (only file affected)

```text
src/
└── components/
    └── HousecatPage.tsx    ← sole change
```

**Structure Decision**: Single-project web frontend. Only `HousecatPage.tsx` changes — no new files, no new routes, no service layer changes.

## Design

### State

```
menuOpen: boolean   (useState<boolean>(false))
menuRef: RefObject<HTMLDivElement>   (useRef — panel ref for outside-click)
```

### New makeStyles entries

| Key                    | Purpose                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `hamburgerBtn`         | Visible only at ≤768 px; icon button, no border/background                                 |
| `mobileMenuPanel`      | Absolutely-positioned full-width panel, `top: "100%"`, `zIndex: 200`, white bg, box-shadow |
| `mobileMenuItem`       | Full-width tap target, same typography as `navItem`                                        |
| `mobileMenuItemActive` | Darker colour + bottom border, mirrors `navItemActive`                                     |

Existing `nav` (the `<ul>`) gets `display: "none"` at `@media (max-width: 768px)`.
`hamburgerBtn` gets `display: "none"` at `@media (min-width: 769px)`.
Header gets `position: "relative"` added (anchor for panel `position: "absolute"`).

### Behaviour

```
useEffect (menuOpen, menuRef):
  if menuOpen:
    add document listener 'mousedown'/'touchstart' → close if outside menuRef
    add document listener 'keydown' → close if key === 'Escape'
  cleanup: remove both listeners
```

### JSX structure (header only — rest of component unchanged)

```tsx
<header>
  <img logo />

  {/* desktop nav — hidden at ≤768px via CSS */}
  <ul className={styles.nav}>...</ul>

  {/* hamburger button — hidden at ≥769px via CSS */}
  <button
    className={styles.hamburgerBtn}
    onClick={() => setMenuOpen((o) => !o)}
  >
    {menuOpen ? <Dismiss24Regular /> : <Navigation24Regular />}
  </button>

  {/* mobile panel — rendered only when open */}
  {menuOpen && (
    <div ref={menuRef} className={styles.mobileMenuPanel}>
      {menuItems.map((item) => (
        <div
          className={
            active ? styles.mobileMenuItemActive : styles.mobileMenuItem
          }
          onClick={() => {
            navigate(item.navTitle);
            setMenuOpen(false);
          }}
        >
          {item.navText}
        </div>
      ))}
    </div>
  )}

  <hr />
</header>
```
