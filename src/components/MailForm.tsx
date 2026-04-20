import {
  Button,
  Input,
  Label,
  Textarea,
  makeStyles,
} from "@fluentui/react-components";
import { useState } from "react";
import { IMailForm, IMailFormField } from "../model/IPage";
import { sendContactForm } from "../services/mailService";

const swedishValidity = (
  el: HTMLInputElement | HTMLTextAreaElement,
  field: IMailFormField,
) => {
  el.setCustomValidity("");
  if (el.validity.valueMissing) {
    el.setCustomValidity(`${field.label} är obligatoriskt.`);
  } else if (el.validity.typeMismatch || el.validity.patternMismatch) {
    if (field.type === "email")
      el.setCustomValidity("Ange en giltig e-postadress.");
    else if (field.type === "tel")
      el.setCustomValidity("Ange ett giltigt telefonnummer.");
    else el.setCustomValidity("Ogiltigt värde.");
  }
};

const useStyles = makeStyles({
  field: {
    "::after": { display: "none" },
  },
});

interface MailFormProps {
  mailForm: IMailForm;
}

export const MailForm = ({ mailForm }: MailFormProps) => {
  const styles = useStyles();
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const result = await sendContactForm(
      {
        namn: values["namn"] ?? "",
        epost: values["epost"] ?? "",
        telefon: values["telefon"],
        meddelande: values["meddelande"] ?? "",
      },
      mailForm.submitAction,
    );
    setStatus(result.success ? "done" : "error");
    setMessage(result.message);
  };

  if (status === "done") {
    return <p style={{ color: "#4a7c59", fontStyle: "italic" }}>{message}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {mailForm.fields.map((field) => (
        <div
          key={field.name}
          style={{ display: "flex", flexDirection: "column", gap: "4px" }}
        >
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && " *"}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onInvalid={(e) => swedishValidity(e.currentTarget, field)}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              className={styles.field}
              style={{ backgroundColor: "white", minHeight: "120px" }}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onInvalid={(e) => swedishValidity(e.currentTarget, field)}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              className={styles.field}
              style={{ backgroundColor: "white" }}
            />
          )}
        </div>
      ))}

      {status === "error" && (
        <p style={{ color: "#c0392b", margin: 0 }}>{message}</p>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        appearance="primary"
        style={{
          backgroundColor:
            status === "sending" ? "rgb(160,138,60)" : "rgb(180,155,72)",
          borderColor: "transparent",
          color: "rgb(233,230,220)",
          borderRadius: "24px",
          alignSelf: "flex-start",
          paddingInline: "28px",
        }}
      >
        {status === "sending" ? "Skickar..." : "Skicka"}
      </Button>
    </form>
  );
};
