# Feature Specification: Gallery Add to Cart

**Feature Branch**: `007-gallery-add-to-cart`  
**Created**: 2026-03-15  
**Status**: In Review  
**Input**: User description: "If there is a shopItems property, the images should be possible to add to a shopping cart"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Shop Items with Add to Cart (Priority: P1)

As a visitor browsing a shop page, I want to see each artwork displayed with an "Add to Cart" button so that I can select items I want to purchase.

When a page's data includes a `shopItems` list, the items are rendered in a gallery layout where each item shows its image, title, and an "Add to Cart" button. Pages that only have `galleryItems` do not show cart controls — this keeps pure portfolio pages clean and commerce-free.

**Why this priority**: This is the core behaviour of the feature. A shop page must visually distinguish itself from a gallery page by offering purchasable items. Without this, the feature delivers no value.

**Independent Test**: Load the `/shop` page (which has `shopItems` in its page data), verify that each item is displayed with an "Add to Cart" button. Then load a page that only has `galleryItems` and verify no cart buttons appear.

**Acceptance Scenarios**:

1. **Given** I navigate to a page that has a `shopItems` property, **When** the page renders, **Then** each item is shown with its image, title, and an "Add to Cart" button
2. **Given** I navigate to a page that only has `galleryItems`, **When** the page renders, **Then** no "Add to Cart" buttons are shown — items are displayed in read-only gallery mode
3. **Given** a shop item has a defined price, **When** I view the item, **Then** the price is displayed alongside the "Add to Cart" button
4. **Given** a shop item has no price (null or missing), **When** I view the item, **Then** a "Contact for pricing" label is shown instead of a price, and an "Enquire" or equivalent action is available

---

### User Story 2 - Add Item to Cart and See Cart Update (Priority: P2)

As a visitor who wants to purchase artwork, I want to add a shop item to my cart and see immediate feedback so I know my selection was recorded.

**Why this priority**: Adding to cart is the primary action this feature enables. Without visible feedback, users cannot confirm their selection was successful.

**Independent Test**: Click "Add to Cart" on any shop item. Verify the cart icon in the header shows a non-zero item count and that opening the cart shows the added item.

**Acceptance Scenarios**:

1. **Given** I am on a shop page, **When** I click "Add to Cart" on an item, **Then** the cart icon in the header updates to reflect the new item count
2. **Given** I have added an item to the cart, **When** I open the cart, **Then** I see the item listed with its title, thumbnail, and price
3. **Given** I add the same item twice, **When** I open the cart, **Then** the item appears with a quantity of 2 (or as two separate entries) and the total reflects both

---

### User Story 3 - Select Variant Before Adding to Cart (Priority: P3)

As a visitor who wants a specific size or format of an artwork, I want to choose from available variants before adding to my cart so that the correct product is recorded.

**Why this priority**: Variants (e.g., print sizes, formats) are supported by the data model. Without variant selection, users may inadvertently add the wrong product.

**Independent Test**: Open a shop item that has `variants` defined. Verify that variant options are presented, a selection is required before adding to cart, and the correct variant is reflected in the cart.

**Acceptance Scenarios**:

1. **Given** a shop item has one or more variants, **When** I view the item, **Then** I can see the variant options before clicking "Add to Cart"
2. **Given** I have selected a variant, **When** I click "Add to Cart", **Then** the selected variant is added to the cart (not the parent item)
3. **Given** a shop item has no variants, **When** I view the item, **Then** no variant selection is shown and I can add directly to cart

---

### Edge Cases

- A page has both `galleryItems` and `shopItems` defined: the `shopItems` are rendered with cart controls; `galleryItems` (if rendered on the same page) are shown without cart controls
- A shop item has a price of `0`: display the price as "Free" or "0 kr" — do not treat 0 as "no price"
- The cart is opened while empty: an empty-state message is shown and no checkout action is available
- A visitor adds items, navigates away, and returns: cart contents are preserved for the duration of the browser session

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST render shop items with an "Add to Cart" control on any page that has a `shopItems` property in its page data
- **FR-002**: The system MUST NOT display cart controls on pages that only have `galleryItems` — gallery-only pages remain purchase-free
- **FR-003**: Each shop item MUST display its image, title, and price (or "Contact for pricing" when price is absent or null)
- **FR-004**: Clicking "Add to Cart" MUST add the item to a shared cart state that persists across page navigation within the same session
- **FR-005**: The cart icon in the site header MUST display a badge showing the current number of items in the cart
- **FR-006**: When a shop item has variants, the visitor MUST be able to select a variant before adding to cart; the selected variant is what gets added
- **FR-007**: The cart MUST be viewable at any time by clicking the cart icon; it MUST show all added items with title, thumbnail, quantity, and line price
- **FR-008**: The cart MUST show a running total of all items

### Key Entities

- **Shop Item**: A purchasable artwork tile sourced from the `shopItems` array of a page. Has a path (image), title, optional description, optional price, and optional variants.
- **Cart**: A session-scoped collection of chosen shop items. Tracks item identity, selected variant (if any), quantity, and per-item price.
- **Cart Entry**: One line in the cart. Represents a specific shop item (or variant) with a quantity and calculated line total.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A visitor can go from landing on a shop page to having an item in the cart in 2 or fewer clicks
- **SC-002**: After adding an item, the cart badge updates within 1 second with no page reload
- **SC-003**: 100% of pages that contain `shopItems` in their page data show cart controls; 0% of gallery-only pages show cart controls — no manual configuration required
- **SC-004**: Cart contents survive full in-app navigation (visiting other pages and returning) without any loss
- **SC-005**: A shop item with variants cannot be added to the cart without a variant being selected — the "Add to Cart" button is disabled or hidden until a variant is chosen

## Assumptions

- Checkout / payment processing is out of scope for this feature. The cart collects selections; submitting an order (as specified in `001-gallery-webshop`) is handled elsewhere.
- Prices are expressed in SEK. No currency switcher is required.
- The cart does not need to persist across browser sessions (local storage or server-side persistence is a future enhancement).
- A shop item without `variants` can always be added directly; no default variant selection is needed.
