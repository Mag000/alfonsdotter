import { useState } from "react";
import { IMenu } from "../model/IMenu";
import { useStyles } from "../utils/styles";

export const Menu = (props: IMenu) => {
  const styles = useStyles();
  const [menuOpen, toggleMenuOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={styles.wideMenu} style={{ width: props.width }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
        >
          <div style={{ border: "solid 1px red" }}>
            <a href="#" className={styles.menuItem}>
              Home
            </a>
          </div>
          <div>
            <a href="#" className={styles.menuItem}>
              About
            </a>
          </div>
          <div>
            <a href="#" className={styles.menuItem}>
              Services
            </a>
          </div>
          <div>
            <a href="#" className={styles.menuItem}>
              Contact
            </a>
          </div>
        </div>
      </div>
      <div className={styles.hamburger}>
        <a onClick={() => toggleMenuOpen(!menuOpen)}>☰</a>
      </div>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="#" className={styles.menuItem}>
            Home
          </a>
          <a href="#" className={styles.menuItem}>
            About
          </a>
          <a href="#" className={styles.menuItem}>
            Services
          </a>
          <a href="#" className={styles.menuItem}>
            Contact
          </a>
        </div>
      )}
    </>
  );
};
