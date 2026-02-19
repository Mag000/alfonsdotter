# Feature Specification: Artwork Gallery with Web Shop

**Feature Branch**: `001-gallery-webshop`  
**Created**: 2026-02-18  
**Status**: Draft  
**Input**: User description: "A gallery to show my artwork with a web shop"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Browse Artwork Gallery (Priority: P1)

As a visitor, I want to browse artwork displayed in an attractive gallery layout so that I can discover and appreciate the artist's work.

**Why this priority**: The gallery is the core experience - without it, visitors cannot discover artwork. This must work first before any shopping functionality.

**Independent Test**: Can be fully tested by navigating to the gallery page and viewing artwork tiles. Delivers immediate value by showcasing the artist's portfolio.

**Acceptance Scenarios**:

1. **Given** I am on the gallery page, **When** the page loads, **Then** I see artwork displayed in a responsive tile/grid layout with thumbnails
2. **Given** I am viewing the gallery grid, **When** I hover over an artwork tile, **Then** I see the artwork title and a brief description overlay
3. **Given** I am viewing the gallery grid, **When** I click on an artwork tile, **Then** I see a detailed view with larger image(s), full description, and variants if available
4. **Given** I am on mobile or tablet, **When** I view the gallery, **Then** the layout adapts responsively to show appropriate number of columns

---

### User Story 2 - Add Artwork to Shopping Cart (Priority: P2)

As a visitor who wants to purchase artwork, I want to add items to a shopping cart so that I can collect multiple pieces before checkout.

**Why this priority**: Shopping cart is essential for e-commerce. Without it, users cannot express purchase intent.

**Independent Test**: Can be fully tested by adding artwork to cart and verifying cart contents. Delivers value by allowing purchase intent capture.

**Acceptance Scenarios**:

1. **Given** I am viewing an artwork detail page, **When** the artwork is available for purchase, **Then** I see a price and "Add to Cart" button
2. **Given** I am viewing an artwork with variants (e.g., different sizes/prints), **When** I want to purchase, **Then** I can select the specific variant before adding to cart
3. **Given** I click "Add to Cart", **When** the item is added, **Then** I see visual confirmation and the cart icon shows updated item count
4. **Given** I have items in my cart, **When** I click the cart icon, **Then** I see a cart panel/drawer showing all items with thumbnails, titles, quantities, and prices

---

### User Story 3 - Manage Shopping Cart (Priority: P3)

As a shopper, I want to review and modify my cart contents so that I can adjust my purchase before checkout.

**Why this priority**: Cart management is needed for a good shopping experience but builds on P2 cart functionality.

**Independent Test**: Can be tested by modifying quantities and removing items from cart.

**Acceptance Scenarios**:

1. **Given** I have items in my cart, **When** I view the cart, **Then** I see the total price calculated from all items
2. **Given** I have an item in my cart, **When** I click remove, **Then** the item is removed and totals update immediately
3. **Given** I have items in my cart, **When** I close and reopen the browser, **Then** my cart contents are preserved (session persistence)

---

### User Story 4 - Submit Purchase Inquiry (Priority: P4)

As a shopper ready to buy, I want to submit my purchase request so that the artist can process my order.

**Why this priority**: Checkout completes the purchase flow but requires cart functionality to exist first.

**Independent Test**: Can be tested by completing checkout form submission with cart items.

**Acceptance Scenarios**:

1. **Given** I have items in my cart, **When** I click "Checkout" or "Submit Order", **Then** I see a form requesting my contact information (name, email, phone optional)
2. **Given** I fill out the checkout form, **When** I submit, **Then** my order details and contact info are sent to the artist
3. **Given** I submit an order, **When** successful, **Then** I see a confirmation message with next steps (artist will contact for payment/delivery)
4. **Given** I submit an order, **When** successful, **Then** my cart is cleared

---

### Edge Cases

- What happens when an artwork has no price set? → Display "Contact for pricing" instead of Add to Cart button
- What happens when the cart is empty and user clicks checkout? → Disable checkout button and show message to add items first
- How does system handle if artwork becomes unavailable after being added to cart? → Show warning when viewing cart, allow removal
- What happens if contact form submission fails? → Show error message with retry option, preserve form data
- What happens with very long artwork titles or descriptions? → Truncate with ellipsis in grid view, show full text in detail view

