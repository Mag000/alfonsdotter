import { Button, makeStyles, tokens } from "@fluentui/react-components";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { IShopItem } from "../model/IShopItem";

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
    gap: "20px",
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
    gap: "10px",
    backgroundColor: "#fff",
    padding: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  image: {
    display: "block",
    width: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
  },
  title: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.9rem",
    fontWeight: "600",
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
  variantSelect: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    padding: "6px 8px",
    border: "1px solid #ccc",
    backgroundColor: "#fafafa",
    color: "#2e2e2e",
    width: "100%",
    cursor: "pointer",
  },
  addBtn: {
    marginTop: tokens.spacingVerticalXS,
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

interface ShopCardProps {
  item: IShopItem;
}

const ShopCard = ({ item }: ShopCardProps) => {
  const styles = useStyles();
  const { addToCart } = useCart();
  const [selectedVariantPath, setSelectedVariantPath] = useState<string>("");

  const hasVariants = (item.variants ?? []).length > 0;
  const selectedVariant = hasVariants
    ? (item.variants ?? []).find((v) => v.path === selectedVariantPath)
    : undefined;

  const canAdd = !hasVariants || !!selectedVariant;

  const displayItem = selectedVariant ?? item;
  const priceInfo = formatPrice(displayItem.price);

  const handleAdd = () => {
    addToCart(item, selectedVariant);
    setSelectedVariantPath("");
  };

  return (
    <div className={styles.card}>
      <img src={item.path} alt={item.title ?? ""} className={styles.image} />
      <p className={styles.title}>{item.title}</p>
      <p className={priceInfo.muted ? styles.priceMuted : styles.price}>
        {priceInfo.text}
      </p>
      {hasVariants && (
        <select
          className={styles.variantSelect}
          value={selectedVariantPath}
          onChange={(e) => setSelectedVariantPath(e.target.value)}
          aria-label={`Välj variant för ${item.title}`}
        >
          <option value="">Välj variant…</option>
          {(item.variants ?? []).map((v) => (
            <option key={v.path} value={v.path}>
              {v.title}
              {v.price !== null && v.price !== undefined
                ? ` — ${v.price} kr`
                : ""}
            </option>
          ))}
        </select>
      )}
      <Button
        appearance="primary"
        className={styles.addBtn}
        disabled={!canAdd}
        onClick={handleAdd}
      >
        Lägg i varukorg
      </Button>
    </div>
  );
};

interface ShopGridProps {
  items: IShopItem[];
}

const ShopGrid = ({ items }: ShopGridProps) => {
  const styles = useStyles();
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {items.map((item) => (
          <ShopCard key={item.path} item={item} />
        ))}
      </div>
    </section>
  );
};

export default ShopGrid;
