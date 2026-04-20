import {
  Badge,
  Card,
  CardHeader,
  Divider,
  Field,
  Input,
  makeStyles,
  Text,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import {
  Document24Regular,
  ErrorCircle16Regular,
  Warning16Regular,
} from "@fluentui/react-icons";
import React, { useCallback } from "react";
import { IValidationError } from "../../model/IEditorState";
import { IGalleryItem } from "../../model/IGalleryItem";
import { IImage } from "../../model/IImage";
import {
  IContentSection,
  ILeadSection,
  INavSection,
  IPage,
} from "../../model/IPage";
import { IShopItem } from "../../model/IShopItem";
import { GalleryEditor } from "./GalleryEditor";
import { ImageField } from "./ImageField";
import { MenuEditor } from "./MenuEditor";
import { ShopEditor } from "./ShopEditor";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
    maxWidth: "800px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  sectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingHorizontalM,
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  validationErrors: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalM,
  },
  errorItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorPaletteRedBackground1,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
  },
  warningItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
  },
});

interface IPageFormProps {
  page: IPage;
  pageIndex: number;
  onChange: (updatedPage: IPage) => void;
  validationErrors: IValidationError[];
}

export const PageForm: React.FC<IPageFormProps> = ({
  page,
  pageIndex,
  onChange,
  validationErrors,
}) => {
  const styles = useStyles();

  // Get validation state for a specific field
  const getFieldValidation = (field: string) => {
    const error = validationErrors.find((e) => e.field === field);
    return error
      ? {
          validationState:
            error.severity === "error"
              ? ("error" as const)
              : ("warning" as const),
          validationMessage: error.message,
        }
      : {};
  };

  // Handle field change
  const handleChange = useCallback(
    <K extends keyof IPage>(field: K, value: IPage[K]) => {
      onChange({ ...page, [field]: value });
    },
    [page, onChange],
  );

  const handleNavChange = useCallback(
    <K extends keyof INavSection>(field: K, value: INavSection[K]) => {
      onChange({ ...page, navSection: { ...page.navSection, [field]: value } });
    },
    [page, onChange],
  );

  const handleLeadChange = useCallback(
    <K extends keyof ILeadSection>(field: K, value: ILeadSection[K]) => {
      onChange({
        ...page,
        leadSection: { ...(page.leadSection ?? {}), [field]: value },
      });
    },
    [page, onChange],
  );

  const handleContentChange = useCallback(
    <K extends keyof IContentSection>(field: K, value: IContentSection[K]) => {
      onChange({
        ...page,
        contentSection: { ...(page.contentSection ?? {}), [field]: value },
      });
    },
    [page, onChange],
  );

  // Separate errors and warnings
  const errors = validationErrors.filter((e) => e.severity === "error");
  const warnings = validationErrors.filter((e) => e.severity === "warning");

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card>
        <CardHeader
          header={
            <div className={styles.header}>
              <Document24Regular />
              <Text weight="semibold" size={500}>
                {page.navSection?.navText || page.navSection?.navTitle}
              </Text>
              {errors.length > 0 && (
                <Badge color="danger" size="small">
                  {errors.length} error{errors.length !== 1 ? "s" : ""}
                </Badge>
              )}
              {warnings.length > 0 && (
                <Badge color="warning" size="small">
                  {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          }
        />
      </Card>

      {/* Validation summary */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className={styles.validationErrors}>
          {errors.map((error, i) => (
            <div key={`error-${i}`} className={styles.errorItem}>
              <ErrorCircle16Regular />
              <Text>
                {error.field}: {error.message}
              </Text>
            </div>
          ))}
          {warnings.map((warning, i) => (
            <div key={`warning-${i}`} className={styles.warningItem}>
              <Warning16Regular />
              <Text>
                {warning.field}: {warning.message}
              </Text>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Section */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Navigation</Text>
        <div className={styles.fieldGroup}>
          <Field
            label="Navigation Title (Route)"
            required
            {...getFieldValidation("navTitle")}
          >
            <Input
              value={page.navSection?.navTitle || ""}
              onChange={(e, data) => handleNavChange("navTitle", data.value)}
              placeholder="/path/to/page"
            />
          </Field>

          <Field label="Navigation Text">
            <Input
              value={page.navSection?.navText || ""}
              onChange={(e, data) => handleNavChange("navText", data.value)}
              placeholder="Menu display text"
            />
          </Field>
        </div>
      </div>

      <Divider />

      {/* Content Section */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Content</Text>
        <div className={styles.fieldGroup}>
          <Field label="Headline" className={styles.fullWidth}>
            <Input
              value={page.contentSection?.headline || ""}
              onChange={(e, data) =>
                handleContentChange("headline", data.value)
              }
              placeholder="Page headline"
            />
          </Field>

          <Field label="Body Text" className={styles.fullWidth}>
            <Textarea
              value={page.contentSection?.text || ""}
              onChange={(e, data) => handleContentChange("text", data.value)}
              placeholder="Page content text. Press Enter for line breaks."
              resize="vertical"
              rows={10}
            />
          </Field>
        </div>
      </div>

      <Divider />

      {/* Images Section */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Images</Text>
        <ImageField
          label="Logo Image"
          image={page.navSection?.logoImage}
          onChange={(image: IImage | undefined) =>
            handleNavChange("logoImage", image)
          }
        />
        <ImageField
          label="Lead Image"
          image={page.leadSection?.leadImage}
          onChange={(image: IImage | undefined) =>
            handleLeadChange("leadImage", image)
          }
        />
      </div>

      {/* Gallery Section */}
      <>
        <Divider />
        <div className={styles.section}>
          <GalleryEditor
            items={page.contentSection?.galleryItems || []}
            onChange={(items: IGalleryItem[]) =>
              handleContentChange("galleryItems", items)
            }
          />
        </div>
      </>

      {/* Shop Section */}
      <>
        <Divider />
        <div className={styles.section}>
          <ShopEditor
            items={page.contentSection?.shopItems || []}
            onChange={(items: IShopItem[]) =>
              handleContentChange("shopItems", items)
            }
          />
        </div>
      </>

      {/* Menu Section */}
      <>
        <Divider />
        <div className={styles.section}>
          <MenuEditor
            items={page.menuItems || []}
            onChange={(items: IPage[]) => handleChange("menuItems", items)}
          />
        </div>
      </>
    </div>
  );
};

export default PageForm;
