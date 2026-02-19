# Research: Pages.json Content Editor

**Feature**: 002-pages-json-editor  
**Date**: 2026-02-18

## Research Summary

All technical decisions have been resolved. No NEEDS CLARIFICATION items from Technical Context.

---

## 1. FluentUI9 Form Components

**Decision**: Use FluentUI9 form components for all editor inputs

**Rationale**:

- `Input` for single-line text (navTitle, navText, headline, path fields)
- `Textarea` for multi-line content (text, description) with `resize="vertical"`
- `Field` wrapper for labels and validation messages
- `Button` for actions (Save, Add, Remove, Download)
- `Dialog` for confirmations (unsaved changes, delete confirmation)
- `Tree` / `TreeItem` for page list navigation
- `Card` for gallery/shop item containers
- `SpinButton` for numeric price input

**Alternatives Considered**:

- TinyMCE editor (already in project) - rejected because plain text with line breaks is sufficient per spec, and keeps JSON simple
- Custom form components - rejected because FluentUI9 provides accessible, consistent components

---

## 2. JSON File Handling in Browser

**Decision**: Use FileReader API for loading, Blob + download link for saving

**Rationale**:

- **Loading**: `<input type="file" accept=".json">` + `FileReader.readAsText()` is browser-native and works offline
- **Saving**: Create `Blob` with JSON content, use `URL.createObjectURL()` and programmatic `<a>` click for download
- No server round-trip required - fully client-side operation

**Implementation Pattern**:

```typescript
// Loading
const handleFileLoad = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const json = JSON.parse(e.target?.result as string);
    setPages(json);
  };
  reader.readAsText(file);
};

// Saving
const handleDownload = (pages: IPage[]) => {
  const blob = new Blob([JSON.stringify(pages, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pages.json";
  a.click();
  URL.revokeObjectURL(url);
};
```

**Alternatives Considered**:

- Server-side file storage - rejected because spec requires SFTP upload externally
- localStorage as primary storage - rejected because file download is source of truth per spec

---

## 3. Line Break Handling

**Decision**: Store line breaks as `\n` in JSON, render as visual breaks in Textarea

**Rationale**:

- HTML `<textarea>` natively handles newlines - user presses Enter, sees visual line break
- `JSON.stringify()` automatically escapes newlines as `\n` in the output
- `JSON.parse()` automatically unescapes `\n` back to newline characters
- No special transformation needed - it works by default

**Edge Cases**:

- Windows line endings (`\r\n`) - `JSON.parse()` preserves them; consider normalizing to `\n` on load for consistency
- Display in public site - `text.split('\n').map(p => <p>{p}</p>)` renders as paragraphs

**Alternatives Considered**:

- Markdown support - rejected because adds complexity; plain text with line breaks is sufficient per spec
- HTML content - rejected because would complicate JSON structure and require sanitization

---

## 4. Undo/Redo State Management

**Decision**: Use simple state history array with pointer

**Rationale**:

- Store history as array of state snapshots (pages array)
- Maintain current index pointer
- On edit: truncate future history, append new state
- Undo: decrement index, restore previous state
- Redo: increment index, restore next state
- Limit history to ~50 entries to prevent memory bloat

**Implementation Pattern**:

```typescript
interface IEditorHistory {
  states: IPage[][];
  currentIndex: number;
}

const undo = () => {
  if (history.currentIndex > 0) {
    setHistory((h) => ({ ...h, currentIndex: h.currentIndex - 1 }));
    setPages(history.states[history.currentIndex - 1]);
  }
};
```

**Alternatives Considered**:

- Redux with time-travel - rejected because overkill for single-user editor
- No undo - rejected because FR-020 requires it
- Command pattern - rejected because snapshot approach is simpler for JSON data

---

## 5. Authentication Pattern

**Decision**: Simple password gate stored in localStorage session

**Rationale**:

- Single-user admin, no user accounts needed
- Password checked against hardcoded/env value on login
- Session token stored in localStorage with expiration
- Protects against casual discovery, not security-critical (public data)

**Implementation Pattern**:

```typescript
const PASSWORD = "configured-admin-password"; // Could be env var in production

const login = (input: string): boolean => {
  if (input === PASSWORD) {
    localStorage.setItem(
      "admin-session",
      JSON.stringify({
        authenticated: true,
        expires: Date.now() + 3600000, // 1 hour
      }),
    );
    return true;
  }
  return false;
};

const isAuthenticated = (): boolean => {
  const session = JSON.parse(localStorage.getItem("admin-session") || "{}");
  return session.authenticated && session.expires > Date.now();
};
```

**Alternatives Considered**:

- No authentication - rejected because FR-001 requires it
- Full OAuth/JWT - rejected because overkill for single artist user on hidden admin route

---

## 6. Image Preview Pattern

**Decision**: Use `<img>` with error handler for broken image fallback

**Rationale**:

- Image path entered is relative to public folder (e.g., `/img/gallery/art.jpg`)
- Render `<img src={imagePath} onError={showBrokenImagePlaceholder} />`
- If image loads, show preview; if error, show placeholder with warning

**Implementation Pattern**:

```typescript
<img
  src={imagePath || '/img/placeholder.png'}
  alt="Preview"
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/img/broken-image.png';
    setImageWarning('Image not found');
  }}
/>
```

---

## 7. Unsaved Changes Detection

**Decision**: Compare current state to last-saved state using deep equality

**Rationale**:

- Track `savedPages` (last loaded/downloaded state) and `pages` (current state)
- `hasUnsavedChanges = JSON.stringify(pages) !== JSON.stringify(savedPages)`
- Hook into `beforeunload` event for browser close warning
- Use React Router's `useBlocker` for navigation blocking

**Implementation Pattern**:

```typescript
useEffect(() => {
  if (hasUnsavedChanges) {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }
}, [hasUnsavedChanges]);
```

---

## Conclusion

All research items resolved. Proceed to Phase 1 design with clear implementation patterns for each technical challenge.
