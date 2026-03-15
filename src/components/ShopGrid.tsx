import { Button, makeStyles, tokens } from "@fluentui/react-components";
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from "@fluentui/react-icons";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { IShopItem, IShopVariant } from "../model/IShopItem";

const useStyles = makeStyles({
  section: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "20px",
    paddingBottom: "64px",
    width: "100%",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "40px",
    [`@media (max-width: 900px)`]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    [`@media (max-width: 500px)`]: {
      gridTemplateColumns: "1fr",
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgb(196, 194, 187)",
    cursor: "pointer",
    overflow: "hidden",
  },
  imageWrap: {
    aspectRatio: "1 / 1",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "20px",
    paddingBottom: "20px",
    boxSizing: "border-box",
  },
  cardInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    backgroundColor: "rgb(235, 231, 221)",
    padding: "10px 0",
  },
  image: {
    display: "block",
    width: "80%",
    height: "auto",
    margin: "0 auto",
  },
  title: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1.15rem",
    fontWeight: "100",
    color: "#2e2e2e",
    margin: "0",
  },
  price: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    color: "#555",
    margin: "0",
  },
  priceMuted: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    color: "#999",
    fontStyle: "italic",
    margin: "0",
  },

  // ── Inline detail view ────────────────────────────────────────────────────
  detailView: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.8rem",
    color: "#888",
    marginBottom: "4px",
  },
  breadcrumbLink: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.8rem",
    color: "#888",
    padding: "0",
    textDecoration: "underline",
    ":hover": { color: "#2e2e2e" },
  },
  detailLayout: {
    display: "flex",
    flexDirection: "row",
    gap: "0",
    overflow: "visible",
    [`@media (max-width: 700px)`]: {
      flexDirection: "column",
    },
  },

  // ── Image pane (left) ─────────────────────────────────────────────────────
  detailImagePane: {
    flex: "0 0 auto",
    height: "65vh",
    width: "auto",
    position: "relative",
    backgroundColor: "rgb(196, 194, 187)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "1 / 1",
    paddingLeft: "48px",
    paddingRight: "48px",
    boxSizing: "border-box",
    [`@media (max-width: 700px)`]: {
      height: "auto",
      width: "100%",
    },
  },
  detailImg: {
    display: "block",
    maxWidth: "80%",
    maxHeight: "70vh",
    objectFit: "contain",
  },
  itemNavBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.20)",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    ":hover": { background: "rgba(0,0,0,0.40)" },
  },
  itemNavBtnInvisible: {
    visibility: "hidden",
    pointerEvents: "none",
  },
  itemNavPrev: {
    left: "8px",
  },
  itemNavNext: {
    right: "8px",
  },

  // ── Detail panel (right) ───────────────────────────────────────────────────
  detailPane: {
    width: "300px",
    flexShrink: "0",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px 24px 24px 24px",
    backgroundColor: "rgb(235, 231, 221)",
    [`@media (max-width: 700px)`]: {
      width: "100%",
      boxSizing: "border-box",
      padding: "20px 20px 24px 20px",
    },
  },
  detailTitle: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1.3rem",
    fontWeight: "400",
    color: "#2e2e2e",
    margin: "0",
  },
  detailDesc: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.9rem",
    lineHeight: "1.7",
    color: "#555",
    margin: "0",
    whiteSpace: "pre-wrap",
  },
  detailPrice: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.8rem",
    fontWeight: "400",
    color: "#555",
    margin: "0",
  },
  detailPriceMuted: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.8rem",
    color: "#999",
    fontStyle: "italic",
    margin: "0",
  },
  variantSelect: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.875rem",
    padding: "8px 10px",
    border: "1px solid #b0ada6",
    backgroundColor: "#fff",
    color: "#000",
    width: "100%",
    cursor: "pointer",
  },
  antalRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
    marginTop: tokens.spacingVerticalXS,
  },
  antalStepper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    border: "1px solid #b0ada6",
    backgroundColor: "#fff",
    flexShrink: "0",
  },
  antalStepBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1rem",
    color: "#000",
    width: "28px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": { backgroundColor: "rgba(0,0,0,0.06)" },
  },
  antalValue: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    color: "#2e2e2e",
    minWidth: "24px",
    textAlign: "center",
    userSelect: "none",
  },
  addBtn: {
    flex: "1",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: "999px",
    border: "none",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.8rem",
    fontWeight: "300",
    ":hover": {
      backgroundColor: "#333",
      color: "#fff",
    },
    ":active": {
      backgroundColor: "#000",
      color: "#fff",
    },
  },
  addedMsg: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    color: "#2e7d32",
    margin: "0",
    textAlign: "center",
  },
});

function formatPrice(price: number | null | undefined): {
  text: string;
  muted: boolean;
} {
  if (price === null || price === undefined) {
    return { text: "Kontakta för pris", muted: true };
  }
  return { text: `${price} kr`, muted: false };
}

// ── Inline detail view ─────────────────────────────────────────────────────

interface ShopDetailProps {
  item: IShopItem;
  onClose: () => void;
}

