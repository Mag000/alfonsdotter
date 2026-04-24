import { makeStyles } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { ICardSection, IInfoItem } from "../model/IPage";

const useStyles = makeStyles({
  section: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "76px",
    paddingBottom: "76px",
    width: "100%",
    boxSizing: "border-box",
  },
  wrapper: {
    display: "flex",
    alignItems: "stretch",
    position: "relative",
  },
  clip: {
    flex: "1",
    minWidth: "0",
    overflow: "hidden",
  },
  track: {
    display: "flex",
    transition: "transform 500ms ease",
  },
  cell: {
    flex: "0 0 20%",
    padding: "0 10px",
    boxSizing: "border-box",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgb(196,193,185)",
    borderRadius: "8px",
    overflow: "hidden",
    height: "100%",
  },
  cardImg: {
    display: "block",
    width: "100%",
    aspectRatio: "4 / 3",
    objectFit: "cover",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    padding: "16px",
    gap: "8px",
  },
  cardTitle: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1rem",
    fontWeight: "700",
    color: "#333",
    margin: "0",
  },
  cardTeaser: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.88rem",
    color: "#666",
    margin: "0",
    flexGrow: "1",
  },
  readMoreBtn: {
    alignSelf: "center",
    marginTop: "8px",
    background: "rgb(180,155,72)",
    border: "none",
    borderRadius: "24px",
    color: "rgb(233,230,220)",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.82rem",
    letterSpacing: "0.5px",
    padding: "6px 18px",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "rgb(160,138,60)",
      color: "rgb(233,230,220)",
    },
  },
  arrow: {
    background: "none",
    border: "1px solid #bbb",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#555",
    flexShrink: "0",
    alignSelf: "center",
    ":hover": {
      border: "1px solid #555",
    },
  },
  // Dialog overlay
  drawerOverlay: {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    boxSizing: "border-box",
  },
  drawer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    maxWidth: "860px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px 24px 16px",
    gap: "12px",
    borderBottom: "1px solid #e8e5de",
  },
  drawerTitle: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#333",
    margin: "0",
  },
  drawerClose: {
    background: "none",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    color: "#999",
    lineHeight: "1",
    padding: "0",
    flexShrink: "0",
    ":hover": { color: "#333" },
  },
  drawerContent: {
    display: "flex",
    flexDirection: "row",
    flex: "1",
    minHeight: "0",
    padding: "16px",
    gap: "24px",
    boxSizing: "border-box",
  },
  drawerImg: {
    display: "block",
    width: "45%",
    flexShrink: "0",
    objectFit: "cover",
    borderRadius: "8px",
  },
  drawerBody: {
    padding: "8px 8px 16px",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.95rem",
    color: "#444",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    overflowY: "auto",
    flex: "1",
  },
  drawerTeaser: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#555",
    marginBottom: "16px",
    lineHeight: "1.5",
  },
  drawerLeftCol: {
    display: "flex",
    flexDirection: "column",
    width: "45%",
    flexShrink: "0",
    gap: "12px",
  },
  infoItemCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  },
  infoItemCardImg: {
    display: "block",
    width: "48px",
    height: "48px",
    objectFit: "cover",
    borderRadius: "4px",
    flexShrink: "0",
  },
  infoItemCardText: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.78rem",
    color: "#555",
    lineHeight: "1.4",
    margin: "0",
  },
  infoItemDialogImg: {
    display: "block",
    width: "100%",
    height: "auto",
    borderRadius: "6px",
    objectFit: "cover",
  },
  infoItemDialogText: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    color: "#555",
    lineHeight: "1.5",
    margin: "0",
    whiteSpace: "pre-wrap",
  },
  infoItemDialog: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  },
});

function getSlice<T>(arr: T[], start: number, count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) result.push(arr[(start + i) % arr.length]);
  return result;
}

interface CardSectionProps {
  cardSection: ICardSection;
}

