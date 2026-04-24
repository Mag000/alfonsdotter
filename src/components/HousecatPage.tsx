import { makeStyles } from "@fluentui/react-components";
import { Dismiss24Regular, Navigation24Regular } from "@fluentui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IGalleryItem } from "../model/IGalleryItem";
import { IPage, ISiteSettings, SectionType } from "../model/IPage";
import { pageService } from "../services/pageService";
import { testService } from "../services/testService";
import { CardSection } from "./CardSection";
import { InfoSection } from "./InfoSection";
import { MailForm } from "./MailForm";
import ShopGrid from "./ShopGrid";
import ShoppingCartWithBadge from "./ShoppingCartWithBadge";

const useStyles = makeStyles({
  root: {
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "rgb(235, 231, 221)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    paddingInline: "24px",
    paddingBlock: "24px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    [`@media (max-width: 480px)`]: {
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
  },
  logo: {
    maxWidth: "234px",
    height: "auto",
    cursor: "pointer",
    display: "block",
    flexShrink: "0",
    alignSelf: "center",
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    listStyle: "none",
    padding: "0",
    margin: "0",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "center",
    [`@media (max-width: 600px)`]: {
      gap: "20px",
    },
  },
  navItem: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.78rem",
    fontWeight: "400",
    letterSpacing: "0.5px",
    color: "#999",
    cursor: "pointer",
    transition: "color 0.2s",
    ":hover": {
      color: "#333",
    },
  },
  navItemActive: {
    color: "#333",
    fontWeight: "700",
    borderBottomColor: "transparent",
  },
  headerIcons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "16px",
    flexShrink: "0",
  },
  navRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "24px",
    [`@media (max-width: 768px)`]: {
      display: "none",
    },
  },
  headerIconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#999",
    ":hover": {
      color: "#333",
    },
  },
  navRule: {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    height: "1px",
    backgroundColor: "#e6e6e2",
    border: "none",
    margin: "0",
  },
  hamburgerBtn: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#555",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",
    [`@media (max-width: 768px)`]: {
      display: "flex",
    },
  },
  mobileMenuPanel: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    backgroundColor: "rgb(235, 231, 221)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    zIndex: "200",
    display: "flex",
    flexDirection: "column",
    paddingBlock: "16px",
    borderTop: "1px solid #e6e6e2",
  },
  mobileMenuItem: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    fontWeight: "400",
    letterSpacing: "0.5px",
    color: "#999",
    cursor: "pointer",
    paddingBlock: "14px",
    paddingInline: "24px",
    ":hover": {
      color: "#333",
    },
  },
  mobileMenuItemActive: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.85rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
    color: "#333",
    cursor: "pointer",
    paddingBlock: "14px",
    paddingInline: "24px",
    borderLeft: "2px solid #333",
  },

  // ── Hero image ────────────────────────────────────────────────────────────
  hero: {
    width: "100%",
    display: "block",
  },
  heroPlaceholder: {
    width: "100%",
    height: "320px",
    backgroundColor: "rgb(235, 231, 221)",
  },

  // ── Text content block ────────────────────────────────────────────────────
  contentBlock: {
    maxWidth: "760px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "76px",
    paddingBottom: "76px",
    width: "100%",
    boxSizing: "border-box",
  },
  contentBlockWide: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "76px",
    paddingBottom: "76px",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    alignItems: "flex-start",
    [`@media (max-width: 700px)`]: {
      flexDirection: "column",
      gap: "24px",
      alignItems: "flex-start",
    },
  },
  contentColumn: {
    boxSizing: "border-box",
    paddingInline: "16px",
    [`@media (max-width: 700px)`]: {
      width: "100% !important" as "100%",
      textAlign: "left",
    },
  },
  headline: {
    fontSize: "2rem",
    fontWeight: "300",
    color: "#2e2e2e",
    marginTop: "0",
    marginBottom: "20px",
    lineHeight: "1.25",
    [`@media (max-width: 600px)`]: {
      fontSize: "1.5rem",
    },
  },
  bodyText: {
    fontSize: "1rem",
    lineHeight: "1.8",
    color: "#3b2a1a",
    whiteSpace: "pre-wrap",
    margin: "0",
  },

  // ── About layout (image + text side by side) ──────────────────────────────
  aboutSection: {
    display: "flex",
    flexDirection: "row",
    gap: "56px",
    alignItems: "flex-start",
    maxWidth: "1040px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "64px",
    paddingBottom: "64px",
    width: "100%",
    boxSizing: "border-box",
    [`@media (max-width: 700px)`]: {
      flexDirection: "column",
      gap: "32px",
    },
  },
  aboutImage: {
    width: "42%",
    height: "auto",
    objectFit: "cover",
    display: "block",
    flexShrink: "0",
    [`@media (max-width: 700px)`]: {
      width: "100%",
    },
  },
  aboutText: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  // ── Gallery carousel ─────────────────────────────────────────────────────
  carouselSection: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "76px",
    paddingBottom: "76px",
    width: "100%",
    boxSizing: "border-box",
  },
  carouselWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  carouselClip: {
    flex: "1",
    minWidth: "0",
    overflow: "hidden",
  },
  carouselTrack: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  carouselItemImg: {
    display: "block",
    width: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    cursor: "zoom-in",
    transition: "opacity 0.2s",
    ":hover": {
      opacity: "0.8",
    },
  },
  carouselItemTitle: {
    fontSize: "0.82rem",
    letterSpacing: "0.5px",
    color: "#555",
    textAlign: "left",
    margin: "0",
  },
  carouselNavRow: {
    display: "none",
  },
  carouselArrow: {
    background: "none",
    border: "1px solid #bbb",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    flexShrink: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#555",
    fontSize: "1.1rem",
    transition: "border-color 0.2s, color 0.2s",
    ":hover": {
      border: "1px solid #555",
      color: "#222",
    },
  },
  carouselArrowDisabled: {
    opacity: "0.25",
    cursor: "default",
    pointerEvents: "none",
  },

  // ── Lightbox ──────────────────────────────────────────────────────────────
  lightboxOverlay: {
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(0, 0, 0, 0.88)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px",
    cursor: "zoom-out",
  },
  lightboxImage: {
    maxWidth: "90vw",
    maxHeight: "82vh",
    objectFit: "contain",
    display: "block",
  },
  lightboxCaption: {
    color: "#fff",
    marginTop: "14px",
    fontSize: "0.85rem",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },

  // ── Bottom section ──────────────────────────────────────────────────
  bottomSection: {
    backgroundColor: "rgb(196, 194, 187)",
    width: "100%",
    boxSizing: "border-box",
  },
  bottomSectionInner: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingBlock: "76px",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "34px",
    [`@media (max-width: 700px)`]: {
      flexDirection: "column",
      gap: "17px",
      paddingInline: "17px",
    },
  },
  bottomImage: {
    width: "28%",
    maxWidth: "280px",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
    flexShrink: "0",
    [`@media (max-width: 700px)`]: {
      width: "60%",
      maxWidth: "280px",
    },
  },
  bottomTextBlock: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bottomTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#3b2a1a",
    margin: "0",
  },
  bottomText: {
    fontSize: "1rem",
    lineHeight: "1.8",
    color: "#3b2a1a",
    whiteSpace: "pre-wrap",
    margin: "0",
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    marginTop: "auto",
    width: "100%",
    backgroundColor: "rgb(235, 231, 221)",
    paddingBlock: "20px",
    paddingInline: "24px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.75rem",
    color: "#555",
    boxSizing: "border-box",
    [`@media (max-width: 600px)`]: {
      flexDirection: "column",
      gap: "12px",
      alignItems: "flex-start",
    },
  },
  footerLinks: {
    display: "flex",
    flexDirection: "row",
    gap: "24px",
    alignItems: "center",
  },
  footerLink: {
    color: "#555",
    textDecoration: "none",
    fontSize: "0.75rem",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

function getCarouselSlice<T>(items: T[], start: number, count: number): T[] {
  if (items.length === 0) return [];
  return Array.from(
    { length: count },
    (_, i) => items[(start + i) % items.length],
  );
}

const HousecatPage = (props: IPage & { showCart?: boolean }) => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<IPage[]>([]);
  const [logoSrc, setLogoSrc] = useState<string | undefined>();
  const [siteSettings, setSiteSettings] = useState<ISiteSettings>({});
  const [lightboxItem, setLightboxItem] = useState<IGalleryItem | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [apiTestMessage, setApiTestMessage] = useState<string>("");

  useEffect(() => {
    testService
      .getTestMessage()
      .then(setApiTestMessage)
      .catch((e) => setApiTestMessage("error: " + e));
  }, []);
  const [carouselStart, setCarouselStart] = useState<number>(0);
  const [gallerySliding, setGallerySliding] = useState<
    "idle" | "next" | "prev"
  >("idle");
  const [carouselSectionStart, setCarouselSectionStart] = useState<number>(0);
  const [sectionSliding, setSectionSliding] = useState<
    "idle" | "next" | "prev"
  >("idle");
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pageService.getPagesData().then((data) => {
      const pages = data.pages;
      setSiteSettings(data.siteSettings);
      const segments =
        props.navSection?.navTitle?.split("/").filter(Boolean) ?? [];
      // A top-level page (0 or 1 segment) belongs to the root tree;
      // a nested page (e.g. /byalfonsdotter/shop) belongs to its first-segment tree.
      const rootPath = segments.length <= 1 ? "/" : `/${segments[0]}`;

      const rootPage = pages.find((p) => p.navSection?.navTitle === "/");
      if (rootPage?.navSection?.logoImage?.path) {
        setLogoSrc(rootPage.navSection.logoImage.path);
      }

      // Nav items: at root level show all depth-1 pages with navText;
      // in a sub-tree (e.g. /new/*) show pages under that prefix.
      const navPages =
        rootPath === "/"
          ? pages.filter(
              (p) =>
                (p.navSection?.navTitle?.split("/").filter(Boolean).length ??
                  0) <= 1 && !!p.navSection?.navText,
            )
          : pages.filter(
              (p) =>
                p.navSection?.navTitle?.startsWith(`${rootPath}/`) &&
                !!p.navSection?.navText,
            );

      setMenuItems(navPages);
    });
  }, [props.navSection?.navTitle]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const isAboutPage = props.navSection?.navTitle?.includes("/about") ?? false;
  const hasGallery = (props.contentSection?.galleryItems || []).length > 0;
  const hasShop = (props.contentSection?.shopItems || []).length > 0;

  const PAGE = 3;
  const gItems = props.contentSection?.galleryItems || [];
  const gTotal = gItems.length;
  // 5-item flat strip: [start-1, start, start+1, start+2, start+3]
  // idle at -20% (shows indices 1-3), prev animates to 0%, next to -40%
  const gSlice5 =
    gTotal > 0
      ? getCarouselSlice(gItems, (carouselStart - 1 + gTotal) % gTotal, 5)
      : [];
  const gOffset =
    gallerySliding === "next"
      ? "-40%"
      : gallerySliding === "prev"
        ? "0%"
        : "-20%";

  const sItems = props.carouselSection?.items || [];
  const sTotal = sItems.length;
  const sSlice5 =
    sTotal > 0
      ? getCarouselSlice(
          sItems,
          (carouselSectionStart - 1 + sTotal) % sTotal,
          5,
        )
      : [];
  const sOffset =
    sectionSliding === "next"
      ? "-40%"
      : sectionSliding === "prev"
        ? "0%"
        : "-20%";

  const DEFAULT_SECTION_ORDER: SectionType[] = [
    "leadSection",
    "contentSection",
    "cardSection",
    "carouselSection",
    "infoSection",
    "bottomSection",
  ];

  const renderBodySection = (type: SectionType): React.ReactNode => {
    switch (type) {
      case "leadSection":
        if (!props.leadSection?.leadImage) return null;
        return (
          <img
            src={props.leadSection.leadImage.path}
            alt={props.leadSection.leadImage.altText || ""}
            className={styles.hero}
          />
        );

      case "contentSection":
        return (
          <>
            {(props.contentSection?.columns?.length ?? 0) > 0 ? (
              <div className={styles.contentBlockWide}>
                {props.contentSection!.columns!.map((col, i) => (
                  <div
                    key={i}
                    className={styles.contentColumn}
                    style={{
                      width: col.width ? `${col.width}%` : undefined,
                      flex: col.width ? undefined : "1",
                      flexShrink: 0,
                    }}
                  >
                    {col.image && (
                      <img
                        src={col.image.path}
                        alt={col.image.altText || ""}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                    )}
                    {col.headline && (
                      <h1 className={styles.headline}>{col.headline}</h1>
                    )}
                    {col.text && <p className={styles.bodyText}>{col.text}</p>}
                    {col.mailForm && <MailForm mailForm={col.mailForm} />}
                  </div>
                ))}
              </div>
            ) : (
              (props.contentSection?.headline ||
                props.contentSection?.text) && (
                <div className={styles.contentBlock}>
                  {props.contentSection?.headline && (
                    <h1 className={styles.headline}>
                      {props.contentSection.headline}
                    </h1>
                  )}
                  {props.contentSection?.text && (
                    <p className={styles.bodyText}>
                      {props.contentSection.text}
                    </p>
                  )}
                  {props.contentSection?.mailForm && (
                    <MailForm mailForm={props.contentSection.mailForm} />
                  )}
                </div>
              )
            )}
            {hasGallery && (
              <section className={styles.carouselSection}>
                <div className={styles.carouselWrapper}>
                  {gTotal > PAGE && (
                    <button
                      className={styles.carouselArrow}
                      onClick={() => {
                        if (gallerySliding !== "idle") return;
                        setGallerySliding("prev");
                        setTimeout(() => {
                          setCarouselStart((s) => (s - 1 + gTotal) % gTotal);
                          setGallerySliding("idle");
                        }, 510);
                      }}
                      aria-label="Previous"
                      style={{ marginRight: "16px" }}
                    >
                      &#8592;
                    </button>
                  )}
                  <div className={styles.carouselClip}>
                    <div
                      style={{
                        display: "flex",
                        width: "calc(500% / 3)",
                        transform: `translateX(${gOffset})`,
                        transition:
                          gallerySliding === "idle"
                            ? "none"
                            : "transform 500ms linear",
                      }}
                    >
                      {gSlice5.map((item, i) => (
                        <div
                          key={`${item.path}-${i}`}
                          style={{
                            flex: "0 0 20%",
                            padding: "0 10px",
                            boxSizing: "border-box",
                          }}
                        >
                          <div className={styles.carouselItem}>
                            <img
                              src={item.path}
                              alt={item.title || ""}
                              className={styles.carouselItemImg}
                              onClick={() => setLightboxItem(item)}
                            />
                            {item.title && (
                              <p className={styles.carouselItemTitle}>
                                {item.title}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {gTotal > PAGE && (
                    <button
                      className={styles.carouselArrow}
                      onClick={() => {
                        if (gallerySliding !== "idle") return;
                        setGallerySliding("next");
                        setTimeout(() => {
                          setCarouselStart((s) => (s + 1) % gTotal);
                          setGallerySliding("idle");
                        }, 510);
                      }}
                      aria-label="Next"
                      style={{ marginLeft: "16px" }}
                    >
                      &#8594;
                    </button>
                  )}
                </div>
              </section>
            )}
            {hasShop && <ShopGrid items={props.contentSection!.shopItems!} />}
          </>
        );

      case "cardSection":
        if (!props.cardSection || props.cardSection.cards.length === 0)
          return null;
        return <CardSection cardSection={props.cardSection} />;

      case "carouselSection":
        if (sTotal === 0) return null;
        return (
          <section className={styles.carouselSection}>
            <div className={styles.carouselWrapper}>
              {sTotal > PAGE && (
                <button
                  className={styles.carouselArrow}
                  onClick={() => {
                    if (sectionSliding !== "idle") return;
                    setSectionSliding("prev");
                    setTimeout(() => {
                      setCarouselSectionStart((s) => (s - 1 + sTotal) % sTotal);
                      setSectionSliding("idle");
                    }, 510);
                  }}
                  aria-label="Previous"
                  style={{ marginRight: "16px" }}
                >
                  &#8592;
                </button>
              )}
              <div className={styles.carouselClip}>
                <div
                  style={{
                    display: "flex",
                    width: "calc(500% / 3)",
                    transform: `translateX(${sOffset})`,
                    transition:
                      sectionSliding === "idle"
                        ? "none"
                        : "transform 500ms linear",
                  }}
                >
                  {sSlice5.map((item, i) => (
                    <div
                      key={`${item.path}-${i}`}
                      style={{
                        flex: "0 0 20%",
                        padding: "0 10px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div className={styles.carouselItem}>
                        <img
                          src={item.path}
                          alt={item.altText || item.title || ""}
                          className={styles.carouselItemImg}
                        />
                        {item.title && (
                          <p className={styles.carouselItemTitle}>
                            {item.title}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {sTotal > PAGE && (
                <button
                  className={styles.carouselArrow}
                  onClick={() => {
                    if (sectionSliding !== "idle") return;
                    setSectionSliding("next");
                    setTimeout(() => {
                      setCarouselSectionStart((s) => (s + 1) % sTotal);
                      setSectionSliding("idle");
                    }, 510);
                  }}
                  aria-label="Next"
                  style={{ marginLeft: "16px" }}
                >
                  &#8594;
                </button>
              )}
            </div>
          </section>
        );

      case "infoSection":
        if (!props.infoSection || props.infoSection.items.length === 0)
          return null;
        return <InfoSection infoSection={props.infoSection} />;

      case "bottomSection":
        if (
          !props.bottomSection ||
          (!props.bottomSection.image && !props.bottomSection.text)
        )
          return null;
        return (
          <div className={styles.bottomSection}>
            <div className={styles.bottomSectionInner}>
              {props.bottomSection.image && (
                <img
                  src={props.bottomSection.image.path}
                  alt={props.bottomSection.image.altText || ""}
                  className={styles.bottomImage}
                />
              )}
              {(props.bottomSection.title || props.bottomSection.text) && (
                <div className={styles.bottomTextBlock}>
                  {props.bottomSection.title && (
                    <p className={styles.bottomTitle}>
                      {props.bottomSection.title}
                    </p>
                  )}
                  {props.bottomSection.text && (
                    <p className={styles.bottomText}>
                      {props.bottomSection.text}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <header className={styles.header}>
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Logo"
            className={styles.logo}
            onClick={() => {
              const firstSegment = props.navSection?.navTitle
                ?.split("/")
                .filter(Boolean)[0];
              navigate(firstSegment ? `/${firstSegment}` : "/");
            }}
          />
        )}

        <div className={styles.navRight}>
          <nav>
            <ul className={styles.nav}>
              {menuItems.map((item) => (
                <li
                  key={item.navSection?.navTitle}
                  className={`${styles.navItem}${props.navSection?.navTitle === item.navSection?.navTitle ? ` ${styles.navItemActive}` : ""}`}
                  onClick={() => navigate(item.navSection?.navTitle ?? "/")}
                >
                  {item.navSection?.navText}
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.headerIcons}>
            <a
              href="https://www.instagram.com/byalfonsdotter"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerIconBtn}
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="0.8"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            {props.showCart && <ShoppingCartWithBadge />}
          </div>{" "}
        </div>
        <button
          className={styles.hamburgerBtn}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <Dismiss24Regular /> : <Navigation24Regular />}
        </button>

        {menuOpen && (
          <div ref={menuRef} className={styles.mobileMenuPanel}>
            {menuItems.map((item) => (
              <div
                key={item.navSection?.navTitle}
                className={
                  props.navSection?.navTitle === item.navSection?.navTitle
                    ? styles.mobileMenuItemActive
                    : styles.mobileMenuItem
                }
                onClick={() => {
                  navigate(item.navSection?.navTitle ?? "/");
                  setMenuOpen(false);
                }}
              >
                {item.navSection?.navText}
              </div>
            ))}
          </div>
        )}

        <hr className={styles.navRule} />
      </header>

      {(props.sectionOrder ?? DEFAULT_SECTION_ORDER).map((type) => (
        <React.Fragment key={type}>{renderBodySection(type)}</React.Fragment>
      ))}

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxItem(null)}
        >
          <img
            src={lightboxItem.path}
            alt={lightboxItem.title || ""}
            className={styles.lightboxImage}
          />
          {lightboxItem.title && (
            <p className={styles.lightboxCaption}>{lightboxItem.title}</p>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span>
          {(
            siteSettings.footerCopyright ??
            "© {year} Kristina Alfonsdotter / By Alfonsdotter"
          ).replace("{year}", String(new Date().getFullYear()))}
        </span>
        <div className={styles.footerLinks}>
          {siteSettings.instagramUrl && (
            <>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                Instagram
              </a>
              <span>|</span>
            </>
          )}
          {siteSettings.contactEmail && (
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className={styles.footerLink}
            >
              Email
            </a>
          )}
        </div>
        <div
          title={
            apiTestMessage === "testing api"
              ? "API is connected"
              : `API is disconnected: ${apiTestMessage}`
          }
          style={{ marginTop: "8px", lineHeight: 1 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={apiTestMessage === "testing api" ? "#3a7d44" : "#aaa"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label={`API status: ${apiTestMessage}`}
          >
            {/* Wifi-style network icon */}
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle
              cx="12"
              cy="20"
              r="1"
              fill={apiTestMessage === "testing api" ? "#3a7d44" : "#aaa"}
              stroke="none"
            />
          </svg>
        </div>
      </footer>
    </div>
  );
};

export default HousecatPage;
