import {
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  makeStyles,
  Text,
  tokens,
} from "@fluentui/react-components";
import { LockClosed24Regular } from "@fluentui/react-icons";
import React, { useCallback, useState } from "react";
import { login } from "../../services/editorService";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: tokens.spacingVerticalXL,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalL,
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
});

interface IAdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<IAdminLoginProps> = ({ onLoginSuccess }) => {
  const styles = useStyles();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      // Simulate slight delay for UX
      setTimeout(() => {
        if (login(password)) {
          onLoginSuccess();
        } else {
          setError("Incorrect password");
          setPassword("");
        }
        setIsLoading(false);
      }, 300);
    },
    [password, onLoginSuccess],
  );

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <div className={styles.header}>
              <LockClosed24Regular />
              <Text weight="semibold" size={500}>
                Admin Login
              </Text>
            </div>
          }
        />
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(e, data) => setPassword(data.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
            />
          </Field>

          {error && <Text className={styles.error}>{error}</Text>}

          <Button
            type="submit"
            appearance="primary"
            disabled={isLoading || !password}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
