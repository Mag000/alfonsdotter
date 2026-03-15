# Tasks: Gallery Add to Cart

**Feature Branch**: `007-gallery-add-to-cart`  
**Created**: 2026-03-15  
**Based on**: plan.md + spec.md

---

## Phase 1 — Data & Models

### T-001 — Add ICartEntry model

- [x] Create `src/model/ICartEntry.ts`
  - Fields: `key: string`, `item: IShopItem`, `variant?: IShopItem`, `quantity: number`, `unitPrice: number | null`

### T-002 — Add prices to shop items in pages.json

- [x] Edit `public/pages.json`, shop page `shopItems`
  - Add `"price": <number>` to each item so the feature is visually testable
  - One item should have `"price": null` to test "contact for pricing" path

---

## Phase 2 — Cart State

### T-003 — Create CartContext

- [x] Create `src/context/CartContext.tsx`
  - `CartContext` with `entries: ICartEntry[]`, `addToCart(item, variant?)`, `removeEntry(key)`, `clearCart()`, `itemCount: number`, `total: number | null`
  - `CartProvider` component that wraps children
  - `useCart()` hook that reads the context
  - Cart state initialised from `sessionStorage` so it survives same-tab navigation
  - On state change, write entries back to `sessionStorage`

### T-004 — Wrap App with CartProvider

- [x] Edit `src/App.tsx`
  - Import and wrap `RouterProvider` (or entire return) with `<CartProvider>`

---

## Phase 3 — Shop Grid Component

### T-005 — Create ShopGrid component

- [x] Create `src/components/ShopGrid.tsx`
  - Props: `items: IShopItem[]`
  - Consumes `useCart()` to call `addToCart`
  - Layout: same 3-column responsive grid as gallery (`repeat(3,1fr)` → 2 → 1)
  - Per item:
    - Image (square, object-fit cover)
    - Title
    - Price display: `{price} kr` / `0 kr` / `Kontakta för pris`
    - Variant picker (dropdown/select with Fluent UI `Dropdown` or native `<select>`) — shown only when `item.variants` is non-empty
    - "Lägg i varukorg" button — disabled when `item.variants` is non-empty and no variant is selected
    - On click: call `addToCart(item, selectedVariant)`, reset selection

---

## Phase 4 — Cart Drawer

### T-006 — Wire ShoppingCartWithBadge to real cart state

- [x] Edit `src/components/ShoppingCartWithBadge.tsx`
  - Remove the `itemCount` prop — read `itemCount` and `entries` from `useCart()`
  - Drawer body: list of cart entries
    - Thumbnail image (40×40), title (or variant title), quantity, line price
    - Remove button per entry
  - Footer: running total (`total` kr) — or "—" if any item has null price
  - Empty state: message "Varukorgen är tom" when `entries.length === 0`
  - Remove unused Reload / Settings toolbar buttons; keep only Close

---

## Phase 5 — Page Integration

### T-007 — Add ShopGrid section to HousecatPage

- [x] Edit `src/components/HousecatPage.tsx`
  - Import `ShopGrid`
  - Add `const hasShop = (props.shopItems || []).length > 0;` variable
  - Render `<ShopGrid items={props.shopItems!} />` in a `<section>` after the text content block, conditional on `hasShop`
  - Use equivalent section padding/max-width as `gallerySection`

### T-008 — Replace header shopping bag with ShoppingCartWithBadge

- [x] Edit `src/components/HousecatPage.tsx`
  - Remove the static `<ShoppingBag24Regular />` button from the header `headerIcons` area
  - Replace with `<ShoppingCartWithBadge />`
  - Import `ShoppingCartWithBadge`

---

## Phase 6 — Polish & Verification

### T-009 — Visual QA: shop page shows items + cart works end-to-end

- [ ] Run `npm start` (Vite dev server) and navigate to `/shop`
  - Each item shows image, title, price, Add to Cart button
  - Cart badge updates on add
  - Cart drawer shows items and total
  - Navigate away and back — cart items still present

### T-010 — Visual QA: gallery-only page has no cart controls

- [ ] Navigate to `/` (portfolio page, has `galleryItems` only)
  - No "Lägg i varukorg" buttons visible
  - Gallery lightbox still works

### T-011 — Mark spec Status as In Review

- [x] Edit `specs/007-gallery-add-to-cart/spec.md`
  - Change `**Status**: Draft` → `**Status**: In Review`
