# Feature Specification: Pages.json Content Editor

**Feature Branch**: `002-pages-json-editor`  
**Created**: 2026-02-18  
**Status**: Draft  
**Input**: User description: "A GUI for editing the pages.json file. The GUI can save the file locally and then uploaded to the server by SFTP"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Edit Page Content (Priority: P1)

As the artist, I want to edit basic page content (navigation text, headlines, body text) through a visual interface so that I can update my website content without editing raw JSON.

**Why this priority**: This is the core value proposition - making content editing accessible without technical knowledge. Most common editing task.

**Independent Test**: Can be fully tested by loading pages.json, editing a page's headline/text, and downloading the updated file.

**Acceptance Scenarios**:

1. **Given** I am logged into the admin interface, **When** I load pages.json, **Then** I see a list of all pages with their navigation titles
2. **Given** I am viewing the page list, **When** I click on a page, **Then** I see an edit form with fields for navTitle, navText, headline, and text
3. **Given** I am editing a page, **When** I modify the headline field and save, **Then** the change is reflected in the page data
4. **Given** I have made changes, **When** I click "Download JSON", **Then** I receive a valid pages.json file with my changes
5. **Given** I am editing a text field with multiple paragraphs, **When** I press Enter to create line breaks, **Then** I see visual paragraph separation and line breaks are preserved as \n in the exported JSON

---

### User Story 2 - Manage Gallery Items (Priority: P2)

As the artist, I want to add, edit, and remove artwork entries in the portfolio gallery so that I can keep my portfolio up to date.

**Why this priority**: Gallery management is essential for showcasing artwork but requires page editing (P1) to be functional first.

**Independent Test**: Can be tested by adding a new gallery item to a page and verifying it appears in the downloaded JSON.

**Acceptance Scenarios**:

1. **Given** I am editing a page with galleryItems, **When** I view the gallery section, **Then** I see all existing gallery items as editable cards
2. **Given** I am in the gallery section, **When** I click "Add Gallery Item", **Then** I see a form to enter path, title, description, and tagLine
3. **Given** I am editing a gallery item, **When** I modify the title and save, **Then** the change is reflected in the gallery data
4. **Given** I am viewing a gallery item, **When** I click "Remove", **Then** the item is removed from the list (after confirmation)
5. **Given** a gallery item has variants, **When** I edit the item, **Then** I can add, edit, and remove variant entries

---

### User Story 3 - Manage Shop Items (Priority: P3)

As the artist, I want to add, edit, and remove items in the shop so that I can manage what artwork is available for purchase.

**Why this priority**: Shop management builds on the same patterns as gallery management (P2).

**Independent Test**: Can be tested by adding a shop item with a price and verifying it appears in the downloaded JSON.

**Acceptance Scenarios**:

1. **Given** I am editing a page with shopItems, **When** I view the shop section, **Then** I see all existing shop items as editable cards
2. **Given** I am in the shop section, **When** I click "Add Shop Item", **Then** I see a form to enter path, title, description, and price
3. **Given** I am editing a shop item, **When** I set a price value, **Then** the price is stored as a number in the data
4. **Given** I want to indicate "Contact for pricing", **When** I leave price empty or check "Contact for pricing", **Then** the price is stored as null

---

### User Story 4 - Manage Page Images (Priority: P4)

As the artist, I want to configure the logo and lead images for each page so that I can control the visual presentation.

**Why this priority**: Image configuration is less frequently changed than text content.

**Independent Test**: Can be tested by changing a page's leadImage path and verifying the change in downloaded JSON.

**Acceptance Scenarios**:

1. **Given** I am editing a page, **When** I view the images section, **Then** I see fields for logoImage and leadImage
2. **Given** I am editing an image field, **When** I enter an image path (e.g., "/img/gallery/new-image.jpg"), **Then** I see a preview of the image if it exists
3. **Given** I am editing an image, **When** I add alt text, **Then** the altText is stored in the image object

---

### Edge Cases

- What happens when pages.json contains invalid JSON? → Display error message with line number/position, prevent loading
- What happens when a required field is left empty? → Show validation warning, allow save but highlight issue
- What happens when user navigates away with unsaved changes? → Show confirmation dialog before leaving
- What happens when image path doesn't exist? → Show broken image placeholder with warning
- What happens with very long text content? → Text area expands; preview may truncate with "show more"
- What happens when downloading JSON fails? → Show error message with retry option
- What happens with line breaks in text? → Display as visual paragraphs; store as \n in JSON on export

## Requirements _(mandatory)_

### Functional Requirements

**Authentication**

- **FR-001**: Editor MUST be protected by password authentication (consistent with constitution)
- **FR-002**: Password MUST be validated before granting access to editor functionality

**Data Loading**

- **FR-003**: System MUST allow loading pages.json from local file upload
- **FR-004**: System MUST validate JSON structure on load and display clear error messages for invalid JSON
- **FR-005**: System MUST display all pages in a navigable list/tree structure

**Page Editing**

- **FR-006**: System MUST allow editing all page fields: navTitle, navText, headline, text
- **FR-007**: System MUST provide a multi-line text editor for the text field that displays line breaks visually
- **FR-008**: System MUST allow editing image fields (logoImage, leadImage) with path and altText
- **FR-021**: System MUST preserve line breaks in text fields (stored as \n in JSON) when loading and saving
- **FR-022**: System MUST render line breaks as visual paragraph breaks during editing

**Gallery Management**

- **FR-009**: System MUST allow adding, editing, and removing gallery items on pages
- **FR-010**: System MUST support editing gallery item fields: path, title, description, tagLine
- **FR-011**: System MUST allow adding, editing, and removing variants within gallery items

**Shop Management**

- **FR-012**: System MUST allow adding, editing, and removing shop items on pages
- **FR-013**: System MUST support editing shop item fields: path, title, description, price
- **FR-014**: System MUST display prices in SEK format during editing

**Data Export**

- **FR-015**: System MUST allow downloading the edited pages.json as a file
- **FR-016**: System MUST generate valid, properly formatted JSON on export
- **FR-017**: System MUST preserve JSON structure and any fields not explicitly edited

**User Experience**

- **FR-018**: System MUST track unsaved changes and warn before navigation/close
- **FR-019**: System MUST provide image preview when valid image path is entered
- **FR-020**: System MUST provide undo capability for recent changes

### Key Entities

- **Page**: A website page with navigation info, content, and optional media collections. Has navTitle (required), navText, headline, text, logoImage, leadImage, galleryItems array, shopItems array
- **Image**: An image reference with path (required) and optional altText
- **Gallery Item**: An artwork entry for portfolio display. Has path (required), title, description, tagLine, and optional variants array
- **Shop Item**: A purchasable artwork entry. Has path (required), title, description, price (number or null for "contact for pricing")
- **Variant**: A variation of a gallery/shop item with its own path, title, and potentially price

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Artist can load, edit a page headline, and download updated JSON in under 2 minutes
- **SC-002**: Artist can add a new gallery item with all fields in under 1 minute
- **SC-003**: System correctly preserves all existing data when making changes (no data loss)
- **SC-004**: 100% of exported JSON files are valid and can be loaded back into the editor
- **SC-005**: Editor is usable on desktop browsers (Chrome, Firefox, Edge) at 1024px+ width

## Assumptions

- Artist uploads the downloaded JSON file to server via SFTP (external to this system)
- Images are already uploaded to server via SFTP before being referenced in editor
- Editor is accessed via a hidden admin route (e.g., /admin) - not linked from main navigation
- No concurrent editing support needed (single artist user)
- Browser localStorage may be used for session state but JSON file is source of truth
