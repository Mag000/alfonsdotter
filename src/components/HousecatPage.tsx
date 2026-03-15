import { makeStyles } from "@fluentui/react-components";
import { Dismiss24Regular, Navigation24Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IGalleryItem } from "../model/IGalleryItem";
import { IPage } from "../model/IPage";
import { pageService } from "../services/pageService";
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
    maxHeight: "520px",
    objectFit: "cover",
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
    paddingTop: "56px",
    paddingBottom: "56px",
    width: "100%",
    boxSizing: "border-box",
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
    color: "#555",
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

  // ── Gallery grid ──────────────────────────────────────────────────────────
  gallerySection: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "20px",
    paddingBottom: "64px",
    width: "100%",
    boxSizing: "border-box",
  },
  galleryGrid: {
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
  galleryThumb: {
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "34px",
    paddingInline: "34px",
    paddingBlock: "34px",
    boxSizing: "border-box",
    [`@media (max-width: 700px)`]: {
      flexDirection: "column",
      gap: "17px",
      paddingInline: "17px",
    },
  },
  bottomImage: {
    width: "28%",
    maxWidth: "280px",
    height: "auto",
    display: "block",
    flexShrink: "0",
    [`@media (max-width: 700px)`]: {
      width: "100%",
      maxWidth: "100%",
    },
  },
  bottomText: {
    flex: "1",
    fontSize: "1rem",
    lineHeight: "1.8",
    color: "#fff",
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
    letterSpacing: "1.5px",
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
    letterSpacing: "1.5px",
    fontSize: "0.75rem",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

const HousecatPage = (props: IPage) => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<IPage[]>([]);
  const [logoSrc, setLogoSrc] = useState<string | undefined>();
  const [lightboxItem, setLightboxItem] = useState<IGalleryItem | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pageService.getPages().then((pages: IPage[]) => {
      // Derive the root path: /new/home → /new, /about → /
      const firstSegment = props.navTitle.split("/").filter(Boolean)[0];
      const rootPath = firstSegment ? `/${firstSegment}` : "/";

      const rootPage = pages.find((p) => p.navTitle === rootPath);
      if (rootPage?.logoImage?.path) {
        setLogoSrc(rootPage.logoImage.path);
      }

      // Nav items: at root level show all depth-1 pages with navText;
      // in a sub-tree (e.g. /new/*) show pages under that prefix.
      const navPages =
        rootPath === "/"
          ? pages.filter(
              (p) =>
                p.navTitle.split("/").filter(Boolean).length <= 1 &&
                !!p.navText,
            )
          : pages.filter(
              (p) => p.navTitle.startsWith(`${rootPath}/`) && !!p.navText,
            );

      setMenuItems(navPages);
    });
  }, []);

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

  const isAboutPage = props.navTitle.includes("/about");
  const hasGallery = (props.galleryItems || []).length > 0;
  const hasShop = (props.shopItems || []).length > 0;

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
              const firstSegment = props.navTitle.split("/").filter(Boolean)[0];
              navigate(firstSegment ? `/${firstSegment}` : "/");
            }}
          />
        )}

        <div className={styles.navRight}>
          <nav>
            <ul className={styles.nav}>
              {menuItems.map((item) => (
                <li
                  key={item.navTitle}
                  className={`${styles.navItem}${props.navTitle === item.navTitle ? ` ${styles.navItemActive}` : ""}`}
                  onClick={() => navigate(item.navTitle)}
                >
                  {item.navText}
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
            <ShoppingCartWithBadge />
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
                key={item.navTitle}
                className={
                  props.navTitle === item.navTitle
                    ? styles.mobileMenuItemActive
                    : styles.mobileMenuItem
                }
                onClick={() => {
                  navigate(item.navTitle);
                  setMenuOpen(false);
                }}
              >
                {item.navText}
              </div>
            ))}
          </div>
        )}

        <hr className={styles.navRule} />
      </header>

      {/* ── Lead image — always full width ── */}
      {props.leadImage ? (
        <img
          src={props.leadImage.path}
          alt={props.leadImage.altText || ""}
          className={styles.hero}
        />
      ) : (
        <div className={styles.heroPlaceholder} />
      )}

      {/* ── Headline + text ── */}
      {(props.headline || props.text) && (
        <div className={styles.contentBlock}>
          {props.headline && (
            <h1 className={styles.headline}>{props.headline}</h1>
          )}
          {props.text && <p className={styles.bodyText}>{props.text}</p>}
        </div>
      )}

      {/* ── Gallery grid ── */}
      {hasGallery && (
        <section className={styles.gallerySection}>
          <div className={styles.galleryGrid}>
            {(props.galleryItems || []).map((item) => (
              <img
                key={item.path}
                src={item.path}
                alt={item.title || ""}
                className={styles.galleryThumb}
                onClick={() => setLightboxItem(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Shop grid ── */}
      {hasShop && <ShopGrid items={props.shopItems!} />}

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

      {/* ── Bottom section ── */}
      {props.bottomSection &&
        (props.bottomSection.image || props.bottomSection.text) && (
          <div className={styles.bottomSection}>
            {props.bottomSection.image && (
              <img
                src={props.bottomSection.image.path}
                alt={props.bottomSection.image.altText || ""}
                className={styles.bottomImage}
              />
            )}
            {props.bottomSection.text && (
              <p className={styles.bottomText}>{props.bottomSection.text}</p>
            )}
          </div>
        )}

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} Kristina Alfonsdotter / By Alfonsdotter
        </span>
        <div className={styles.footerLinks}>
          <a
            href="https://www.instagram.com/byalfonsdotter"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Instagram
          </a>
          <span>|</span>
          <a href="mailto:hello@example.com" className={styles.footerLink}>
            Email
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HousecatPage;
