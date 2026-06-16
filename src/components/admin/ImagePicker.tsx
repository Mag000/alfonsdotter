import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Input,
  makeStyles,
  Spinner,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowUpload24Regular,
  Folder24Regular,
  Search24Regular,
} from "@fluentui/react-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { listImages, uploadImage } from "../../services/editorService";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const prefixImgPath = (path: string) =>
  path.startsWith("/img/") ? BASE + path : path;

const useStyles = makeStyles({
  container: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    alignItems: "flex-start",
  },
  inputWrapper: {
    flex: 1,
  },
  previewSmall: {
    width: "40px",
    height: "40px",
    objectFit: "cover",
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    minHeight: "400px",
  },
  searchBox: {
    marginBottom: tokens.spacingVerticalS,
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: tokens.spacingHorizontalS,
    maxHeight: "350px",
    overflowY: "auto",
    padding: tokens.spacingVerticalXS,
  },
  imageCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: tokens.spacingVerticalXS,
    cursor: "pointer",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid transparent`,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
    },
  },
  imageCardSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    border: `1px solid ${tokens.colorBrandStroke1}`,
  },
  thumbnail: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  imageName: {
    fontSize: tokens.fontSizeBase100,
    textAlign: "center",
    wordBreak: "break-word",
    marginTop: tokens.spacingVerticalXXS,
    maxWidth: "90px",
  },
  breadcrumb: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
    marginBottom: tokens.spacingVerticalS,
  },
  breadcrumbSep: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    userSelect: "none",
  },
  folderCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: tokens.spacingVerticalXS,
    cursor: "pointer",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid transparent`,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
    },
  },
});

interface IImagePickerProps {
  value: string;
  onChange: (path: string) => void;
  label?: string;
  placeholder?: string;
}

interface IFolderStructure {
  [folder: string]: string[];
}

