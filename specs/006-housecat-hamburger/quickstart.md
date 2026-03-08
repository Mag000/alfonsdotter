# Quickstart: HousecatPage Hamburger Menu

**Feature**: `006-housecat-hamburger`
**Sole file changed**: `src/components/HousecatPage.tsx`

## What to implement

Add a hamburger menu toggle to `HousecatPage` that appears below 768 px and hides the horizontal nav.

## Step-by-step

### 1. Add imports

```tsx
import { Dismiss24Regular, Navigation24Regular } from "@fluentui/react-icons";
```

### 2. Add state

Inside the component function, alongside the existing `useState` calls:

```tsx
const [menuOpen, setMenuOpen] = useState<boolean>(false);
const menuRef = useRef<HTMLDivElement | null>(null);
```

### 3. Add outside-click + Escape dismissal

```tsx
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
```

### 4. Add new makeStyles entries

Add these to the existing `useStyles` call in `HousecatPage.tsx`:

```ts
hamburgerBtn: {
  display: "none",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  color: "#555",
  alignItems: "center",
  justifyContent: "center",
  [`@media (max-width: 768px)`]: {
    display: "flex",
  },
},
mobileMenuPanel: {
  position: "absolute",
  top: "100%",
  left: "0",
  right: "0",
  backgroundColor: "#fff",
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
  letterSpacing: "3px",
  textTransform: "uppercase",
  color: "#999",
  cursor: "pointer",
  paddingBlock: "14px",
  paddingInline: "24px",
  textDecoration: "none",
  ":hover": {
    color: "#333",
  },
},
mobileMenuItemActive: {
  fontFamily: "'Source Sans Pro', sans-serif",
  fontSize: "0.85rem",
  fontWeight: "400",
  letterSpacing: "3px",
  textTransform: "uppercase",
  color: "#333",
  cursor: "pointer",
  paddingBlock: "14px",
  paddingInline: "24px",
  borderLeft: "2px solid #333",
},
```

Also add `position: "relative"` to the existing `header` entry, and add `@media (max-width: 768px): { display: "none" }` to the existing `nav` entry.

### 5. Update JSX

Replace the header JSX with:

```tsx
<header className={styles.header}>
  {logoSrc && (
    <img
      src={logoSrc}
      alt="Logo"
      className={styles.logo}
      onClick={() => navigate("/new")}
    />
  )}

  {/* Desktop nav */}
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

  {/* Hamburger toggle */}
  <button
    className={styles.hamburgerBtn}
    onClick={() => setMenuOpen((o) => !o)}
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
  >
    {menuOpen ? <Dismiss24Regular /> : <Navigation24Regular />}
  </button>

  {/* Mobile menu panel */}
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
```

## Verification checklist

- [ ] At 375 px: hamburger visible, `<ul>` nav hidden
- [ ] At 1024 px: hamburger hidden, `<ul>` nav visible
- [ ] Tap hamburger → panel opens with all nav links
- [ ] Tap link → navigates + panel closes
- [ ] Tap outside panel → panel closes
- [ ] Press Escape → panel closes
- [ ] Active page link visually distinct in panel
- [ ] No horizontal scrollbar at any width 320–1920 px
- [ ] All `/new/*` routes still load correctly
