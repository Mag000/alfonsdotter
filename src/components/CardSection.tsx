import { makeStyles } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { ICardSection } from "../model/IPage";

const useStyles = makeStyles({
  section: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "44px",
    paddingBottom: "44px",
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
  // Drawer overlay
  drawerOverlay: {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  drawer: {
    backgroundColor: "#fff",
    width: "100vw",
    height: "100vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px 24px 12px",
    gap: "12px",
  },
  drawerTitle: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "1.2rem",
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
    ":hover": { color: "#333" },
  },
  drawerImg: {
    display: "block",
    width: "100%",
    aspectRatio: "4 / 3",
    objectFit: "cover",
  },
  drawerBody: {
    padding: "20px 24px 32px",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.95rem",
    color: "#444",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
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

      {/* ── Drawer ── */}
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
            <div className={styles.drawerBody}>{drawerCard.longText}</div>
          </div>
        </div>
      )}
    </>
  );
};
