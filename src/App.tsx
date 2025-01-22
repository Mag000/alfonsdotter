import { Image, makeStyles, shorthands } from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const useStyles = makeStyles({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    ...shorthands.margin(0),
    ...shorthands.padding(0),
  },
  navigation: {
    fontFamily: "Source Sans Pro",
    fontWeight: "bold",
    color: "rgb(153,150,144)",
    textTransform: "uppercase",
    letterSpacing: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    ...shorthands.padding("10px", "20px"),
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...shorthands.padding("10px", "20px"),
    //boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "40vh",
    backgroundColor: "rgb(198,196,188)",
    ...shorthands.padding("0px"),
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",

    fontFamily: "Source Sans Pro",
    color: "rgb(91,104,72)",
    backgroundColor: "white",
    ...shorthands.padding("0px", "0px"),
    ...shorthands.margin("20px", "0px"),
    //boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  headline: {
    fontWeight: "bolder",
    lineHeight: 1.7,
    textAlign: "left",
  },
  bread: { textAlign: "left", lineHeight: 1.7 },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    cursor: "pointer",
    [`@media (max-width: 768px)`]: {
      display: "flex",
    },
  },
  bar: {
    width: "25px",
    height: "3px",
    backgroundColor: "black",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
    listStyleType: "none",
    margin: 0,
    padding: 0,
    [`@media (max-width: 768px)`]: {
      display: "none", // Hidden by default
      flexDirection: "column",
      position: "absolute",
      top: "60px",
      right: "20px",
      backgroundColor: "white",
      ...shorthands.padding("10px"),
      zIndex: 10,
    },
  },
  navLinksOpen: {
    [`@media (max-width: 768px)`]: {
      display: "flex", // Show when toggled
    },
  },
});

function App() {
  const imgRef = useRef<HTMLImageElement>(null); // Specify the type for the image
  const footerRef = useRef<HTMLDivElement>(null); // Specify the type for the div
  const contentRef = useRef<HTMLDivElement>(null); // Specify the type for the div

  useEffect(() => {
    const img = imgRef.current;
    const footer = footerRef.current;
    const content = contentRef.current;

    if (img && content) {
      // Adjust the width of the lower div to match the image
      const updateDivHeight = () => {
        content.style.height = `${img.clientHeight}px`;
      };

      // Set initial width
      updateDivHeight();

      // Adjust on window resize
      window.addEventListener("resize", updateDivHeight);

      // Cleanup event listener
      return () => {
        window.removeEventListener("resize", updateDivHeight);
      };
    }
  }, []);

  const styles = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className={styles.page}>
      {/* Navigation Bar */}
      <div className={styles.navigation}>
        <div className={styles.hamburger} onClick={toggleMenu}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <ul
          className={`${styles.navLinks} ${
            menuOpen ? styles.navLinksOpen : ""
          }`}
        >
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
      {/* Header */}
      <div className={styles.header}>
        <Image src="img/buddha.png" style={{ height: "20vh" }} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <Image
          ref={imgRef}
          src="img/yoga.png"
          style={{
            width: "70%",
            margin: 0,
            padding: 0,
          }}
        />
      </div>
      {/* Footer */}
      <div ref={footerRef} className={styles.footer}>
        <div className={styles.headline}>Rubrik</div>
        <div className={styles.bread}>
          Yinyoga kännetecknas av passiva positioner med en lätt, mjuk stretch
          utförda i stillhet och medveten närvaro. Varje position hålls i minst
          3-5 minuter vilket ger oss tid att även lugna sinnet. I yinyogan vill
          vi komma åt kroppens fascia, bindväv, istället för musklerna. Detta
          uppnås genom att inte gå så djupt i stretchen och hålla positionen en
          längre stund. Stort fokus ligger på området runt höfter och ländrygg.
          Dessa är särskilt rika på bindväv och lagrar enligt yogafilosofin
          mycket fysiska såväl som emotionella spänningar. Välkommen att
          kontakta mig om du behöver mer information om aktuella kurser,
          evenemang och samarbete eller om du har någon annan fundering. Jag ser
          fram emot att höra av dig.
        </div>
      </div>
    </div>
  );
}

export default App;
