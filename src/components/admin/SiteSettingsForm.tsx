import {
  Card,
  CardHeader,
  Field,
  Input,
  makeStyles,
  Text,
  tokens,
} from "@fluentui/react-components";
import React from "react";
import { ISiteSettings } from "../../model/IPage";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
    maxWidth: "800px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  sectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
});

interface SiteSettingsFormProps {
  settings: ISiteSettings;
  onChange: (updated: ISiteSettings) => void;
}

export const SiteSettingsForm: React.FC<SiteSettingsFormProps> = ({
  settings,
  onChange,
}) => {
  const styles = useStyles();

  const update = (field: keyof ISiteSettings, value: string) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className={styles.container}>
      <Text size={500} weight="semibold">
        Site Settings
      </Text>

      <Card>
        <CardHeader
          header={<Text className={styles.sectionTitle}>Footer</Text>}
        />
        <div className={styles.section}>
          <Field label="Instagram URL">
            <Input
              value={
                settings.instagramUrl ?? "https://www.instagram.com/yourhandle"
              }
              onChange={(_, d) => update("instagramUrl", d.value)}
            />
          </Field>
          <Field label="Contact email">
            <Input
              type="email"
              value={settings.contactEmail ?? "hello@example.com"}
              onChange={(_, d) => update("contactEmail", d.value)}
            />
          </Field>
          <Field label="Copyright text ({year} will be replaced with the current year)">
            <Input
              value={settings.footerCopyright ?? "© {year} Your Name"}
              onChange={(_, d) => update("footerCopyright", d.value)}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
};
