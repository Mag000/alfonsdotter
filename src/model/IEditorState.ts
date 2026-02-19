import { IPage } from "./IPage";

/**
 * Validation error or warning for a page field
 */
export interface IValidationError {
  /** Index of page with issue */
  pageIndex: number;
  /** Field path (e.g., "navTitle", "galleryItems[0].path") */
  field: string;
  /** Human-readable error message */
  message: string;
  /** Error prevents save, warning allows */
  severity: "error" | "warning";
}

/**
 * Authentication session stored in localStorage
 */
export interface IAdminSession {
  /** Whether session is valid */
  authenticated: boolean;
  /** Timestamp when session expires */
  expires: number;
}

/**
 * Undo/redo history management
 */
export interface IEditorHistory {
  /** Array of state snapshots */
  states: IPage[][];
  /** Current position in history */
  currentIndex: number;
  /** Maximum snapshots to retain (default: 50) */
  maxHistory: number;
}

/**
 * Overall editor application state
 */
export interface IEditorState {
  /** Current pages data being edited */
  pages: IPage[];
  /** Last saved/loaded state (for dirty checking) */
  savedPages: IPage[];
  /** Currently selected page in list */
  selectedPageIndex: number | null;
  /** Whether user has logged in */
  isAuthenticated: boolean;
  /** Derived from pages !== savedPages */
  hasUnsavedChanges: boolean;
  /** Current validation issues */
  validationErrors: IValidationError[];
}