## Requirements _(mandatory)_

### Functional Requirements

**Gallery Display**

- **FR-001**: System MUST display artwork in a responsive grid layout that adapts to screen width (mobile: 1-2 columns, tablet: 2-3 columns, desktop: 3-4 columns)
- **FR-002**: System MUST show artwork thumbnail, title, and hover overlay with description in the gallery grid
- **FR-003**: System MUST support artwork detail view showing full-size image(s), title, description, price, and variants
- **FR-022**: Portfolio/gallery page MUST display all artwork from `galleryItems` array
- **FR-023**: Shop page MUST display only purchasable items from separate `shopItems` array

**Shopping Cart**

- **FR-004**: System MUST allow adding purchasable artwork to a shopping cart
- **FR-005**: System MUST display a cart icon with badge showing number of items
- **FR-006**: System MUST persist cart contents in browser storage so cart survives page refresh
- **FR-007**: System MUST allow removing items from cart
- **FR-008**: System MUST calculate and display cart total price
- **FR-021**: System MUST display prices in Swedish Krona (SEK) formatted as "X XXX kr"

**Checkout**

- **FR-009**: System MUST collect customer contact information (name, email required; phone optional)
- **FR-010**: System MUST validate email format before submission
- **FR-011**: System MUST send order details to artist (via existing MailSender Azure Function)
- **FR-012**: System MUST display confirmation after successful order submission
- **FR-013**: System MUST clear cart after successful order submission

**Artwork Data**

- **FR-014**: Artwork MUST support variants (e.g., different sizes, print types) with individual prices
- **FR-015**: Artwork MAY have price set to null to indicate "Contact for pricing"

**Admin Interface**

- **FR-016**: System MUST provide an admin interface for the artist to edit artwork metadata (title, description, price, variants) in pages.json
- **FR-017**: Admin interface MUST be protected by a simple password authentication
- **FR-018**: System MUST store admin password securely (not in plain text in client code)

**Image Management**

- **FR-019**: Artwork images MUST be uploaded via SFTP to the public/img folder
- **FR-020**: Admin interface MUST allow specifying image paths that reference uploaded images

### Key Entities

- **Artwork**: Represents a piece of art in the gallery. Has title, description, images (thumbnail + full), price, availability status, and optional variants
- **Artwork Variant**: A variation of artwork (e.g., print size, medium). Has its own title, price, and image
- **Cart Item**: An artwork or variant added to cart. References the artwork/variant with quantity (typically 1 for unique art pieces)
- **Cart**: Collection of cart items with calculated total. Persisted in browser storage
- **Order**: Submitted purchase request containing cart contents and customer contact information

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Visitors can browse the complete gallery and view artwork details within 3 clicks from homepage
- **SC-002**: Users can add artwork to cart and complete checkout form in under 2 minutes
- **SC-003**: Gallery loads and displays artwork grid within 2 seconds on standard connections
- **SC-004**: Cart contents persist across browser sessions (verified by closing and reopening browser)
- **SC-005**: 100% of submitted orders successfully deliver contact information to the artist
- **SC-006**: Gallery layout displays correctly on mobile (320px+), tablet (768px+), and desktop (1024px+) viewports

## Assumptions

- Payment processing is handled offline by the artist after receiving the order inquiry (no online payment integration required)
- Artwork inventory is managed externally; system does not track stock levels
- Artist will manually update artwork availability via admin interface
- Contact form uses existing MailSender Azure Function for email delivery
- Artwork images are uploaded via SFTP to public/img directory (external to this system)
- Artwork metadata extends existing pages.json structure with price and shop-related fields

## Clarifications

### Session 2026-02-18

- Q: How will artwork data be managed and loaded? → A: Admin interface within the app for the artist to manage artwork
- Q: How should admin interface be secured? → A: Simple password-protected route (single shared password)
- Q: Where should artwork data and images be stored? → A: Images via SFTP to public/img folder; artwork metadata in existing pages.json
- Q: What currency format for prices? → A: Swedish Krona (SEK) - displayed as "X XXX kr"
- Q: How do gallery and shop items relate? → A: Separate - gallery shows all artwork (`galleryItems`), shop shows only purchasable items (`shopItems`)
