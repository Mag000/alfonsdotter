<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Initial constitution creation
- Added principles: TypeScript-First, FluentUI9 Components, React Best Practices, Component Architecture, Type Safety
- Templates requiring updates: ✅ aligned
- Follow-up TODOs: none
-->

# Alfonsdotter Constitution

## Core Principles

### I. TypeScript-First (NON-NEGOTIABLE)

All code MUST be written in TypeScript with strict mode enabled. Type definitions are required for:

- All component props using interfaces (prefix with `I`, e.g., `IPage`, `IMenu`)
- All function parameters and return types
- All state variables with explicit typing
- No use of `any` type except when absolutely necessary with documented justification

**Rationale**: Strong typing prevents runtime errors, improves IDE support, and serves as living documentation.

### II. FluentUI9 Component Library

UI components MUST use `@fluentui/react-components` (Fluent UI v9) as the primary component library:

- Use FluentUI9 tokens for consistent theming via `makeStyles` and `tokens`
- Prefer FluentUI9 components over custom implementations (Button, Input, Dialog, etc.)
- Apply `FluentProvider` at the application root with appropriate theme
- Use Griffel (`makeStyles`) for all custom styling - no inline styles except for dynamic values
- Follow FluentUI9 accessibility patterns (ARIA attributes, keyboard navigation)

**Rationale**: Ensures consistent Microsoft design language, built-in accessibility, and maintainable styling.

### III. React Best Practices

All React code MUST follow modern React patterns:

- Functional components only - no class components
- React hooks for state management (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`)
- Custom hooks for reusable logic (prefix with `use`)
- Proper dependency arrays in `useEffect` to prevent stale closures
- Cleanup functions for subscriptions, timers, and observers in `useEffect`
- React Router v6 for navigation (`useNavigate`, `useLocation`)

**Rationale**: Modern React patterns ensure better performance, testability, and maintainability.

### IV. Component Architecture

Components MUST follow a clear organizational structure:

- One component per file with matching filename (PascalCase)
- Separate model interfaces into `/model/` directory
- Separate services into `/services/` directory
- Shared utilities in `/utils/` directory
- Props interface defined and exported for each component
- Avoid prop drilling - use context or composition patterns for deep prop passing

**Rationale**: Clear separation of concerns enables easier testing, refactoring, and team collaboration.

### V. Type Safety & Interfaces

All data models MUST have corresponding TypeScript interfaces:

- Interface names MUST start with `I` prefix (e.g., `IPage`, `IGalleryItem`, `IImage`)
- Interfaces MUST be in dedicated files under `/model/` directory
- Optional properties use `?` syntax
- Arrays typed explicitly (e.g., `IPage[]` not `Array<IPage>`)
- Union types preferred over `any` for flexible typing

**Rationale**: Consistent interface patterns improve code discoverability and type inference.

## Technology Stack

The project uses the following core technologies:

- **React 18+**: Component framework with concurrent features
- **TypeScript 5+**: Strict mode enabled
- **FluentUI9** (`@fluentui/react-components`): UI component library
- **React Router v6**: Client-side routing
- **Griffel**: CSS-in-JS styling (via FluentUI9's `makeStyles`)

Development dependencies:

- Jest + React Testing Library for unit/integration tests
- ESLint with TypeScript rules
- Prettier for code formatting

## Development Workflow

### Code Quality Gates

1. All code MUST pass TypeScript compilation with no errors
2. All code MUST pass ESLint checks
3. New components SHOULD have accompanying test files
4. Props interfaces MUST be documented with JSDoc comments for complex props

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ResponsivePage.tsx`)
- Interfaces: `IPascalCase.ts` (e.g., `IPage.ts`)
- Services: `camelCase.ts` (e.g., `pageService.ts`)
- Utilities: `camelCase.ts` (e.g., `styles.ts`)
- Tests: `*.test.tsx` or `*.test.ts`

## Governance

This constitution supersedes all other development practices for this project. Amendments require:

1. Documentation of the change rationale
2. Version increment (MAJOR for breaking changes, MINOR for additions, PATCH for clarifications)
3. Update of Last Amended date

All code reviews MUST verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-02-18 | **Last Amended**: 2026-02-18