export const CardSection = ({ cardSection }: CardSectionProps) => {
  const styles = useStyles();
  const cards = cardSection.cards;
  const total = cards.length;

  const [visibleCount, setVisibleCount] = useState(3);
  const [start, setStart] = useState(0);
  const [sliding, setSliding] = useState<"idle" | "next" | "prev">("idle");
  const [drawerCard, setDrawerCard] = useState<(typeof cards)[0] | null>(null);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 480) setVisibleCount(1);
      else if (window.innerWidth < 768) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slice5 =
    total > 0 ? getSlice(cards, (start - 1 + total) % total, 5) : [];
  const offset =
    sliding === "next" ? "-40%" : sliding === "prev" ? "0%" : "-20%";

  const go = (dir: "prev" | "next") => {
    if (sliding !== "idle") return;
    setSliding(dir);
    setTimeout(() => {
      setStart((s) =>
        dir === "next" ? (s + 1) % total : (s - 1 + total) % total,
      );
      setSliding("idle");
    }, 510);
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.wrapper}>
          {total > visibleCount && (
            <button
              className={styles.arrow}
              onClick={() => go("prev")}
              aria-label="Föregående"
              style={{ marginRight: "16px" }}
            >
              &#8592;
            </button>
          )}

          <div className={styles.clip}>
            <div
              className={styles.track}
              style={{
                width: `calc(500% / ${visibleCount})`,
                transform: `translateX(${offset})`,
                transition:
                  sliding === "idle" ? "none" : "transform 500ms ease",
              }}
            >
              {slice5.map((card, i) => (
                <div key={i} className={styles.cell}>
                  <div className={styles.card}>
                    {card.image && (
                      <img
                        src={card.image.path}
                        alt={card.image.altText || card.title || ""}
                        className={styles.cardImg}
                      />
                    )}
                    <div className={styles.cardBody}>
                      {card.title && (
                        <p className={styles.cardTitle}>{card.title}</p>
                      )}
                      {card.infoSection?.items.map((item, j) => (
                        <div key={j} className={styles.infoItemCard}>
                          {item.image && (
                            <img
                              src={item.image.path}
                              alt={item.image.altText || ""}
                              className={styles.infoItemCardImg}
                            />
                          )}
                          {item.text && (
                            <p className={styles.infoItemCardText}>
                              {item.text}
                            </p>
                          )}
                        </div>
                      ))}
                      {card.teaser && (
                        <p className={styles.cardTeaser}>{card.teaser}</p>
                      )}
                      {card.longText && (
                        <button
                          className={styles.readMoreBtn}
                          onClick={() => setDrawerCard(card)}
                        >
                          Läs mer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {total > visibleCount && (
            <button
              className={styles.arrow}
              onClick={() => go("next")}
              aria-label="Nästa"
              style={{ marginLeft: "16px" }}
            >
              &#8594;
            </button>
          )}
        </div>
      </section>

      {/* ── Dialog ── */}
      {drawerCard && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setDrawerCard(null)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <p className={styles.drawerTitle}>{drawerCard.title}</p>
              <button
                className={styles.drawerClose}
                onClick={() => setDrawerCard(null)}
                aria-label="Stäng"
              >
                ✕
              </button>
            </div>
            <div className={styles.drawerContent}>
              {(drawerCard.image || drawerCard.infoSection?.items.length) && (
                <div className={styles.drawerLeftCol}>
                  {drawerCard.image && (
                    <img
                      src={drawerCard.image.path}
                      alt={drawerCard.image.altText || drawerCard.title || ""}
                      className={styles.drawerImg}
                    />
                  )}
                  {drawerCard.infoSection?.items.map(
                    (item: IInfoItem, j: number) => (
                      <div
                        key={j}
                        className={
                          item.image && item.text
                            ? styles.infoItemDialog
                            : undefined
                        }
                      >
                        {item.image && (
                          <img
                            src={item.image.path}
                            alt={item.image.altText || ""}
                            className={
                              item.text
                                ? styles.infoItemCardImg
                                : styles.infoItemDialogImg
                            }
                          />
                        )}
                        {item.text && (
                          <p className={styles.infoItemDialogText}>
                            {item.text}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
              <div className={styles.drawerBody}>
                {drawerCard.teaser && (
                  <p className={styles.drawerTeaser}>{drawerCard.teaser}</p>
                )}
                {drawerCard.longText}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
