# Data Model: Pages.json Content Editor

**Feature**: 002-pages-json-editor  
**Date**: 2026-02-18

## Overview

The editor operates on the existing pages.json data structure. This document defines the entities, their relationships, validation rules, and the new editor state interfaces needed.

---

## Existing Entities (from `/src/model/`)

### IPage

**File**: `src/model/IPage.ts`  
**Purpose**: Represents a website page with navigation info, content, and media collections.

| Field          | Type             | Required | Validation                                           |
| -------------- | ---------------- | -------- | ---------------------------------------------------- |
| `navTitle`     | `string`         | ✅       | Must be non-empty, serves as unique identifier/route |
| `navText`      | `string`         | ❌       | Display text for navigation menu                     |
| `headline`     | `string`         | ❌       | Page heading text                                    |
| `text`         | `string`         | ❌       | Body content, may contain `\n` for line breaks       |
| `logoImage`    | `IImage`         | ❌       | Logo image for the page                              |
| `leadImage`    | `IImage`         | ❌       | Hero/lead image for the page                         |
| `contactForm`  | `boolean`        | ❌       | Whether to show contact form                         |
| `galleryItems` | `IGalleryItem[]` | ❌       | Portfolio gallery entries                            |
| `shopItems`    | `IShopItem[]`    | ❌       | Shop product entries                                 |
| `menuItems`    | `IPage[]`        | ❌       | Nested subpages (for menu structure)                 |

**State Transitions**: None (CRUD operations only)

---

### IImage

**File**: `src/model/IImage.ts`  
**Purpose**: Represents an image reference with path and metadata.

| Field         | Type     | Required | Validation                               |
| ------------- | -------- | -------- | ---------------------------------------- |
| `path`        | `string` | ✅       | Must start with `/img/`, valid file path |
| `altText`     | `string` | ❌       | Accessibility description                |
| `width`       | `number` | ❌       | Positive integer (pixels)                |
| `height`      | `number` | ❌       | Positive integer (pixels)                |
| `description` | `string` | ❌       | Extended description                     |

---

### IGalleryItem

**File**: `src/model/IGalleryItem.ts`  
**Purpose**: Represents an artwork entry for portfolio display.

| Field         | Type             | Required | Validation                            |
| ------------- | ---------------- | -------- | ------------------------------------- |
| `path`        | `string`         | ✅       | Image path, must start with `/img/`   |
| `title`       | `string`         | ❌       | Artwork title                         |
| `tagLine`     | `string`         | ❌       | Short promotional text                |
| `description` | `string`         | ❌       | Detailed description                  |
| `thumbnail`   | `IImage`         | ❌       | Thumbnail image (different from main) |
| `variants`    | `IGalleryItem[]` | ❌       | Variations of the artwork             |
| `navTitle`    | `string`         | ❌       | Navigation identifier                 |
| `altText`     | `string`         | ❌       | Image alt text (legacy)               |
| `width`       | `number`         | ❌       | Image width                           |
| `height`      | `number`         | ❌       | Image height                          |

---

### IShopItem (REQUIRES UPDATE)

**File**: `src/model/IShopItem.ts`  
**Purpose**: Represents a purchasable artwork entry.

**Current Interface** (needs extension):

```typescript
export interface IShopItem {
  title?: string;
  description?: string;
  thumbnail?: IImage;
  image?: IImage;
  variants?: IShopItem[];
}
```

**Required Fields** (based on spec and pages.json usage):

| Field         | Type             | Required | Validation                                 |
| ------------- | ---------------- | -------- | ------------------------------------------ |
| `path`        | `string`         | ✅       | Image path, must start with `/img/`        |
| `title`       | `string`         | ❌       | Product title                              |
| `description` | `string`         | ❌       | Product description                        |
| `price`       | `number \| null` | ❌       | Price in SEK, null = "contact for pricing" |
| `thumbnail`   | `IImage`         | ❌       | Thumbnail image                            |
| `image`       | `IImage`         | ❌       | Full-size image                            |
| `variants`    | `IShopItem[]`    | ❌       | Product variants                           |

**Action Required**: Update `IShopItem` to add `path` (required) and `price` fields.

---

## New Entities (for editor state)

### IEditorState

**File**: `src/model/IEditorState.ts` (NEW)  
**Purpose**: Represents the overall editor application state.

| Field               | Type                 | Required | Description                                  |
| ------------------- | -------------------- | -------- | -------------------------------------------- |
| `pages`             | `IPage[]`            | ✅       | Current pages data being edited              |
| `savedPages`        | `IPage[]`            | ✅       | Last saved/loaded state (for dirty checking) |
| `selectedPageIndex` | `number \| null`     | ❌       | Currently selected page in list              |
| `isAuthenticated`   | `boolean`            | ✅       | Whether user has logged in                   |
| `hasUnsavedChanges` | `boolean`            | ✅       | Derived from pages !== savedPages            |
| `validationErrors`  | `IValidationError[]` | ❌       | Current validation issues                    |

