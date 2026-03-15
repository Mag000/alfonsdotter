import {
  Badge,
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderNavigation,
  DrawerHeaderTitle,
  OverlayDrawer,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { Cart24Filled, Dismiss24Regular } from "@fluentui/react-icons";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const useStyles = makeStyles({
  iconWrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    transform: "translate(50%, -50%)",
  },
  cartBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#999",
    display: "flex",
    alignItems: "center",
    ":hover": {
      color: "#333",
    },
  },
  entryRow: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    alignItems: "flex-start",
    paddingBlock: "10px",
    borderBottom: "1px solid #eee",
  },
  entryThumb: {
    width: "48px",
    height: "48px",
    objectFit: "cover",
    flexShrink: "0",
    display: "block",
  },
  entryInfo: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  entryTitle: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#2e2e2e",
    margin: "0",
  },
  entryMeta: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.8rem",
    color: "#777",
    margin: "0",
  },
  removeBtn: {
    alignSelf: "center",
  },
  emptyMsg: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.9rem",
    color: "#999",
    marginTop: tokens.spacingVerticalXXL,
    textAlign: "center",
  },
  totalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    marginTop: "auto",
    borderTop: "2px solid #ccc",
  },
  totalLabel: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeight: "700",
    fontSize: "0.9rem",
    color: "#2e2e2e",
  },
  totalValue: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeight: "700",
    fontSize: "0.9rem",
    color: "#2e2e2e",
  },
  drawerBody: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  entryList: {
    flex: "1",
    overflowY: "auto",
  },
});

const ShoppingCartWithBadge = () => {
  const styles = useStyles();
  const { entries, itemCount, total, removeEntry } = useCart();
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className={styles.cartBtn}
        onClick={() => setCartOpen(true)}
        aria-label={`Öppna varukorg, ${itemCount} artiklar`}
      >
        <div className={styles.iconWrapper}>
          <Cart24Filled style={{ fontSize: 24 }} />
          {itemCount > 0 && (
            <span className={styles.badge}>
              <Badge appearance="filled" size="small">
                {itemCount}
              </Badge>
            </span>
          )}
        </div>
      </button>

      <OverlayDrawer
        position="end"
        open={cartOpen}
        onOpenChange={(_, { open }) => setCartOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>VARUKORG</DrawerHeaderTitle>
          <DrawerHeaderNavigation>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarButton
                  aria-label="Stäng"
                  appearance="subtle"
                  icon={<Dismiss24Regular />}
                  onClick={() => setCartOpen(false)}
                />
              </ToolbarGroup>
            </Toolbar>
          </DrawerHeaderNavigation>
        </DrawerHeader>

        <DrawerBody>
          <div className={styles.drawerBody}>
            <div className={styles.entryList}>
              {entries.length === 0 ? (
                <p className={styles.emptyMsg}>Varukorgen är tom</p>
              ) : (
                entries.map((entry) => {
                  const displayTitle = entry.variant?.title
                    ? `${entry.item.title} — ${entry.variant.title}`
                    : entry.item.title;
                  const linePrice =
                    entry.unitPrice !== null
                      ? `${entry.unitPrice * entry.quantity} kr`
                      : "Kontakta för pris";
                  return (
                    <div key={entry.key} className={styles.entryRow}>
                      <img
                        src={entry.item.path}
                        alt={entry.item.title ?? ""}
                        className={styles.entryThumb}
                      />
                      <div className={styles.entryInfo}>
                        <p className={styles.entryTitle}>{displayTitle}</p>
                        <p className={styles.entryMeta}>
                          Antal: {entry.quantity} · {linePrice}
                        </p>
                      </div>
                      <Button
                        className={styles.removeBtn}
                        appearance="subtle"
                        size="small"
                        icon={<Dismiss24Regular />}
                        aria-label={`Ta bort ${displayTitle}`}
                        onClick={() => removeEntry(entry.key)}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {entries.length > 0 && (
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Totalt</span>
                <span className={styles.totalValue}>
                  {total !== null ? `${total} kr` : "—"}
                </span>
              </div>
            )}
          </div>
        </DrawerBody>
      </OverlayDrawer>
    </>
  );
};

export default ShoppingCartWithBadge;