export const ImagePicker: React.FC<IImagePickerProps> = ({
  value,
  onChange,
  placeholder = "/img/...",
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [ftpFolders, setFtpFolders] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle dialog open — fetch live image listing from server
  const handleOpen = useCallback(async () => {
    setPendingSelection(value || null);
    setSearchTerm("");
    setSelectedFolder("");
    setOpen(true);
    setLoadingImages(true);
    try {
      const data = await listImages();
      setImages(data.images);
      setFtpFolders(data.folders);
    } catch {
      // keep whatever was loaded before
    } finally {
      setLoadingImages(false);
    }
  }, [value]);

  // Group images by their immediate folder path (full relative path, e.g. "angesback/sub")
  const folderStructure = useMemo((): IFolderStructure => {
    const structure: IFolderStructure = { "": [] };

    images.forEach((path) => {
      const parts = path.replace(/^.*\/img\//, "").split("/");
      const folderPath = parts.slice(0, -1).join("/");
      if (!structure[folderPath]) {
        structure[folderPath] = [];
      }
      structure[folderPath].push(path);
    });

    return structure;
  }, [images]);

  const folders = useMemo(
    () => Object.keys(folderStructure).filter((f) => f !== ""),
    [folderStructure],
  );

  // Immediate subfolders of the currently selected folder
  // Merges folders derived from file paths with real FTP directory listing.
  const subfolders = useMemo(() => {
    const match = (f: string) =>
      selectedFolder === ""
        ? !f.includes("/")
        : f.startsWith(selectedFolder + "/") &&
          !f.slice(selectedFolder.length + 1).includes("/");
    const fromFiles = folders.filter(match);
    const fromFtp = ftpFolders.filter(match);
    return [...new Set([...fromFiles, ...fromFtp])].sort();
  }, [folders, ftpFolders, selectedFolder]);

  // Filter images based on search and folder
  const filteredImages = useMemo(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return images.filter((path) => path.toLowerCase().includes(term));
    }
    return folderStructure[selectedFolder] ?? [];
  }, [images, selectedFolder, searchTerm, folderStructure]);

  // Get filename from path
  const getFilename = (path: string): string => {
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  // Handle selection
  const handleSelect = useCallback(() => {
    if (pendingSelection) {
      onChange(pendingSelection);
    }
    setOpen(false);
  }, [pendingSelection, onChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  // Handle file upload
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      setUploading(true);
      try {
        const folder =
          selectedFolder && selectedFolder !== "" ? selectedFolder : undefined;
        const path = await uploadImage(file, folder);
        setImages((prev) => (prev.includes(path) ? prev : [...prev, path]));
        setPendingSelection(path);
      } catch (err) {
        alert("Upload failed: " + (err instanceof Error ? err.message : err));
      } finally {
        setUploading(false);
      }
    },
    [selectedFolder],
  );

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Input
          value={value}
          onChange={(e, data) => onChange(data.value)}
          placeholder={placeholder}
          contentAfter={
            <Button
              appearance="subtle"
              size="small"
              icon={<Search24Regular />}
              onClick={handleOpen}
            />
          }
        />
      </div>

      {value && (
        <img
          src={prefixImgPath(value)}
          alt="Preview"
          className={styles.previewSmall}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogSurface style={{ maxWidth: "700px" }}>
          <DialogBody>
            <DialogTitle>Select Image</DialogTitle>
            <DialogContent className={styles.dialogContent}>
              {/* Search */}
              <Input
                className={styles.searchBox}
                value={searchTerm}
                onChange={(e, data) => setSearchTerm(data.value)}
                placeholder="Search images..."
                contentBefore={<Search24Regular />}
              />

              {/* Breadcrumb + Upload */}
              <div className={styles.breadcrumb}>
                <Button
                  appearance={selectedFolder === "" ? "primary" : "subtle"}
                  size="small"
                  icon={<Folder24Regular />}
                  onClick={() => setSelectedFolder("")}
                >
                  /img
                </Button>
                {selectedFolder !== "" &&
                  selectedFolder.split("/").map((seg, i, parts) => {
                    const path = parts.slice(0, i + 1).join("/");
                    return (
                      <React.Fragment key={path}>
                        <span className={styles.breadcrumbSep}>/</span>
                        <Button
                          appearance={
                            i === parts.length - 1 ? "primary" : "subtle"
                          }
                          size="small"
                          onClick={() => setSelectedFolder(path)}
                        >
                          {seg}
                        </Button>
                      </React.Fragment>
                    );
                  })}
                <Button
                  appearance="subtle"
                  size="small"
                  icon={
                    uploading ? (
                      <Spinner size="tiny" />
                    ) : (
                      <ArrowUpload24Regular />
                    )
                  }
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ marginLeft: "auto" }}
                >
                  {uploading ? "Uploading…" : "Upload image"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {/* Image grid */}
              <div className={styles.imageGrid}>
                {loadingImages ? (
                  <Spinner size="small" label="Loading images…" />
                ) : (
                  <>
                    {/* Subfolder cards */}
                    {!searchTerm &&
                      subfolders.map((folder) => (
                        <div
                          key={folder}
                          className={styles.folderCard}
                          onClick={() => setSelectedFolder(folder)}
                        >
                          <Folder24Regular
                            style={{
                              width: "48px",
                              height: "48px",
                              color: tokens.colorBrandBackground,
                            }}
                          />
                          <Text className={styles.imageName}>
                            {folder.split("/").at(-1)}
                          </Text>
                        </div>
                      ))}
                    {/* Image cards */}
                    {filteredImages.map((path) => (
                      <div
                        key={path}
                        className={`${styles.imageCard} ${
                          pendingSelection === path
                            ? styles.imageCardSelected
                            : ""
                        }`}
                        onClick={() => setPendingSelection(path)}
                        onDoubleClick={() => {
                          onChange(path);
                          setOpen(false);
                        }}
                      >
                        <img
                          src={prefixImgPath(path)}
                          alt={getFilename(path)}
                          className={styles.thumbnail}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiLz48L3N2Zz4=";
                          }}
                        />
                        <Text className={styles.imageName}>
                          {getFilename(path)}
                        </Text>
                      </div>
                    ))}
                    {/* Empty state */}
                    {!searchTerm &&
                      subfolders.length === 0 &&
                      filteredImages.length === 0 && (
                        <Text style={{ color: tokens.colorNeutralForeground3 }}>
                          No images in this folder
                        </Text>
                      )}
                    {searchTerm && filteredImages.length === 0 && (
                      <Text style={{ color: tokens.colorNeutralForeground3 }}>
                        No images found
                      </Text>
                    )}
                  </>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              {value && (
                <Button appearance="subtle" onClick={handleClear}>
                  Clear
                </Button>
              )}
              <Button appearance="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={handleSelect}
                disabled={!pendingSelection}
              >
                Select
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default ImagePicker;
