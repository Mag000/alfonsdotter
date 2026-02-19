import type { CounterBadgeProps } from "@fluentui/react-components";
import { CounterBadge } from "@fluentui/react-components";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { IMenu } from "../model/IMenu";
import { useStyles } from "../utils/styles";

export const Default = (args: CounterBadgeProps) => <CounterBadge {...args} />;

export const Menu = (props: IMenu) => {
  const styles = useStyles();
  const [menuOpen, toggleMenuOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const [orderQtyTotal, setOrderQtyTotal] = useState<number>(3);

  const location = useLocation();

  //console.log(location.pathname);

  let mobileItems = props.menuItems.map((p) => (
    <div
      onClick={() => {
        props.onNavigate(p.navTitle);
      }}
      className={styles.menuItem}
    >
      {p.headline}
    </div>
  ));

  if (menuOpen) {
    mobileItems = mobileItems.concat(
      props.menuItems
        .filter((f) => f.navTitle != location.pathname)
        .map((p) => (
          <div
            onClick={() => {
              toggleMenuOpen(false);
              props.onNavigate(p.navTitle);
            }}
            className={styles.menuItem}
          >
            {p.headline}
          </div>
        ))
    );
  } else {
    mobileItems = mobileItems.concat(
      <div
        onClick={() => {
          toggleMenuOpen(true);
        }}
        className={styles.menuItem}
      >
        ☰
      </div>
    );
  }

  return (
    <div
      style={{
        height: 70,
        width: "100%",
        backgroundColor: "white",
        position: "fixed",
        top: 0,
        zIndex: 1000,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className={styles.wideMenu} style={{ width: props.width }}>
        {props.menuItems.map((p) => (
          <div
            onClick={() => {
              props.onNavigate(p.navTitle);
            }}
            className={styles.menuItem}
          >
            {p.navText}
          </div>
        ))}
        {/* {orderQtyTotal > 0 && (
          <ShoppingCartWithBadge itemCount={orderQtyTotal} />
        )} */}
      </div>
      <div
        className={styles.mobileMenu}
        style={{
          width: props.width,
          flexDirection: menuOpen ? "column" : "row",
        }}
      >
        {mobileItems}
      </div>
    </div>
  );
};
