import {
  Badge,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderNavigation,
  DrawerHeaderTitle,
  OverlayDrawer,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from "@fluentui/react-components";
import {
  ArrowClockwise24Regular,
  Cart24Filled,
  Dismiss24Regular,
  Settings24Regular,
} from "@fluentui/react-icons";
import { forwardRef, useState } from "react";

// Ensure Drawer content supports ref forwarding
const CartContent = forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} {...props}>
    <DrawerBody>
      <div>This is a cart</div>
    </DrawerBody>
  </div>
));
CartContent.displayName = "CartContent";

const ShoppingCartWithBadge = ({ itemCount }: { itemCount: number }) => {
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Shopping Cart Icon */}
        <Cart24Filled
          style={{ fontSize: 40, cursor: "pointer" }}
          onClick={() => setCartOpen(!cartOpen)}
        />

        {itemCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              transform: "translate(50%, -50%)",
            }}
          >
            <Badge appearance="filled" size="small">
              {itemCount}
            </Badge>
          </span>
        )}
      </div>

      <OverlayDrawer
        position="end"
        open={cartOpen}
        onOpenChange={(_, { open }) => setCartOpen(!cartOpen)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>VARUKORG</DrawerHeaderTitle>

          <DrawerHeaderNavigation>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarButton
                  aria-label="Reload content"
                  appearance="subtle"
                  icon={<ArrowClockwise24Regular />}
                />
                <ToolbarButton
                  aria-label="Settings"
                  appearance="subtle"
                  icon={<Settings24Regular />}
                />
                <ToolbarButton
                  aria-label="Close panel"
                  appearance="subtle"
                  icon={<Dismiss24Regular />}
                  onClick={() => setCartOpen(false)}
                />
              </ToolbarGroup>
            </Toolbar>
          </DrawerHeaderNavigation>
        </DrawerHeader>
      </OverlayDrawer>
    </>
  );
};

export default ShoppingCartWithBadge;
