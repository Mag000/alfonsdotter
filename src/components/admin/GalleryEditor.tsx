import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  makeStyles,
  Text,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Delete24Regular,
  Image24Regular,
} from "@fluentui/react-icons";
import React, { useCallback, useState } from "react";
import { IGalleryItem } from "../../model/IGalleryItem";
import { ImagePicker } from "./ImagePicker";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacingVerticalS,
  },
  itemCard: {
    marginBottom: tokens.spacingVerticalS,
  },
  itemHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  itemFields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  imagePreview: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    justifyContent: "flex-end",
    marginTop: tokens.spacingVerticalS,
  },
  variantsSection: {
    marginTop: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  variantItem: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "end",
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: tokens.spacingVerticalXS,
  },
});

interface IGalleryEditorProps {
  items: IGalleryItem[];
  onChange: (items: IGalleryItem[]) => void;
}

const createEmptyGalleryItem = (): IGalleryItem => ({
  path: "",
  title: "",
  description: "",
  tagLine: "",
  variants: [],
});

const createEmptyVariant = (): IGalleryItem => ({
  path: "",
  title: "",
});

export const GalleryEditor: React.FC<IGalleryEditorProps> = ({
  items,
  onChange,
}) => {
  const styles = useStyles();
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Add new gallery item
  const handleAdd = useCallback(() => {
    onChange([...items, createEmptyGalleryItem()]);
  }, [items, onChange]);

  // Update gallery item
  const handleUpdate = useCallback(
    (index: number, updatedItem: IGalleryItem) => {
      const newItems = [...items];
      newItems[index] = updatedItem;
      onChange(newItems);
    },
    [items, onChange],
  );

  // Remove gallery item
  const handleRemove = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
      setDeleteIndex(null);
    },
    [items, onChange],
  );

  // Add variant to item
  const handleAddVariant = useCallback(
    (itemIndex: number) => {
      const item = items[itemIndex];
      const newVariants = [...(item.variants || []), createEmptyVariant()];
      handleUpdate(itemIndex, { ...item, variants: newVariants });
    },
    [items, handleUpdate],
  );

  // Update variant
  const handleUpdateVariant = useCallback(
    (
      itemIndex: number,
      variantIndex: number,
      field: keyof IGalleryItem,
      value: string,
    ) => {
      const item = items[itemIndex];
      const newVariants = [...(item.variants || [])];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        [field]: value,
      };
      handleUpdate(itemIndex, { ...item, variants: newVariants });
    },
    [items, handleUpdate],
  );

  // Remove variant
  const handleRemoveVariant = useCallback(
    (itemIndex: number, variantIndex: number) => {
      const item = items[itemIndex];
      const newVariants = (item.variants || []).filter(
        (_, i) => i !== variantIndex,
      );
      handleUpdate(itemIndex, { ...item, variants: newVariants });
    },
    [items, handleUpdate],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text weight="semibold">Gallery Items ({items.length})</Text>
        <Button
          icon={<Add24Regular />}
          appearance="primary"
          onClick={handleAdd}
        >
          Add Gallery Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Text style={{ color: tokens.colorNeutralForeground3 }}>
          No gallery items. Click "Add Gallery Item" to create one.
        </Text>
      ) : (
        <Accordion collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionHeader>
                <div className={styles.itemHeader}>
                  <Image24Regular />
                  <Text weight="semibold">
                    {item.title || item.path || `Item ${index + 1}`}
                  </Text>
                  {item.variants && item.variants.length > 0 && (
                    <Text
                      size={200}
                      style={{ color: tokens.colorNeutralForeground3 }}
                    >
                      ({item.variants.length} variant
                      {item.variants.length !== 1 ? "s" : ""})
                    </Text>
                  )}
                </div>
              </AccordionHeader>
              <AccordionPanel>
                <div className={styles.itemFields}>
                  {/* Image preview */}
                  {item.path && (
                    <div className={styles.fullWidth}>
                      <img
                        src={item.path}
                        alt={item.title || "Preview"}
                        className={styles.imagePreview}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <Field label="Image Path" required>
                    <ImagePicker
                      value={item.path || ""}
                      onChange={(value) =>
                        handleUpdate(index, { ...item, path: value })
                      }
                      placeholder="/img/gallery/..."
                    />
                  </Field>

                  <Field label="Title">
                    <Input
                      value={item.title || ""}
                      onChange={(e, data) =>
                        handleUpdate(index, { ...item, title: data.value })
                      }
                      placeholder="Artwork title"
                    />
                  </Field>

                  <Field label="Tag Line">
                    <Input
                      value={item.tagLine || ""}
                      onChange={(e, data) =>
                        handleUpdate(index, { ...item, tagLine: data.value })
                      }
                      placeholder="Short description"
                    />
                  </Field>

                  <Field label="Description" className={styles.fullWidth}>
                    <Textarea
                      value={item.description || ""}
                      onChange={(e, data) =>
                        handleUpdate(index, {
                          ...item,
                          description: data.value,
                        })
                      }
                      placeholder="Detailed description"
                      resize="vertical"
                      rows={3}
                    />
                  </Field>

                  {/* Variants section */}
                  <div
                    className={`${styles.fullWidth} ${styles.variantsSection}`}
                  >
                    <div className={styles.header}>
                      <Text weight="semibold" size={300}>
                        Variants ({item.variants?.length || 0})
                      </Text>
                      <Button
                        size="small"
                        icon={<Add24Regular />}
                        onClick={() => handleAddVariant(index)}
                      >
                        Add Variant
                      </Button>
                    </div>

                    {item.variants &&
                      item.variants.map((variant, variantIndex) => (
                        <div key={variantIndex} className={styles.variantItem}>
                          <Field label="Path">
                            <ImagePicker
                              value={variant.path || ""}
                              onChange={(value) =>
                                handleUpdateVariant(
                                  index,
                                  variantIndex,
                                  "path",
                                  value,
                                )
                              }
                              placeholder="/img/..."
                            />
                          </Field>
                          <Field label="Title">
                            <Input
                              size="small"
                              value={variant.title || ""}
                              onChange={(e, data) =>
                                handleUpdateVariant(
                                  index,
                                  variantIndex,
                                  "title",
                                  data.value,
                                )
                              }
                              placeholder="Variant title"
                            />
                          </Field>
                          <Button
                            size="small"
                            icon={<Delete24Regular />}
                            appearance="subtle"
                            onClick={() =>
                              handleRemoveVariant(index, variantIndex)
                            }
                          />
                        </div>
                      ))}
                  </div>

                  {/* Actions */}
                  <div className={`${styles.fullWidth} ${styles.actions}`}>
                    <Dialog
                      open={deleteIndex === index}
                      onOpenChange={(_, data) =>
                        !data.open && setDeleteIndex(null)
                      }
                    >
                      <DialogTrigger disableButtonEnhancement>
                        <Button
                          icon={<Delete24Regular />}
                          appearance="subtle"
                          onClick={() => setDeleteIndex(index)}
                        >
                          Remove
                        </Button>
                      </DialogTrigger>
                      <DialogSurface>
                        <DialogBody>
                          <DialogTitle>Remove Gallery Item?</DialogTitle>
                          <DialogContent>
                            Are you sure you want to remove "
                            {item.title || item.path || `Item ${index + 1}`}"?
                            This action cannot be undone.
                          </DialogContent>
                          <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                              <Button appearance="secondary">Cancel</Button>
                            </DialogTrigger>
                            <Button
                              appearance="primary"
                              onClick={() => handleRemove(index)}
                            >
                              Remove
                            </Button>
                          </DialogActions>
                        </DialogBody>
                      </DialogSurface>
                    </Dialog>
                  </div>
                </div>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default GalleryEditor;
