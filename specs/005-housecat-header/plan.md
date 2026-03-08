# Implementation Plan: Housecat Header — Logo Left, Nav Right

**Feature Branch**: `005-housecat-header`
**Spec**: [spec.md](./spec.md)

## Tech Stack

- **Language**: TypeScript (strict)
- **Framework**: React 18 functional component
- **Styling**: FluentUI9 `makeStyles` (Griffel CSS-in-JS)
- **Component**: `src/components/HousecatPage.tsx` — the only file touched

## What Needs to Change

The current `header` style in `HousecatPage.tsx` uses `flexDirection: "column"` with `alignItems: "center"`, which stacks the logo above the nav. It needs to become a `flexDirection: "row"` container with `justifyContent: "space-between"` and `alignItems: "center"` so the logo sits on the left and the nav sits on the right.

The `nav` element inside no longer needs its own centering — it just needs `display: "flex"` and `alignItems: "center"` so the `<ul>` fills the right side naturally.

At ≤ 480 px the header should stack: logo on top, nav below, both centred on narrow screens.

## Affected Files

| File                              | Change                                                                |
| --------------------------------- | --------------------------------------------------------------------- |
| `src/components/HousecatPage.tsx` | Restyle `header` (row, space-between) + `nav` + responsive breakpoint |

## No Changes Needed

- `App.tsx` — routing unchanged
- `pages.json` / `images.json` — data unchanged
- All other components — unaffected
