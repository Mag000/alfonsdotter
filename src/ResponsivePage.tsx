import { makeStyles } from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";

const useStyles = makeStyles({
  section: {
    width: "100%",
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  section1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "center",
    maxWidth: "100%",
    backgroundColor: "white",
    height: "60px",
    gap: "30px",
  },
  menuItem: {
    fontFamily: "Source Sans Pro",
    fontWeight: "bold",
    color: "rgb(153,150,144)",
    textTransform: "uppercase",
    letterSpacing: "5px",
    textDecoration: "none",
  },
  section2: {
    backgroundColor: "rgb(198,196,188)",
    margin: 0,
  },
  section3: {
    fontFamily: "Source Sans Pro",
    color: "rgb(91,104,72)",
    backgroundColor: "white",
    maxWidth: "90%",
    width: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    alignItems: "left",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    paddingTop: "20px",
  },
  image: {
    maxWidth: "50%",
    [`@media (max-width: 768px)`]: {
      maxWidth: "90%",
    },
    height: "auto",
  },
  headline: {
    fontWeight: "bolder",
    lineHeight: 1.3,
    width: "100%",
  },
});

const ResponsivePage = () => {
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
    <div>
      <div className={`${styles.section} ${styles.section1}`}>
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
        <h1 className={styles.headline}>Rubrik</h1>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        suscipit in purus at consectetur. Sed magna nunc, ultrices ut magna
        quis, ullamcorper accumsan libero. Interdum et malesuada fames ac ante
        ipsum primis in faucibus. Cras blandit risus elit, vitae aliquam purus
        auctor id. Proin ac porta ante. Sed imperdiet tincidunt ligula. Ut
        iaculis mi massa, a scelerisque sapien venenatis id. Donec non felis
        ultricies mauris elementum ullamcorper. Quisque semper a felis at
        hendrerit. Sed ac molestie sem. Integer consequat sed odio eget
        facilisis. Donec eleifend nibh id felis pellentesque, non aliquet risus
        consequat. Ut neque sem, viverra in leo porttitor, ullamcorper aliquam
        risus. Morbi eu arcu eget orci facilisis venenatis. Nunc lobortis ornare
        lorem, sagittis scelerisque massa tincidunt sit amet. Vestibulum finibus
        volutpat elit eu tincidunt. Integer id condimentum enim. Fusce posuere
        nulla egestas tincidunt faucibus. In interdum, odio aliquam laoreet
        vestibulum, odio massa gravida odio, eget blandit magna neque ut nisl.
        Phasellus ut tincidunt dui. Fusce quis elementum lectus. Quisque tempor
        at nisl ut mollis. Integer dapibus erat vel est laoreet, ac mollis leo
        ultrices. Maecenas scelerisque orci at neque tempus, sed volutpat quam
        ullamcorper. Curabitur vehicula ante eu enim faucibus, quis pharetra
        tortor laoreet. Suspendisse consectetur sapien egestas, dapibus elit
        quis, accumsan arcu. Quisque venenatis luctus commodo. Quisque nec est
        quis augue ornare ullamcorper in in dui. Vestibulum euismod, dolor ac
        dapibus blandit, nibh ante posuere justo, sit amet molestie velit diam
        ac odio. Aliquam ac odio aliquet lacus condimentum aliquet. Aliquam sed
        nisi ut diam luctus maximus. Curabitur elit ante, pellentesque at neque
        eget, porta mollis sem. Phasellus rhoncus dignissim tellus. Nam pulvinar
        congue ipsum et vulputate. Duis tincidunt, mi gravida rhoncus malesuada,
        tellus metus hendrerit lacus, at sollicitudin dolor neque a arcu.
        Suspendisse tempus tempor est, sit amet pretium velit interdum in. Proin
        ac ante nec libero sodales tristique convallis non libero. Phasellus
        elit nulla, congue porta tortor ac, porta malesuada tortor.
      </div>
    </div>
  );
};

export default ResponsivePage;
