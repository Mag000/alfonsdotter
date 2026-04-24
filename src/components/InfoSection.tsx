import { makeStyles } from "@fluentui/react-components";
import { IInfoSection } from "../model/IPage";

const useStyles = makeStyles({
  section: {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: "24px",
    paddingTop: "48px",
    paddingBottom: "48px",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "32px",
  },
  itemImageOnly: {
    display: "block",
    width: "100%",
  },
  itemTextOnly: {
    display: "block",
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.95rem",
    color: "#444",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    margin: "0",
  },
  img: {
    display: "block",
    width: "45%",
    flexShrink: "0",
    height: "auto",
    borderRadius: "8px",
    objectFit: "cover",
  },
  text: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontSize: "0.95rem",
    color: "#444",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    margin: "0",
    flex: "1",
  },
});

interface InfoSectionProps {
  infoSection: IInfoSection;
}

export const InfoSection = ({ infoSection }: InfoSectionProps) => {
  const styles = useStyles();

  return (
    <section className={styles.section}>
      {infoSection.items.map((item, i) => {
        const hasImage = !!item.image;
        const hasText = !!item.text;

        if (hasImage && hasText) {
          return (
            <div key={i} className={styles.item}>
              <img
                src={item.image!.path}
                alt={item.image!.altText || ""}
                className={styles.img}
              />
              <p className={styles.text}>{item.text}</p>
            </div>
          );
        }

        if (hasImage) {
          return (
            <img
              key={i}
              src={item.image!.path}
              alt={item.image!.altText || ""}
              className={styles.itemImageOnly}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          );
        }

        if (hasText) {
          return (
            <p key={i} className={styles.itemTextOnly}>
              {item.text}
            </p>
          );
        }

        return null;
      })}
    </section>
  );
};
