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
  ArrowDown24Regular,
  ArrowUp24Regular,
  Delete24Regular,
  Navigation24Regular,
} from "@fluentui/react-icons";
import React, { useCallback, useState } from "react";
import { IPage } from "../../model/IPage";

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
    flex: 1,
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
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    justifyContent: "space-between",
    marginTop: tokens.spacingVerticalS,
  },
  moveButtons: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
  },
});

interface IMenuEditorProps {
  items: IPage[];
  onChange: (items: IPage[]) => void;
}

const createEmptyMenuItem = (): IPage => ({
  navTitle: "",
  navText: "",
});

export const MenuEditor: React.FC<IMenuEditorProps> = ({ items, onChange }) => {
  const styles = useStyles();
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Add new menu item
  const handleAdd = useCallback(() => {
    onChange([...items, createEmptyMenuItem()]);
  }, [items, onChange]);

  // Update menu item
  const handleUpdate = useCallback(
    (index: number, updatedItem: IPage) => {
      const newItems = [...items];
      newItems[index] = updatedItem;
      onChange(newItems);
    },
    [items, onChange],
  );

  // Remove menu item
  const handleRemove = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
      setDeleteIndex(null);
    },
    [items, onChange],
  );

  // Move item up
  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [
        newItems[index],
        newItems[index - 1],
      ];
      onChange(newItems);
    },
    [items, onChange],
  );

  // Move item down
  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === items.length - 1) return;
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
      onChange(newItems);
    },
    [items, onChange],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text weight="semibold">Menu Items ({items.length})</Text>
        <Button
          icon={<Add24Regular />}
          appearance="primary"
          onClick={handleAdd}
        >
          Add Menu Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Text style={{ color: tokens.colorNeutralForeground3 }}>
          No menu items. Click "Add Menu Item" to create one.
        </Text>
      ) : (
        <Accordion collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionHeader>
                <div className={styles.itemHeader}>
                  <Navigation24Regular />
                  <Text weight="semibold">
                    {item.navText || item.navTitle || `Item ${index + 1}`}
                  </Text>
                  <Text
                    size={200}
                    style={{ color: tokens.colorNeutralForeground3 }}
                  >
                    {item.navTitle}
                  </Text>
                </div>
              </AccordionHeader>
              <AccordionPanel>
                <div className={styles.itemFields}>
                  <Field label="Navigation Route" required>
                    <Input
                      value={item.navTitle || ""}
                      onChange={(e, data) =>
                        handleUpdate(index, { ...item, navTitle: data.value })
                      }
                      placeholder="/path/to/page"
                    />
                  </Field>

                  <Field label="Display Text">
                    <Input
                      value={item.navText || ""}
                      onChange={(e, data) =>
                        handleUpdate(index, { ...item, navText: data.value })
                      }
                      placeholder="Menu text"
                    />
                  </Field>

                  {/* Actions */}
                  <div className={`${styles.fullWidth} ${styles.actions}`}>
                    <div className={styles.moveButtons}>
                      <Button
                        icon={<ArrowUp24Regular />}
                        appearance="subtle"
                        size="small"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                        title="Move up"
                      />
                      <Button
                        icon={<ArrowDown24Regular />}
                        appearance="subtle"
                        size="small"
                        disabled={index === items.length - 1}
                        onClick={() => handleMoveDown(index)}
                        title="Move down"
                      />
                    </div>

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
                          <DialogTitle>Remove Menu Item?</DialogTitle>
                          <DialogContent>
                            Are you sure you want to remove "
                            {item.navText ||
                              item.navTitle ||
                              `Item ${index + 1}`}
                            "? This action cannot be undone.
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

export default MenuEditor;
