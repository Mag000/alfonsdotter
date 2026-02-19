# Implementation Plan: Pages.json Content Editor

**Branch**: `002-pages-json-editor` | **Date**: 2026-02-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-pages-json-editor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

A GUI admin interface for editing the website's pages.json content file. Built as a React/TypeScript/FluentUI9 component suite accessed via /admin route, enabling the artist to visually edit page content, gallery items, and shop items, then download the updated JSON for SFTP upload to the server.

## Technical Context

**Language/Version**: TypeScript 4.9.5, React 18+  
**Primary Dependencies**: @fluentui/react-components ^9.58.2, React Router v6 (^7.1.3)  
**Storage**: File-based (pages.json loaded/downloaded via browser), localStorage for session state  
**Testing**: Jest + React Testing Library  
**Target Platform**: Web (Chrome, Firefox, Edge at 1024px+ desktop)  
**Project Type**: Web frontend (single SPA)  
**Performance Goals**: Load/parse JSON under 500ms, responsive UI interactions  
**Constraints**: Offline-capable editing (after initial load), export valid JSON always  
**Scale/Scope**: Single user (artist), ~12 pages, ~50 gallery items, ~20 shop items

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                   | Compliance | Notes                                                                              |
| --------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| I. TypeScript-First         | ✅ PASS    | All components use typed interfaces (IPage, IGalleryItem, IShopItem already exist) |
| II. FluentUI9 Components    | ✅ PASS    | Use FluentUI9 Input, Button, Dialog, Textarea, TreeView for all UI                 |
| III. React Best Practices   | ✅ PASS    | Functional components, hooks for state, React Router for /admin route              |
| IV. Component Architecture  | ✅ PASS    | New components in /components/, one per file, PascalCase naming                    |
| V. Type Safety & Interfaces | ✅ PASS    | Extend existing interfaces in /model/, I-prefix convention                         |

**Gate Status**: ✅ PASSED - No violations, proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-pages-json-editor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API, client-only)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── admin/                 # New admin components for this feature
│   │   ├── AdminLogin.tsx     # Password authentication
│   │   ├── PagesEditor.tsx    # Main editor container
│   │   ├── PageList.tsx       # Left panel page navigation
│   │   ├── PageForm.tsx       # Page content edit form
│   │   ├── GalleryEditor.tsx  # Gallery items management
│   │   ├── ShopEditor.tsx     # Shop items management
│   │   └── ImageField.tsx     # Image path input with preview
│   ├── Cart.tsx
│   ├── Contact.tsx
│   ├── Menu.tsx
│   ├── ResponsivePage.tsx
│   ├── ShoppingCartWithBadge.tsx
│   └── TinyMCE.tsx
├── model/
│   ├── IPage.ts               # Existing - extends if needed
│   ├── IGalleryItem.ts        # Existing
│   ├── IShopItem.ts           # Existing
│   ├── IImage.ts              # Existing
│   └── IEditorState.ts        # New - editor state interface
├── services/
│   ├── pageService.ts         # Existing - extend for JSON export
│   └── editorService.ts       # New - editor operations
└── utils/
    └── styles.ts              # Existing

tests/
└── components/
    └── admin/                 # New tests for admin components
```

**Structure Decision**: Extend existing web frontend structure. New admin components placed in `src/components/admin/` subdirectory to separate admin functionality from public site components.

## Complexity Tracking

> No constitution violations identified. All design choices align with established patterns.
