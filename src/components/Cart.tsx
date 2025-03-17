import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerProps,
  Label,
  Radio,
  RadioGroup,
  ToggleButton,
  makeStyles,
  tokens,
  useId,
  useRestoreFocusSource,
  useRestoreFocusTarget,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import * as React from "react";

const useStyles = makeStyles({
  root: {
    border: "2px solid #ccc",
    overflow: "hidden",

    display: "flex",
    height: "480px",
    backgroundColor: "#fff",
  },

  content: {
    flex: "1",
    padding: "16px",

    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gridRowGap: tokens.spacingVerticalXXL,
    gridAutoRows: "max-content",
  },

  field: {
    display: "grid",
    gridRowGap: tokens.spacingVerticalS,
  },
});

type DrawerType = Required<DrawerProps>["type"];

export const CartComponent = () => {
  const styles = useStyles();
  const labelId = useId("type-label");

  const [isOpen, setIsOpen] = React.useState(false);
  const [type, setType] = React.useState<DrawerType>("overlay");

  // Overlay Drawer will handle focus by default, but inline Drawers need manual focus restoration attributes, if applicable
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const restoreFocusSourceAttributes = useRestoreFocusSource();

  return (
    <>
      <Drawer
        {...restoreFocusSourceAttributes}
        type={type}
        separator
        open={isOpen}
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsOpen(false)}
              />
            }
          >
            Default Drawer
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <p>Drawer content</p>
        </DrawerBody>
      </Drawer>

      <div className={styles.content}>
        {type === "inline" ? (
          <ToggleButton
            {...restoreFocusTargetAttributes}
            appearance="primary"
            onClick={() => setIsOpen(!isOpen)}
            checked={isOpen}
          >
            Toggle
          </ToggleButton>
        ) : (
          <Button
            {...restoreFocusTargetAttributes}
            appearance="primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            Open
          </Button>
        )}

        <div className={styles.field}>
          <Label id={labelId}>Type</Label>
          <RadioGroup
            value={type}
            onChange={(_, data) => setType(data.value as DrawerType)}
            aria-labelledby={labelId}
          >
            <Radio value="overlay" label="Overlay (Default)" />
            <Radio value="inline" label="Inline" />
          </RadioGroup>
        </div>
      </div>
    </>
  );
};
