import { Button, Input, Label, Textarea } from "@fluentui/react-components";
import { IContact } from "../model/IContact";
import { useStyles } from "../utils/styles";

export const Contact = (props: IContact) => {
  const styles = useStyles();

  return (
    <div className={styles.contactForm} style={{ width: props.width }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: "0px",
          maxWidth: props.width,
        }}
      >
        <div className={styles.contactField} style={{ width: "400px" }}>
          <Label htmlFor="name">Fullständigt namn</Label>
          <Input id="name" style={{ backgroundColor: "white" }} />
        </div>
        <div className={styles.contactField} style={{ width: "400px" }}>
          <Label htmlFor="email">E-postadress</Label>
          <Input id="email" style={{ backgroundColor: "white" }} />
        </div>
      </div>
      <div className={styles.contactField}>
        <Label htmlFor="subject">Ämne</Label>
        <Input id="subject" style={{ backgroundColor: "white" }} />
      </div>
      <div className={styles.contactField}>
        <Label htmlFor="message">Meddelande</Label>
        <Textarea id="message" style={{ backgroundColor: "white" }} />
      </div>
      <div className={styles.contactField}>
        <Button id="message" className={styles.sendButton}>
          SKICKA MEDDELANDE
        </Button>
      </div>
    </div>
  );
};
