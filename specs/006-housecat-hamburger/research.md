# Research: HousecatPage Hamburger Menu

**Phase 0 output for `006-housecat-hamburger`**

## Decision Log

### D-001 — Hamburger icon source

**Decision**: Use `Navigation24Regular` (open) and `Dismiss24Regular` (close) from `@fluentui/react-icons`.

**Rationale**: `@fluentui/react-icons` is already in `package.json` — no new dependency. These icons are the standard Fluent UI affordance for hamburger / close and render consistently at all pixel densities. Using them aligns with Constitution principle II (FluentUI9).

**Alternatives considered**:

- Unicode `☰` / `✕` — dependency-free but render inconsistently across fonts and OS; not accessible without extra ARIA work.
- CSS-drawn bars — zero dependency but adds custom CSS for a solved problem when an icon library already exists.

---

### D-002 — Mobile breakpoint value

**Decision**: 768 px.

**Rationale**: Covers all portrait-orientation phones and most small tablets. The spec explicitly calls out 768 px. The existing component uses 480 px for header stacking (feature 005) — that breakpoint remains; at ≤768 px the hamburger replaces the `<ul>` nav, which means the 480 px column-stack rule never triggers for the nav section (the nav `<ul>` is hidden below 768 px anyway).

**Alternatives considered**: 600 px — narrower, would leave some tablets with no hamburger.

---

### D-003 — Menu panel positioning strategy

**Decision**: Absolutely-positioned `<div>` anchored `top: 100%` on the `<header>` element (which gets `position: "relative"`). Full-width panel, white background, subtle box-shadow.

**Rationale**: Pure CSS + React state (`useState<boolean>`) — no portal, no `<dialog>`, no extra library. The header is already the natural anchor point. Full-width panel (not right-aligned dropdown) fits the airy housecat aesthetic better than a small dropdown.

**Alternatives considered**:

- `<dialog>` element — built-in `::backdrop` but requires an imperative `.showModal()` call; harder to animate with Griffel.
- React portal to `document.body` — avoids stacking context issues but over-engineering for this scope.

---

### D-004 — Outside-click dismissal

**Decision**: `useRef` on the panel `<div>` + `useEffect` adding a `mousedown` / `touchstart` listener on `document`. If the event target is not contained within the panel ref, close the menu.

**Rationale**: Standard React pattern, no library needed, handles both mouse and touch. Clean up the listener in the `useEffect` return function (Constitution principle III — cleanup in useEffect).

**Alternatives considered**: Invisible backdrop `<div>` behind the panel — simpler but does not dismiss on keyboard Tab/Escape; the `useRef` approach is more accessible.

---

### D-005 — Escape key dismissal

**Decision**: Add an `Escape` keydown listener alongside the outside-click listener in the same `useEffect`, closing the menu on `key === 'Escape'`.

**Rationale**: FluentUI9 accessibility patterns (Constitution II) expect keyboard dismissal for overlay panels. Minimal extra code in the existing useEffect.

---

### D-006 — State management

**Decision**: Single `useState<boolean>` (`menuOpen`) inside `HousecatPage`. No context, no reducer.

**Rationale**: The state is purely local to one component instance. Constitution principle III says use hooks for state — this is the simplest correct hook. Menu state does not need to leave the component.

---

## No NEEDS CLARIFICATION Items Remaining

All unknowns resolved. Ready for Phase 1 design.