const ShopDetail = ({ item, onClose }: ShopDetailProps) => {
  const styles = useStyles();
  const { addToCart } = useCart();
  const subItems = item.subItems ?? [];
  const hasSubItems = subItems.length > 0;
  const variants: IShopVariant[] = item.variants ?? [];
  const hasVariants = variants.length > 0;
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(null);
  const [justAdded, setJustAdded] = useState(false);
  const [antal, setAntal] = useState(1);

  const allImages = [item.path, ...subItems.map((s) => s.path)];
  const currentImage = allImages[slideIndex];
  const selectedVariant =
    hasVariants && selectedVariantIndex !== null
      ? variants[selectedVariantIndex]
      : undefined;
  const displayPrice =
    selectedVariant?.price !== undefined ? selectedVariant.price : item.price;
  const priceInfo = formatPrice(displayPrice);

  const goSlide = (newIndex: number) => {
    setSlideIndex(newIndex);
    setJustAdded(false);
  };

  const handleAdd = () => {
    for (let i = 0; i < antal; i++) addToCart(item, selectedVariant as any);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className={styles.detailView}>
      <div className={styles.detailLayout}>
        {/* Left: image with subItems prev/next arrows */}
        <div className={styles.detailImagePane}>
          <img
            src={currentImage}
            alt={item.title ?? ""}
            className={styles.detailImg}
          />
          {hasSubItems && (
            <>
              <button
                className={`${styles.itemNavBtn} ${styles.itemNavPrev}`}
                onClick={() =>
                  goSlide(
                    (slideIndex - 1 + allImages.length) % allImages.length,
                  )
                }
                aria-label="Föregående"
              >
                <ChevronLeft24Regular />
              </button>
              <button
                className={`${styles.itemNavBtn} ${styles.itemNavNext}`}
                onClick={() => goSlide((slideIndex + 1) % allImages.length)}
                aria-label="Nästa"
              >
                <ChevronRight24Regular />
              </button>
            </>
          )}
        </div>

        {/* Right: detail panel */}
        <div className={styles.detailPane}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <button className={styles.breadcrumbLink} onClick={onClose}>
              Shop
            </button>
            <span>›</span>
            <span>{item.title}</span>
          </div>
          <p className={styles.detailTitle}>{item.title}</p>
          <p
            className={
              priceInfo.muted ? styles.detailPriceMuted : styles.detailPrice
            }
          >
            {priceInfo.text}
          </p>
          {hasVariants && (
            <select
              className={styles.variantSelect}
              value={selectedVariantIndex ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedVariantIndex(v === "" ? null : Number(v));
                setJustAdded(false);
              }}
              aria-label={`Välj variant för ${item.title}`}
            >
              <option value="">Välj variant…</option>
              {variants.map((v, i) => (
                <option key={i} value={i}>
                  {v.title}
                  {v.price !== null && v.price !== undefined
                    ? ` — ${v.price} kr`
                    : ""}
                </option>
              ))}
            </select>
          )}
          {item.description && (
            <p className={styles.detailDesc}>{item.description}</p>
          )}
          <div className={styles.antalRow}>
            <div className={styles.antalStepper}>
              <button
                className={styles.antalStepBtn}
                onClick={() => setAntal((n) => Math.max(1, n - 1))}
                aria-label="Minska antal"
              >
                −
              </button>
              <span className={styles.antalValue}>{antal}</span>
              <button
                className={styles.antalStepBtn}
                onClick={() => setAntal((n) => n + 1)}
                aria-label="Öka antal"
              >
                +
              </button>
            </div>
            <Button
              appearance="subtle"
              className={styles.addBtn}
              onClick={handleAdd}
            >
              Lägg i varukorg
            </Button>
          </div>
          {justAdded && (
            <p className={styles.addedMsg}>Tillagd i varukorgen ✓</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Slim card ──────────────────────────────────────────────────────────────

interface ShopCardProps {
  item: IShopItem;
  onClick: () => void;
}

const ShopCard = ({ item, onClick }: ShopCardProps) => {
  const styles = useStyles();
  const priceInfo = formatPrice(item.price);

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-label={`Öppna ${item.title}`}
    >
      <div className={styles.imageWrap}>
        <img src={item.path} alt={item.title ?? ""} className={styles.image} />
      </div>
      <div className={styles.cardInfo}>
        <p className={styles.title}>{item.title}</p>
        <p className={priceInfo.muted ? styles.priceMuted : styles.price}>
          {priceInfo.text}
        </p>
      </div>
    </div>
  );
};

// ── Grid ──────────────────────────────────────────────────────────────────

interface ShopGridProps {
  items: IShopItem[];
}

const ShopGrid = ({ items }: ShopGridProps) => {
  const styles = useStyles();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.section}>
      {openIndex !== null ? (
        <ShopDetail
          item={items[openIndex]}
          onClose={() => setOpenIndex(null)}
        />
      ) : (
        <div className={styles.grid}>
          {items.map((item, i) => (
            <ShopCard
              key={item.path}
              item={item}
              onClick={() => setOpenIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ShopGrid;