---

### IEditorHistory

**File**: `src/model/IEditorState.ts` (NEW)  
**Purpose**: Undo/redo history management.

| Field          | Type        | Required | Description                               |
| -------------- | ----------- | -------- | ----------------------------------------- |
| `states`       | `IPage[][]` | ✅       | Array of state snapshots                  |
| `currentIndex` | `number`    | ✅       | Current position in history               |
| `maxHistory`   | `number`    | ✅       | Maximum snapshots to retain (default: 50) |

---

### IValidationError

**File**: `src/model/IEditorState.ts` (NEW)  
**Purpose**: Represents a validation warning or error.

| Field       | Type                   | Required | Description                                           |
| ----------- | ---------------------- | -------- | ----------------------------------------------------- |
| `pageIndex` | `number`               | ✅       | Index of page with issue                              |
| `field`     | `string`               | ✅       | Field path (e.g., "navTitle", "galleryItems[0].path") |
| `message`   | `string`               | ✅       | Human-readable error message                          |
| `severity`  | `'error' \| 'warning'` | ✅       | Error prevents save, warning allows                   |

---

### IAdminSession

**File**: `src/model/IEditorState.ts` (NEW)  
**Purpose**: Authentication session stored in localStorage.

| Field           | Type      | Required | Description                    |
| --------------- | --------- | -------- | ------------------------------ |
| `authenticated` | `boolean` | ✅       | Whether session is valid       |
| `expires`       | `number`  | ✅       | Timestamp when session expires |

---

## Entity Relationships

```text
IEditorState
├── pages: IPage[]
│   ├── logoImage: IImage
│   ├── leadImage: IImage
│   ├── galleryItems: IGalleryItem[]
│   │   ├── thumbnail: IImage
│   │   └── variants: IGalleryItem[] (recursive)
│   ├── shopItems: IShopItem[]
│   │   ├── thumbnail: IImage
│   │   ├── image: IImage
│   │   └── variants: IShopItem[] (recursive)
│   └── menuItems: IPage[] (recursive)
├── savedPages: IPage[] (same structure, immutable reference)
└── validationErrors: IValidationError[]
```

---

## Validation Rules

### Page Validation

| Rule  | Field      | Condition                       | Severity |
| ----- | ---------- | ------------------------------- | -------- |
| V-001 | `navTitle` | Must be non-empty               | Error    |
| V-002 | `navTitle` | Must be unique across all pages | Error    |
| V-003 | `navTitle` | Should start with `/`           | Warning  |

### Image Validation

| Rule  | Field  | Condition                                | Severity |
| ----- | ------ | ---------------------------------------- | -------- |
| V-010 | `path` | Must be non-empty if image object exists | Error    |
| V-011 | `path` | Should start with `/img/`                | Warning  |
| V-012 | `path` | Image should be loadable (preview check) | Warning  |

### Gallery Item Validation

| Rule  | Field  | Condition                 | Severity |
| ----- | ------ | ------------------------- | -------- |
| V-020 | `path` | Must be non-empty         | Error    |
| V-021 | `path` | Should start with `/img/` | Warning  |

### Shop Item Validation

| Rule  | Field   | Condition                                     | Severity |
| ----- | ------- | --------------------------------------------- | -------- |
| V-030 | `path`  | Must be non-empty                             | Error    |
| V-031 | `price` | Must be positive number or null               | Error    |
| V-032 | `price` | If number, should be reasonable (< 1,000,000) | Warning  |

---

## Type Definitions Summary

```typescript
// src/model/IEditorState.ts (NEW FILE)
import { IPage } from "./IPage";

export interface IEditorState {
  pages: IPage[];
  savedPages: IPage[];
  selectedPageIndex: number | null;
  isAuthenticated: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: IValidationError[];
}

export interface IEditorHistory {
  states: IPage[][];
  currentIndex: number;
  maxHistory: number;
}

export interface IValidationError {
  pageIndex: number;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface IAdminSession {
  authenticated: boolean;
  expires: number;
}
```

```typescript
// src/model/IShopItem.ts (UPDATED)
import { IImage } from "./IImage";

export interface IShopItem {
  path: string; // ADDED - required
  title?: string;
  description?: string;
  price?: number | null; // ADDED - null = "contact for pricing"
  thumbnail?: IImage;
  image?: IImage;
  variants?: IShopItem[];
}
```
