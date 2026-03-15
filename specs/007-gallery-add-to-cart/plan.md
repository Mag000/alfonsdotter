# Implementation Plan: Gallery Add to Cart

**Feature Branch**: `007-gallery-add-to-cart`  
**Created**: 2026-03-15  
**Based on**: spec.md

---

## Tech Stack

| Layer             | Technology                                                   |
| ----------------- | ------------------------------------------------------------ |
| UI Framework      | React 18 + TypeScript                                        |
| Component library | Fluent UI React Components v9 (`@fluentui/react-components`) |
| Styling           | Fluent UI `makeStyles` (Griffel CSS-in-JS)                   |
| Routing           | React Router DOM v7                                          |
| Build             | Vite 6                                                       |
| State             | React Context API (session-only, no external lib needed)     |

---

## Architecture

### Current State

- `App.tsx` loads `pages.json` and renders each page as a `HousecatPage` route.
- `HousecatPage.tsx` renders `galleryItems` with a grid + lightbox, but **does not render `shopItems`**.
- `ShoppingCartWithBadge.tsx` exists as a stub: accepts `itemCount` prop, shows a count badge, opens a drawer, but the drawer body is empty and the component is **not placed** in `HousecatPage` (only a raw `ShoppingBag24Regular` icon is used).
- `Cart.tsx` is an unused playground component.
- `IShopItem.ts` and `IPage.shopItems` are already defined in the data model.

### Changes Required

```
src/
  context/
    CartContext.tsx         NEW  — cart state (entries, add, remove, total, count)
  model/
    ICartEntry.ts           NEW  — CartEntry type (shopItem + variant + qty + linePrice)
  components/
    ShopGrid.tsx            NEW  — shop item grid with Add to Cart / variant picker
    ShoppingCartWithBadge.tsx  EDIT — consume CartContext, show real items + total
    HousecatPage.tsx           EDIT — add ShopGrid section, wire up ShoppingCartWithBadge
  App.tsx                    EDIT — wrap app with CartProvider

public/
  pages.json                 EDIT — add price fields to shopItems for testability
```

---

## Key Design Decisions

### Cart State: React Context in `App.tsx`

Cart state lives in a `CartProvider` wrapping the `RouterProvider` so that entries **survive route navigation** (each `HousecatPage` remounts on navigation; a context higher in the tree persists).

### `ICartEntry` model

```ts
interface ICartEntry {
  key: string; // unique: `${item.path}|${variant?.path ?? ''}`
  item: IShopItem;
  variant?: IShopItem; // selected variant, if any
  quantity: number;
  unitPrice: number | null;
}
```

### Price display rules

| price value           | display             |
| --------------------- | ------------------- |
| `number > 0`          | `{price} kr`        |
| `0`                   | `0 kr` (Free)       |
| `null` or `undefined` | `Kontakta för pris` |

### Variant gate

When `item.variants` is non-empty, the "Lägg i varukorg" (Add to Cart) button is **disabled** until a variant is selected. Once selected, the variant (not the parent) is added.

### Shop page data

`pages.json` shop items currently have no `price` field. Adding prices to the sample data is required so the feature is visually testable without code changes.

---

## File Structure

```
src/
  context/
    CartContext.tsx
  model/
    ICartEntry.ts
  components/
    ShopGrid.tsx
    ShoppingCartWithBadge.tsx   (modified)
    HousecatPage.tsx            (modified)
  App.tsx                       (modified)
public/
  pages.json                    (modified)
```

---

## Out of Scope

- Checkout / payment (handled by feature 001)
- Cross-session cart persistence (localStorage / server)
- Currency switching (SEK only)
