import {
  Badge,
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderNavigation,
  DrawerHeaderTitle,
  Field,
  Input,
  OverlayDrawer,
  Spinner,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowLeft24Regular,
  Cart24Filled,
  Dismiss24Regular,
} from "@fluentui/react-icons";
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
    fontWeight: "400",
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
    borderTop: "2px solid #ccc",
  },
  totalLabel: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeight: "400",
    fontSize: "0.9rem",
    color: "#2e2e2e",
  },
  totalValue: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeight: "400",
    fontSize: "0.9rem",
    color: "#2e2e2e",
  },
  drawerBody: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: "16px",
    paddingBottom: "24px",
  },
  entryList: {
    flex: "1",
    overflowY: "auto",
  },
  checkoutBtn: {
    width: "100%",
    marginTop: tokens.spacingVerticalS,
  },
  checkoutForm: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    flex: "1",
  },
  orderSummaryTitle: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.75rem",
    fontWeight: "400",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#999",
    margin: "0 0 6px 0",
  },
  orderSummaryRow: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.82rem",
    color: "#555",
    margin: "0",
    lineHeight: "1.6",
  },
  errorMsg: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.82rem",
    color: "#c0392b",
    margin: "0",
  },
  successBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: "20px",
    textAlign: "center",
    paddingBottom: "32px",
  },
  successTitle: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1.2rem",
    fontWeight: "400",
    color: "#2e2e2e",
    margin: "0",
  },
  successText: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.9rem",
    color: "#555",
    margin: "0",
    lineHeight: "1.7",
  },
});

type View = "cart" | "checkout" | "success";

const ShoppingCartWithBadge = () => {
  const styles = useStyles();
  const { entries, itemCount, total, removeEntry, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [view, setView] = useState<View>("cart");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClose = () => {
    setCartOpen(false);
    if (view === "success") {
      clearCart();
    }
    setTimeout(() => {
      setView("cart");
      setName("");
      setEmail("");
      setErrorMsg(null);
    }, 300);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Namn och e-postadress är obligatoriska.");
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        items: entries.map((e) => ({
          title: e.variant?.title
            ? `${e.item.title} — ${e.variant.title}`
            : e.item.title,
          quantity: e.quantity,
          unitPrice: e.unitPrice,
        })),
        total: total,
      };
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.detail ?? "Något gick fel. Försök igen.");
      } else {
        setView("success");
      }
    } catch {
      setErrorMsg("Kunde inte ansluta till servern. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  };

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
        onOpenChange={(_, { open }) => {
          if (!open) handleClose();
        }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>
            {view === "checkout" ? "KASSA" : "VARUKORG"}
          </DrawerHeaderTitle>
          <DrawerHeaderNavigation>
            <Toolbar>
              <ToolbarGroup>
                {view === "checkout" && (
                  <ToolbarButton
                    aria-label="Tillbaka till varukorg"
                    appearance="subtle"
                    icon={<ArrowLeft24Regular />}
                    onClick={() => {
                      setView("cart");
                      setErrorMsg(null);
                    }}
                  />
                )}
                <ToolbarButton
                  aria-label="Stäng"
                  appearance="subtle"
                  icon={<Dismiss24Regular />}
                  onClick={handleClose}
                />
              </ToolbarGroup>
            </Toolbar>
          </DrawerHeaderNavigation>
        </DrawerHeader>

        <DrawerBody>
          {/* ── Cart view ── */}
          {view === "cart" && (
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
                        ? `${entry.unitPrice! * entry.quantity} kr`
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
                <>
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Totalt</span>
                    <span className={styles.totalValue}>
                      {total !== null ? `${total} kr` : "—"}
                    </span>
                  </div>
                  <Button
                    appearance="primary"
                    className={styles.checkoutBtn}
                    onClick={() => setView("checkout")}
                  >
                    Till kassan
                  </Button>
                </>
              )}
            </div>
          )}

          {/* ── Checkout view ── */}
          {view === "checkout" && (
            <div className={styles.drawerBody}>
              <div className={styles.checkoutForm}>
                <div>
                  <p className={styles.orderSummaryTitle}>Din beställning</p>
                  {entries.map((entry) => {
                    const t = entry.variant?.title
                      ? `${entry.item.title} — ${entry.variant.title}`
                      : entry.item.title;
                    const p =
                      entry.unitPrice !== null
                        ? `${entry.unitPrice! * entry.quantity} kr`
                        : "Kontakta för pris";
                    return (
                      <p key={entry.key} className={styles.orderSummaryRow}>
                        {t} ×{entry.quantity} — {p}
                      </p>
                    );
                  })}
                  <p className={styles.orderSummaryRow}>
                    <strong>
                      Totalt: {total !== null ? `${total} kr` : "—"}
                    </strong>
                  </p>
                </div>
                <Field label="Namn" required>
                  <Input
                    value={name}
                    onChange={(_, d) => setName(d.value)}
                    placeholder="Ditt namn"
                  />
                </Field>
                <Field label="E-postadress" required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(_, d) => setEmail(d.value)}
                    placeholder="din@epost.se"
                  />
                </Field>
                {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
              </div>
              <Button
                appearance="primary"
                className={styles.checkoutBtn}
                onClick={handleSubmit}
                disabled={submitting}
                icon={submitting ? <Spinner size="tiny" /> : undefined}
              >
                {submitting ? "Skickar…" : "Skicka beställning"}
              </Button>
            </div>
          )}

          {/* ── Success view ── */}
          {view === "success" && (
            <div className={styles.successBody}>
              <p className={styles.successTitle}>Tack för din beställning!</p>
              <p className={styles.successText}>
                Vi har tagit emot din beställning och återkommer till dig på{" "}
                <strong>{email}</strong> inom kort.
              </p>
              <Button appearance="primary" onClick={handleClose}>
                Stäng
              </Button>
            </div>
          )}
        </DrawerBody>
      </OverlayDrawer>
    </>
  );
};

export default ShoppingCartWithBadge;
