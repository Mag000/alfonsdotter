import { IAdminSession, IValidationError } from "../model/IEditorState";
import { IPage, IPagesData, ISiteSettings } from "../model/IPage";

/** Admin password - in production, use VITE_ADMIN_PASSWORD env var */
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

/** Session duration in milliseconds (1 hour) */
const SESSION_DURATION = 3600000;

/** Local storage key for admin session */
const SESSION_KEY = "admin-session";

/**
 * Parse JSON error to extract line and position information
 */
const parseJsonError = (error: SyntaxError, content: string): string => {
  const match = error.message.match(/position (\d+)/i);
  if (match) {
    const position = parseInt(match[1], 10);
    const lines = content.substring(0, position).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return `Invalid JSON at line ${line}, column ${column}: ${error.message}`;
  }
  return `Invalid JSON: ${error.message}`;
};

/**
 * Load pages.json from a File object
 */
export const loadJsonFile = (file: File): Promise<IPagesData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const json = JSON.parse(content);

        // Validate basic structure — support both legacy IPage[] and wrapped IPagesData
        let pagesData: IPagesData;
        if (Array.isArray(json)) {
          pagesData = { pages: json, siteSettings: {} };
        } else if (json && Array.isArray(json.pages)) {
          pagesData = {
            siteSettings: json.siteSettings ?? {},
            pages: json.pages,
          };
        } else {
          reject(
            new Error(
              "Invalid JSON: Expected an array of pages or a pages.json object",
            ),
          );
          return;
        }

        // Normalize line endings to \n
        pagesData.pages = normalizeLineEndings(pagesData.pages);

        resolve(pagesData);
      } catch (error) {
        if (error instanceof SyntaxError) {
          const content = (e.target?.result as string) || "";
          reject(new Error(parseJsonError(error, content)));
        } else {
          reject(error);
        }
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

/**
 * Normalize line endings to \n in all text fields
 */
const normalizeLineEndings = (pages: IPage[]): IPage[] => {
  return pages.map((page) => ({
    ...page,
    navSection: page.navSection
      ? {
          ...page.navSection,
          navText: page.navSection.navText?.replace(/\r\n/g, "\n"),
        }
      : undefined,
    contentSection: page.contentSection
      ? {
          ...page.contentSection,
          text: page.contentSection.text?.replace(/\r\n/g, "\n"),
          headline: page.contentSection.headline?.replace(/\r\n/g, "\n"),
        }
      : undefined,
  }));
};

/**
 * Download pages as JSON file
 */
export const downloadJson = (
  pagesData: IPagesData,
  filename: string = "pages.json",
): void => {
  const json = JSON.stringify(pagesData, null, "\t");
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

/**
 * Validate pages and return list of errors/warnings
 */
export const validatePages = (pages: IPage[]): IValidationError[] => {
  const errors: IValidationError[] = [];
  const navTitles = new Set<string>();

  pages.forEach((page, pageIndex) => {
    // V-001: navTitle must be non-empty
    if (!page.navSection?.navTitle || page.navSection.navTitle.trim() === "") {
      errors.push({
        pageIndex,
        field: "navTitle",
        message: "Navigation title is required",
        severity: "error",
      });
    } else {
      // V-002: navTitle must be unique
      if (navTitles.has(page.navSection.navTitle)) {
        errors.push({
          pageIndex,
          field: "navTitle",
          message: `Duplicate navigation title: ${page.navSection.navTitle}`,
          severity: "error",
        });
      }
      navTitles.add(page.navSection.navTitle);

      // V-003: navTitle should start with /
      if (!page.navSection.navTitle.startsWith("/")) {
        errors.push({
          pageIndex,
          field: "navTitle",
          message: "Navigation title should start with /",
          severity: "warning",
        });
      }
    }

    // Validate images
    if (page.navSection?.logoImage) {
      validateImage(page.navSection.logoImage, pageIndex, "logoImage", errors);
    }
    if (page.leadSection?.leadImage) {
      validateImage(page.leadSection.leadImage, pageIndex, "leadImage", errors);
    }

    // Validate gallery items
    page.contentSection?.galleryItems?.forEach((item, itemIndex) => {
      if (!item.path || item.path.trim() === "") {
        errors.push({
          pageIndex,
          field: `galleryItems[${itemIndex}].path`,
          message: "Gallery item path is required",
          severity: "error",
        });
      } else if (!item.path.startsWith("/img/")) {
        errors.push({
          pageIndex,
          field: `galleryItems[${itemIndex}].path`,
          message: "Path should start with /img/",
          severity: "warning",
        });
      }
    });

    // Validate shop items
    page.contentSection?.shopItems?.forEach((item, itemIndex) => {
      if (!item.path || item.path.trim() === "") {
        errors.push({
          pageIndex,
          field: `shopItems[${itemIndex}].path`,
          message: "Shop item path is required",
          severity: "error",
        });
      }

      // V-031: price must be positive or null
      if (item.price !== undefined && item.price !== null && item.price < 0) {
        errors.push({
          pageIndex,
          field: `shopItems[${itemIndex}].price`,
          message: "Price must be positive or empty",
          severity: "error",
        });
      }
    });
  });

  return errors;
};

/**
 * Validate an image field
 */
const validateImage = (
  image: { path?: string },
  pageIndex: number,
  field: string,
  errors: IValidationError[],
): void => {
  if (image.path && !image.path.startsWith("/img/")) {
    errors.push({
      pageIndex,
      field: `${field}.path`,
      message: "Image path should start with /img/",
      severity: "warning",
    });
  }
};

/**
 * Check if current session is authenticated
 */
export const isAuthenticated = (): boolean => {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return false;

    const session: IAdminSession = JSON.parse(sessionStr);
    return session.authenticated && session.expires > Date.now();
  } catch {
    return false;
  }
};

/**
 * Attempt to login with password
 */
export const login = (password: string): boolean => {
  if (password === ADMIN_PASSWORD) {
    const session: IAdminSession = {
      authenticated: true,
      expires: Date.now() + SESSION_DURATION,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
};

/**
 * Logout and clear session
 */
export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Deep compare two page arrays for equality
 */
export const pagesEqual = (a: IPage[], b: IPage[]): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const siteSettingsEqual = (
  a: ISiteSettings,
  b: ISiteSettings,
): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

/** Base path for the API. Same origin in production — .NET serves both SPA and API. */
const API_BASE = "/api";

/**
 * Build the URL for a function endpoint, appending the function key when set.
 * Set VITE_FUNCTIONS_KEY in .env.production for deployed environments.
 */
const functionUrl = (path: string): string => {
  const key = import.meta.env.VITE_FUNCTIONS_KEY;
  return key ? `${API_BASE}/${path}?code=${key}` : `${API_BASE}/${path}`;
};

/**
 * Deploy pages.json to the web host via SFTP through the Azure Function.
 * Throws on failure.
 */
export const deployPages = async (pagesData: IPagesData): Promise<void> => {
  const json = JSON.stringify(pagesData, null, "\t");

  const res = await fetch(functionUrl("deploy/pages"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (data as { error?: string }).error ?? `Deploy failed: ${res.status}`,
    );
  }
};

/**
 * Upload an image file to the web host via SFTP through the Azure Function.
 * @param file   The image file to upload.
 * @param folder Optional subdirectory under /img/ (e.g. "yoga").
 * @returns The public path of the uploaded image (e.g. "/img/yoga/photo.jpg").
 */
export const uploadImage = async (
  file: File,
  folder?: string,
): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);

  const res = await fetch(functionUrl("deploy/upload"), {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as {
    success: boolean;
    path?: string;
    error?: string;
  };

  if (!res.ok || !data.success) {
    throw new Error(data.error ?? `Upload failed: ${res.status}`);
  }

  return data.path!;
};
