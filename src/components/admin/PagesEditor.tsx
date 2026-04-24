import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  FluentProvider,
  makeStyles,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Text,
  tokens,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Tooltip,
  webLightTheme,
} from "@fluentui/react-components";
import {
  ArrowDownload24Regular,
  ArrowRedo24Regular,
  ArrowUndo24Regular,
  ArrowUpload24Regular,
  CloudArrowUp24Regular,
  SignOut24Regular,
} from "@fluentui/react-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";
import { IEditorHistory, IValidationError } from "../../model/IEditorState";
import { IPage, ISiteSettings } from "../../model/IPage";
import {
  deployPages,
  downloadJson,
  isAuthenticated,
  loadJsonFile,
  logout,
  pagesEqual,
  siteSettingsEqual,
  validatePages,
} from "../../services/editorService";
import { AdminLogin } from "./AdminLogin";
import { PageForm } from "./PageForm";
import { PageList } from "./PageList";
import { SiteSettingsForm } from "./SiteSettingsForm";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  toolbar: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
  },
  content: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    overflow: "auto",
    backgroundColor: tokens.colorNeutralBackground2,
    display: "flex",
    flexDirection: "column",
  },
  siteSettingsButton: {
    margin: tokens.spacingVerticalS,
    textAlign: "left",
    cursor: "pointer",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    border: "none",
    backgroundColor: "transparent",
    fontFamily: "inherit",
    fontSize: tokens.fontSizeBase300,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    width: "calc(100% - 16px)",
  },
  siteSettingsButtonSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  sidebarDivider: {
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    margin: `0 ${tokens.spacingHorizontalM}`,
  },
  main: {
    flex: 1,
    overflow: "auto",
    padding: tokens.spacingHorizontalL,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: tokens.spacingVerticalM,
    color: tokens.colorNeutralForeground3,
  },
  hiddenInput: {
    display: "none",
  },
  toolbarTitle: {
    marginRight: "auto",
    fontWeight: tokens.fontWeightSemibold,
  },
  messageBar: {
    margin: tokens.spacingVerticalS,
  },
});

const MAX_HISTORY = 50;

