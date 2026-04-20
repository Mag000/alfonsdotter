import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IGalleryItem } from "../model/IGalleryItem";
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
  const [serie, setSerie] = useState<IGalleryItem>();

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
    if (props.navSection?.navTitle != "/tt") {
      pageService.getPages().then((pages: IPage[]) => {
        const mItems = pages.filter((m) => m.navSection?.navText);

        setMenuItems(
          mItems.filter((f) => !f.navSection?.navTitle?.startsWith("/yoga")),
        );
      });
    }
  }, [props.navSection?.navTitle]);

  return (
    <>
      <div className={styles.page}>
        {menuItems && props.navSection?.navTitle != "/tt" && (
          <Menu
            width={imageWidth}
            menuItems={menuItems}
            onCartClicked={() => toggleCartOpen(!cartOpen)}
            onNavigate={(navTitle: string) => {
              setSerie(undefined);
              navigate(navTitle);
            }}
          />
        )}

        {props.navSection?.logoImage && (
          <div className={styles.section1}>
            <img
              className={styles.logoImage}
              src={props.navSection?.logoImage?.path}
              alt={props.navSection?.logoImage?.altText}
            />
          </div>
        )}

        {props.leadSection?.leadImage && !serie && (
          <div
            className={`${styles.section} ${styles.section2}`}
            style={{ marginTop: props.navSection?.logoImage ? 0 : "70px" }}
          >
            <img
              className={styles.image}
              src={props.leadSection?.leadImage?.path}
              alt={props.leadSection?.leadImage?.altText || ""}
            />
          </div>
        )}
        {!props.leadSection?.leadImage && (
          <div
            className={`${styles.section} ${styles.section2}`}
            style={{ backgroundColor: "white" }}
          >
            <img
              className={styles.image}
              src={`${import.meta.env.BASE_URL}img/900pxwhite.png`}
              alt=""
            />
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
          {props.contentSection?.headline && (
            <h1 className={styles.headline}>{props.contentSection.headline}</h1>
          )}

          {props.contentSection?.text && (
            <div className={styles.textContent}>
              {props.contentSection.text}
            </div>
          )}
        </div>
        {props.navSection?.navTitle == "/yoga/contact" && (
          <div
            className={`${styles.section} ${styles.section3}`}
            style={{ maxWidth: imageWidth }}
          >
            {/* <Contact width={imageWidth} /> */}
          </div>
        )}

        {(props.contentSection?.galleryItems || []).length > 0 && !serie && (
          <div
            className={styles.galleryContainer}
            style={{ maxWidth: imageWidth }}
          >
            {(props.contentSection?.galleryItems || []).map(
              (i: IGalleryItem) => (
                <div className={styles.galleryItem} onClick={() => setSerie(i)}>
                  <img src={i.path} style={{ maxWidth: "100%" }} />
                  <div
                    className={styles.overlay}
                    onMouseOver={(e) => {
                      (e.currentTarget as any).style.opacity = 1;
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as any).style.opacity = 0;
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      <h1 style={{ padding: 0, margin: 0, fontSize: "16px" }}>
                        {i.title}
                      </h1>
                      <p style={{ fontSize: "14px" }}>{i.tagLine}</p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
        {serie && (
          <div
            className={styles.galleryContainer}
            style={{
              width: imageWidth,
              flexDirection: "row",
              marginTop: "70px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
              }}
            >
              {(serie.variants || [serie]).map((i: IGalleryItem) => (
                <img
                  src={i.path}
                  style={{ width: "100%", paddingBottom: "30px" }}
                />
              ))}
            </div>

            <div
              style={{
                width: "35%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                }}
              >
                <h1 style={{ padding: 0, margin: 0, fontSize: "20px" }}>
                  {serie.title}
                </h1>
                <p style={{ fontSize: "16px" }}>{serie.description}</p>
              </div>
            </div>
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
