import { useEffect, useRef, useState } from "react";
import { IResponsivePage } from "../model/IReponsivePage";
import { useStyles } from "../utils/styles";
import { Menu } from "./Menu";

const ResponsivePage = (props: IResponsivePage) => {
  const styles = useStyles();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageWidth, setImageWidth] = useState("90%");

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

  return (
    <div style={{ marginInline: 0 }}>
      <Menu width={imageWidth} />
      {/* <div className={styles.section1}>
        <img src="img/buddha.png" style={{ width: "200px" }} />
      </div> */}
      <div className={`${styles.section} ${styles.section2}`}>
        <img
          ref={imageRef}
          className={styles.image}
          src="img/yoga.png"
          alt="Large Example Image"
        />
      </div>
      <div
        className={`${styles.section} ${styles.section3}`}
        style={{ maxWidth: imageWidth }}
      >
        {props.headline && (
          <h1 className={styles.headline}>{props.headline}</h1>
        )}
        {props.text && <p>{props.text}</p>}
      </div>
    </div>
  );
};

export default ResponsivePage;