export const PagesEditor: React.FC = () => {
  const styles = useStyles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth state
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  // Data state
  const [pages, setPages] = useState<IPage[]>([]);
  const [savedPages, setSavedPages] = useState<IPage[]>([]);
  const [siteSettings, setSiteSettings] = useState<ISiteSettings>({});
  const [savedSiteSettings, setSavedSiteSettings] = useState<ISiteSettings>({});
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(
    null,
  );
  const [showSiteSettings, setShowSiteSettings] = useState(false);
  const [validationErrors, setValidationErrors] = useState<IValidationError[]>(
    [],
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<
    "idle" | "deploying" | "success" | "error"
  >("idle");
  const [deployError, setDeployError] = useState<string | null>(null);

  // History state for undo/redo
  const [history, setHistory] = useState<IEditorHistory>({
    states: [],
    currentIndex: -1,
    maxHistory: MAX_HISTORY,
  });

  // Computed state
  const hasUnsavedChanges =
    !pagesEqual(pages, savedPages) ||
    !siteSettingsEqual(siteSettings, savedSiteSettings);
  const canUndo = history.currentIndex > 0;
  const canRedo = history.currentIndex < history.states.length - 1;

  // Block navigation when there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
  );

  // Warn before leaving with unsaved changes
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

  // Auto-load pages.json on startup when authenticated
  useEffect(() => {
    if (!authenticated || pages.length > 0) return;

    fetch("/pages.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch pages.json");
        return res.json();
      })
      .then(
        (raw: { pages?: IPage[]; siteSettings?: ISiteSettings } | IPage[]) => {
          const loadedPages = Array.isArray(raw) ? raw : (raw.pages ?? []);
          const loadedSettings: ISiteSettings = Array.isArray(raw)
            ? {}
            : (raw.siteSettings ?? {});
          setPages(loadedPages);
          setSavedPages(JSON.parse(JSON.stringify(loadedPages)));
          setSiteSettings(loadedSettings);
          setSavedSiteSettings(JSON.parse(JSON.stringify(loadedSettings)));
          setSelectedPageIndex(loadedPages.length > 0 ? 0 : null);
          setValidationErrors(validatePages(loadedPages));
          setHistory({
            states: [JSON.parse(JSON.stringify(loadedPages))],
            currentIndex: 0,
            maxHistory: MAX_HISTORY,
          });
        },
      )
      .catch((error) => {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to auto-load pages.json",
        );
      });
  }, [authenticated, pages.length]);

  // Push state to history
  const pushHistory = useCallback((newPages: IPage[]) => {
    setHistory((h) => {
      // Truncate future history if we're not at the end
      const newStates = h.states.slice(0, h.currentIndex + 1);
      newStates.push(JSON.parse(JSON.stringify(newPages)));

      // Limit history size
      if (newStates.length > h.maxHistory) {
        newStates.shift();
      }

      return {
        ...h,
        states: newStates,
        currentIndex: newStates.length - 1,
      };
    });
  }, []);

  // Update pages with history tracking
  const updatePages = useCallback(
    (newPages: IPage[]) => {
      setPages(newPages);
      pushHistory(newPages);
      setValidationErrors(validatePages(newPages));
    },
    [pushHistory],
  );

  // Undo
  const handleUndo = useCallback(() => {
    if (history.currentIndex > 0) {
      const newIndex = history.currentIndex - 1;
      setHistory((h) => ({ ...h, currentIndex: newIndex }));
      setPages(JSON.parse(JSON.stringify(history.states[newIndex])));
    }
  }, [history]);

  // Redo
  const handleRedo = useCallback(() => {
    if (history.currentIndex < history.states.length - 1) {
      const newIndex = history.currentIndex + 1;
      setHistory((h) => ({ ...h, currentIndex: newIndex }));
      setPages(JSON.parse(JSON.stringify(history.states[newIndex])));
    }
  }, [history]);

  // Handle file load
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setLoadError(null);
        const pagesData = await loadJsonFile(file);
        setPages(pagesData.pages);
        setSavedPages(JSON.parse(JSON.stringify(pagesData.pages)));
        setSiteSettings(pagesData.siteSettings);
        setSavedSiteSettings(
          JSON.parse(JSON.stringify(pagesData.siteSettings)),
        );
        setSelectedPageIndex(pagesData.pages.length > 0 ? 0 : null);
        setValidationErrors(validatePages(pagesData.pages));
        setHistory({
          states: [JSON.parse(JSON.stringify(pagesData.pages))],
          currentIndex: 0,
          maxHistory: MAX_HISTORY,
        });
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Failed to load file",
        );
      }

      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [],
  );

  // Handle download
  const handleDownload = useCallback(() => {
    downloadJson({ pages, siteSettings });
    setSavedPages(JSON.parse(JSON.stringify(pages)));
    setSavedSiteSettings(JSON.parse(JSON.stringify(siteSettings)));
  }, [pages, siteSettings]);

  // Handle page update
  const handlePageUpdate = useCallback(
    (updatedPage: IPage) => {
      if (selectedPageIndex === null) return;

      const newPages = [...pages];
      newPages[selectedPageIndex] = updatedPage;
      updatePages(newPages);
    },
    [pages, selectedPageIndex, updatePages],
  );

  // Handle deploy via SFTP
  const handleDeploy = useCallback(async () => {
    setDeployStatus("deploying");
    setDeployError(null);
    try {
      await deployPages({ pages, siteSettings });
      setSavedPages(JSON.parse(JSON.stringify(pages)));
      setSavedSiteSettings(JSON.parse(JSON.stringify(siteSettings)));
      setDeployStatus("success");
      setTimeout(() => setDeployStatus("idle"), 4000);
    } catch (error) {
      setDeployError(error instanceof Error ? error.message : "Deploy failed");
      setDeployStatus("error");
    }
  }, [pages, siteSettings]);

  // Handle site settings update
  const handleSiteSettingsUpdate = useCallback((updated: ISiteSettings) => {
    setSiteSettings(updated);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    setAuthenticated(false);
  }, []);

  // Handle login success
  const handleLoginSuccess = useCallback(() => {
    setAuthenticated(true);
  }, []);

  // Show login if not authenticated
  if (!authenticated) {
    return (
      <FluentProvider theme={webLightTheme}>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </FluentProvider>
    );
  }

  const selectedPage =
    selectedPageIndex !== null ? pages[selectedPageIndex] : null;

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.root}>
        {/* Toolbar */}
        <Toolbar className={styles.toolbar}>
          <Text className={styles.toolbarTitle}>Pages Editor</Text>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className={styles.hiddenInput}
          />

          <Tooltip content="Load pages.json" relationship="label">
            <ToolbarButton
              icon={<ArrowUpload24Regular />}
              onClick={() => fileInputRef.current?.click()}
            >
              Load JSON
            </ToolbarButton>
          </Tooltip>

          <Tooltip content="Download pages.json" relationship="label">
            <ToolbarButton
              icon={<ArrowDownload24Regular />}
              onClick={handleDownload}
              disabled={pages.length === 0}
            >
              Download JSON
            </ToolbarButton>
          </Tooltip>

          <Tooltip content="Deploy pages.json via SFTP" relationship="label">
            <ToolbarButton
              icon={<CloudArrowUp24Regular />}
              onClick={handleDeploy}
              disabled={pages.length === 0 || deployStatus === "deploying"}
            >
              {deployStatus === "deploying" ? "Deploying…" : "Deploy"}
            </ToolbarButton>
          </Tooltip>

          <ToolbarDivider />

          <Tooltip content="Undo (Ctrl+Z)" relationship="label">
            <ToolbarButton
              icon={<ArrowUndo24Regular />}
              onClick={handleUndo}
              disabled={!canUndo}
            />
          </Tooltip>

          <Tooltip content="Redo (Ctrl+Y)" relationship="label">
            <ToolbarButton
              icon={<ArrowRedo24Regular />}
              onClick={handleRedo}
              disabled={!canRedo}
            />
          </Tooltip>

          <ToolbarDivider />

          {hasUnsavedChanges && (
            <Text
              size={200}
              style={{ color: tokens.colorPaletteYellowForeground1 }}
            >
              Unsaved changes
            </Text>
          )}

          <Tooltip content="Logout" relationship="label">
            <ToolbarButton icon={<SignOut24Regular />} onClick={handleLogout} />
          </Tooltip>
        </Toolbar>

        {/* Load error message */}
        {loadError && (
          <MessageBar intent="error" className={styles.messageBar}>
            <MessageBarBody>
              <MessageBarTitle>Load Error</MessageBarTitle>
              {loadError}
            </MessageBarBody>
          </MessageBar>
        )}

        {/* Deploy status messages */}
        {deployStatus === "success" && (
          <MessageBar intent="success" className={styles.messageBar}>
            <MessageBarBody>
              <MessageBarTitle>Deployed</MessageBarTitle>
              pages.json has been published to the server.
            </MessageBarBody>
          </MessageBar>
        )}
        {deployStatus === "error" && deployError && (
          <MessageBar intent="error" className={styles.messageBar}>
            <MessageBarBody>
              <MessageBarTitle>Deploy Failed</MessageBarTitle>
              {deployError}
            </MessageBarBody>
          </MessageBar>
        )}

        {/* Content */}
        <div className={styles.content}>
          {/* Sidebar - Page List + Site Settings */}
          <div className={styles.sidebar}>
            <PageList
              pages={pages}
              selectedIndex={showSiteSettings ? null : selectedPageIndex}
              onSelect={(i) => {
                setSelectedPageIndex(i);
                setShowSiteSettings(false);
              }}
              validationErrors={validationErrors}
            />
            <div className={styles.sidebarDivider} />
            <button
              className={`${styles.siteSettingsButton}${showSiteSettings ? ` ${styles.siteSettingsButtonSelected}` : ""}`}
              onClick={() => {
                setShowSiteSettings(true);
                setSelectedPageIndex(null);
              }}
            >
              ⚙ Site Settings
            </button>
          </div>

          {/* Main - Page Form or Site Settings */}
          <div className={styles.main}>
            {showSiteSettings ? (
              <SiteSettingsForm
                settings={siteSettings}
                onChange={handleSiteSettingsUpdate}
              />
            ) : selectedPage ? (
              <PageForm
                page={selectedPage}
                pageIndex={selectedPageIndex!}
                onChange={handlePageUpdate}
                validationErrors={validationErrors.filter(
                  (e) => e.pageIndex === selectedPageIndex,
                )}
              />
            ) : (
              <div className={styles.emptyState}>
                <ArrowUpload24Regular style={{ fontSize: "48px" }} />
                <Text size={400}>
                  {pages.length === 0
                    ? "Load a pages.json file to get started"
                    : "Select a page to edit"}
                </Text>
                {pages.length === 0 && (
                  <Button
                    appearance="primary"
                    icon={<ArrowUpload24Regular />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Load JSON
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Blocking Dialog */}
        <Dialog open={blocker.state === "blocked"}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Unsaved Changes</DialogTitle>
              <DialogContent>
                You have unsaved changes. Are you sure you want to leave this
                page? Your changes will be lost.
              </DialogContent>
              <DialogActions>
                <Button
                  appearance="secondary"
                  onClick={() => blocker.reset?.()}
                >
                  Stay on Page
                </Button>
                <Button
                  appearance="primary"
                  onClick={() => blocker.proceed?.()}
                >
                  Leave Page
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </FluentProvider>
  );
};

export default PagesEditor;
