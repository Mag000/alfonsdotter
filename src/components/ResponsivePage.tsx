import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IImage } from "../model/IImage";
import { IPage } from "../model/IPage";
import { pageService } from "../services/pageService";
import { useStyles } from "../utils/styles";
import { Menu } from "./Menu";

const ResponsivePage = (props: IPage) => {
  const styles = useStyles();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageWidth, setImageWidth] = useState("900px");
  const [menuItems, setMenuItems] = useState<IPage[]>([]);
  const [cartOpen, toggleCartOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!imageRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (imageRef.current) {
        setImageWidth(`${imageRef.current.offsetWidth}px`);
      }
    });

    resizeObserver.observe(imageRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (props.navTitle != "/") {
      pageService.getPages().then((pages: IPage[]) => {
        const mItems = pages.filter((m) => m.navText);

        setMenuItems(
          mItems.filter((f) =>
            f.navTitle.startsWith("/" + location.pathname.split("/")[1])
          )
        );
      });
    }
  }, [props.navTitle]);

  return (
    <>
      <div className={styles.page}>
        {menuItems && props.navTitle != "/" && (
          <Menu
            width={imageWidth}
            menuItems={menuItems}
            onCartClicked={() => toggleCartOpen(!cartOpen)}
          />
        )}

        {props.navTitle == "/" && (
          <div
            style={{
              display: "flex",
              marginTop: "10%",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            <img
              onClick={() => navigate("/yoga")}
              className={styles.startImage}
              src="img/yoga/Logo_Yoga.jpg"
              alt="Yoga"
            />
            <img
              onClick={() => navigate("/form")}
              className={styles.startImage}
              src="img/form/Logo_Form.jpg"
              alt="form"
            />
          </div>
        )}

        {props.logoImage && (
          <div className={styles.section1}>
            <img
              className={styles.logoImage}
              src={props.logoImage?.path}
              alt={props.logoImage?.altText}
            />
          </div>
        )}

        {props.leadImage && (
          <div className={`${styles.section} ${styles.section2}`}>
            <img
              className={styles.image}
              src={props.leadImage?.path}
              alt={props.leadImage?.altText || ""}
            />
          </div>
        )}
        {!props.leadImage && (
          <div
            className={`${styles.section} ${styles.section2}`}
            style={{ backgroundColor: "white" }}
          >
            <img className={styles.image} src="/img/900pxwhite.png" alt="" />
          </div>
        )}

        {/* {props.leadImage && location.pathname.split("/").length > 2 && (
          <div className={`${styles.section} ${styles.section2}`}>
            <img
              ref={imageRef}
              className={styles.image}
              src={props.leadImage?.path}
              alt={props.leadImage?.altText}
            />
          </div>
        )} */}
        <div
          className={`${styles.section} ${styles.section3}`}
          style={{ maxWidth: imageWidth }}
        >
          {props.headline && (
            <h1 className={styles.headline}>{props.headline}</h1>
          )}

          {props.text && <div className={styles.textContent}>{props.text}</div>}
        </div>
        {props.navTitle == "/yoga/contact" && (
          <div
            className={`${styles.section} ${styles.section3}`}
            style={{ maxWidth: imageWidth }}
          >
            {/* <Contact width={imageWidth} /> */}
          </div>
        )}

        {(props.galleryItems || []).length > 0 && (
          <div
            className={styles.galleryContainer}
            style={{ maxWidth: imageWidth }}
          >
            {(props.galleryItems || []).map((i: IImage) => (
              <div className={styles.galleryItem}>
                <img src={i.path} style={{ maxWidth: "100%" }} />
              </div>
            ))}
          </div>
        )}
        {/* {props.navTitle != "/" && (
          <div className={styles.footerField}>
            <div className={styles.footerItem}>
              Du kan också håll kontakt med mig via:
            </div>
            <div className={styles.footerItem}>
              <img
                src="/img/instagram.png"
                style={{ width: "64px", height: "64px" }}
              />
              <img
                src="/img/facebook.png"
                style={{ width: "64px", height: "64px" }}
              />
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default ResponsivePage;
