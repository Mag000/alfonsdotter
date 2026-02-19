# Quickstart: Pages.json Content Editor

**Feature**: 002-pages-json-editor  
**Date**: 2026-02-18

## Overview

This feature adds an admin interface at `/admin` for editing the website's `pages.json` content file. The editor allows the artist to modify page content, gallery items, and shop items through a visual interface, then download the updated JSON for SFTP upload.

---

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Development server running (`npm start`)

---

## Quick Start (Development)

1. **Start the development server:**

   ```bash
   npm start
   ```

2. **Navigate to the admin editor:**

   ```
   http://localhost:3000/admin
   ```

3. **Enter the admin password** (configured in environment or code)

4. **Load pages.json:**
   - Click "Load JSON" and select the `public/pages.json` file

5. **Edit content:**
   - Select a page from the left panel
   - Edit fields in the right panel
   - Changes are tracked automatically

6. **Download updated JSON:**
   - Click "Download JSON"
   - Replace `public/pages.json` with downloaded file
   - Upload to server via SFTP

---

## Component Structure

```
src/components/admin/
├── AdminLogin.tsx       # Password authentication gate
├── PagesEditor.tsx      # Main editor container (layout, state)
├── PageList.tsx         # Left panel - navigable page tree
├── PageForm.tsx         # Page content edit form
├── GalleryEditor.tsx    # Gallery items CRUD
├── ShopEditor.tsx       # Shop items CRUD
└── ImageField.tsx       # Image path input with preview
```

---

## Key Files to Create/Modify

### New Files

| File                                     | Purpose                    |
| ---------------------------------------- | -------------------------- |
| `src/model/IEditorState.ts`              | Editor state interfaces    |
| `src/services/editorService.ts`          | JSON load/save, validation |
| `src/components/admin/AdminLogin.tsx`    | Authentication component   |
| `src/components/admin/PagesEditor.tsx`   | Main editor container      |
| `src/components/admin/PageList.tsx`      | Page navigation list       |
| `src/components/admin/PageForm.tsx`      | Page content form          |
| `src/components/admin/GalleryEditor.tsx` | Gallery items editor       |
| `src/components/admin/ShopEditor.tsx`    | Shop items editor          |
| `src/components/admin/ImageField.tsx`    | Image field with preview   |

### Modified Files

| File                     | Change                        |
| ------------------------ | ----------------------------- |
| `src/model/IShopItem.ts` | Add `path` and `price` fields |
| `src/App.tsx`            | Add `/admin` route            |

---

## Development Workflow

### 1. Set Up Routing

Add admin route to `App.tsx`:

```typescript
import { PagesEditor } from './components/admin/PagesEditor';

// In router config:
<Route path="/admin" element={<PagesEditor />} />
```

### 2. Create Editor State

Create `src/model/IEditorState.ts` with interfaces from data-model.md.

### 3. Build Components (in order)

1. **AdminLogin** - Simple password check
2. **PagesEditor** - Container with state management
3. **PageList** - Read pages array, render as tree
4. **PageForm** - Form fields bound to selected page
5. **ImageField** - Reusable image input
6. **GalleryEditor** - CRUD for gallery items
7. **ShopEditor** - CRUD for shop items

### 4. Add JSON Operations

Create `src/services/editorService.ts`:

- `loadJsonFile(file: File): Promise<IPage[]>`
- `downloadJson(pages: IPage[]): void`
- `validatePages(pages: IPage[]): IValidationError[]`

---

## Testing Checklist

- [ ] Can load valid pages.json
- [ ] Shows error for invalid JSON
- [ ] Can edit page headline and see change
- [ ] Line breaks preserved in text fields
- [ ] Can add/edit/remove gallery item
- [ ] Can add/edit/remove shop item
- [ ] Download produces valid JSON
- [ ] Downloaded JSON loads back into editor
- [ ] Unsaved changes warning works
- [ ] Undo/redo works

---

## Environment Configuration

```env
# Optional: Store admin password in environment
REACT_APP_ADMIN_PASSWORD=your-secure-password
```

For development, a hardcoded password is acceptable per spec (single artist user, hidden admin route).

---

## Success Criteria Verification

| Criterion                          | How to Verify                                   |
| ---------------------------------- | ----------------------------------------------- |
| SC-001: Edit headline in <2 min    | Time from load to download with headline change |
| SC-002: Add gallery item in <1 min | Time to click Add, fill fields, save            |
| SC-003: No data loss               | Load → Save → Diff original vs downloaded       |
| SC-004: Valid JSON export          | JSON.parse() on downloaded file                 |
| SC-005: Desktop browser support    | Test in Chrome, Firefox, Edge at 1024px+        |
