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
  tokens,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Cart24Regular,
  Delete24Regular,
} from "@fluentui/react-icons";
import React, { useCallback, useState } from "react";
import { IShopItem } from "../../model/IShopItem";
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
    width: "60px",
    height: "60px",
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
  priceDisplay: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface IShopEditorProps {
  items: IShopItem[];
  onChange: (items: IShopItem[]) => void;
}

const createEmptyShopItem = (): IShopItem => ({
  path: "",
  title: "",
  price: undefined,
});

export const ShopEditor: React.FC<IShopEditorProps> = ({ items, onChange }) => {
  const styles = useStyles();
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Format price for display
  const formatPrice = (price?: number | null): string => {
    if (price === undefined || price === null) return "";
    return `${price.toFixed(2)} SEK`;
  };

  // Add new shop item
  const handleAdd = useCallback(() => {
    onChange([...items, createEmptyShopItem()]);
  }, [items, onChange]);

  // Update shop item
  const handleUpdate = useCallback(
    (index: number, updatedItem: IShopItem) => {
      const newItems = [...items];
      newItems[index] = updatedItem;
      onChange(newItems);
    },
    [items, onChange],
  );

  // Remove shop item
  const handleRemove = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
      setDeleteIndex(null);
    },
    [items, onChange],
  );

  // Handle price change
  const handlePriceChange = useCallback(
    (index: number, value: string) => {
      const item = items[index];
      const numericValue = value === "" ? undefined : parseFloat(value);
      handleUpdate(index, {
        ...item,
        price: isNaN(numericValue as number) ? undefined : numericValue,
      });
    },
    [items, handleUpdate],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text weight="semibold">Shop Items ({items.length})</Text>
        <Button
          icon={<Add24Regular />}
          appearance="primary"
          onClick={handleAdd}
        >
          Add Shop Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Text style={{ color: tokens.colorNeutralForeground3 }}>
          No shop items. Click "Add Shop Item" to create one.
        </Text>
      ) : (
        <Accordion collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionHeader>
                <div className={styles.itemHeader}>
                  <Cart24Regular />
                  <Text weight="semibold">
                    {item.title || item.path || `Item ${index + 1}`}
                  </Text>
                  {item.price !== undefined && item.price !== null && (
                    <Text size={200} className={styles.priceDisplay}>
                      {formatPrice(item.price)}
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
                      placeholder="/img/shop/..."
                    />
                  </Field>

                  <Field label="Title">
                    <Input
                      value={item.title || ""}
                      onChange={(e, data) =>
                        handleUpdate(index, { ...item, title: data.value })
                      }
                      placeholder="Product name"
                    />
                  </Field>

                  <Field label="Price (SEK)">
                    <Input
                      type="number"
                      value={
                        item.price !== undefined && item.price !== null
                          ? item.price.toString()
                          : ""
                      }
                      onChange={(e, data) =>
                        handlePriceChange(index, data.value)
                      }
                      placeholder="0.00"
                      min={0}
                      step={0.01}
                    />
                  </Field>

                  <Field label="Description" className={styles.fullWidth}>
                    <Input
                      value={item.description || ""}
                      onChange={(e, data) =>
                        handleUpdate(index, {
                          ...item,
                          description: data.value,
                        })
                      }
                      placeholder="Product description"
                    />
                  </Field>

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
                          <DialogTitle>Remove Shop Item?</DialogTitle>
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

export default ShopEditor;
