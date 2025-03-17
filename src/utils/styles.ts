import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    justifyItems: "center",
    alignItems: "center",
    marginInline: "5px",
    paddingBottom: "20px",
  },
  section: {
    width: "100%",
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  section1: {
    display: "flex",
    maxWidth: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    verticalAlign: "center",
    alignItems: "center",
    height: "auto",
  },
  mobileMenu: {
    display: "none",
    justifyContent: "space-between",
    alignItems: "center",
    listStyle: "none",
    paddingTop: "20px",
    paddingBottom: 0,
    [`@media (max-width: 900px)`]: {
      display: "flex",
    },
  },
  wideMenu: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    listStyle: "none",
    paddingTop: "20px",
    paddingBottom: 0,
    [`@media (max-width: 900px)`]: {
      display: "none",
    },
  },

  menuItem: {
    fontFamily: "Source Sans Pro",
    fontSize: "1em",
    fontWeight: "bold",
    color: "rgb(153,150,144)",
    textTransform: "uppercase",
    letterSpacing: "5px",
    textDecoration: "none",
    textAlign: "center",
    cursor: "pointer",
  },

  mobileMenuItem: {
    fontFamily: "Source Sans Pro",
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "rgb(153,150,144)",
    textTransform: "uppercase",
    letterSpacing: "5px",
    textDecoration: "none",
    textAlign: "center",
    cursor: "pointer",
  },
  section2: {
    backgroundColor: "rgb(198,196,188)",
    margin: 0,
  },
  section3: {
    fontFamily: "Source Sans Pro",
    color: "rgb(91,104,72)",
    backgroundColor: "white",
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    alignItems: "left",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    paddingTop: "20px",
  },

  contactForm: {
    fontFamily: "Source Sans Pro",
    color: "rgb(91,104,72)",
    backgroundColor: "rgb(198,196,188)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxSizing: "border-box",
    maxWidth: "100%",
    padding: "20px",
  },
  contactField: {
    display: "flex",
    flexDirection: "column",
  },
  footerField: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    marginInline: "auto",
    width: "100%",
    gap: "10px",
    paddingTop: "20px",
    paddingBottom: "30px",
  },
  footerItem: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    marginInline: "auto",
  },
  image: {
    maxWidth: "900px",
    [`@media (max-width: 900px)`]: {
      maxWidth: "100%",
    },
    height: "auto",
  },
  logoImage: {
    maxWidth: "370px",
    [`@media (max-width: 900px)`]: {
      maxWidth: "100%",
    },
    height: "auto",
  },
  startImage: {
    maxWidth: "400px",
    [`@media (max-width: 900px)`]: {
      maxWidth: "100%",
    },
    height: "auto",
    cursor: "pointer",
  },
  headline: {
    fontWeight: "bolder",
    lineHeight: 1.1,
    width: "100%",
  },
  textContent: {
    lineHeight: 1,
    width: "100%",
  },

  sendButton: {
    color: "rgb(153,150,144)",
    textTransform: "uppercase",
    letterSpacing: "5px",
    minHeight: "40px",
  },
  galleryContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginInline: "auto",
    gap: "20px",
    justifyContent: "space-between",
  },

  galleryItem: { maxWidth: "270px" },
});
