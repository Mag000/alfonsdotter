import {
  Field,
  Input,
  makeStyles,
  Text,
  tokens,
} from "@fluentui/react-components";
import { Image24Regular, Warning24Regular } from "@fluentui/react-icons";
import React, { useState } from "react";
import { IImage } from "../../model/IImage";
import { ImagePicker } from "./ImagePicker";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  previewContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: tokens.spacingHorizontalM,
  },
  imagePreview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  placeholderPreview: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForeground3,
  },
  errorPreview: {
    width: "100px",
    height: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorPaletteRedBackground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    textAlign: "center",
    padding: tokens.spacingHorizontalXS,
  },
  fieldsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    flex: 1,
  },
});

interface IImageFieldProps {
  label: string;
  image?: IImage;
  onChange: (image: IImage | undefined) => void;
}

export const ImageField: React.FC<IImageFieldProps> = ({
  label,
  image,
  onChange,
}) => {
  const styles = useStyles();
  const [hasError, setHasError] = useState(false);

  const handlePathChange = (value: string) => {
    setHasError(false);
    if (value.trim() === "") {
      onChange(undefined);
    } else {
      onChange({
        path: value,
        altText: image?.altText,
      });
    }
  };

  const handleAltTextChange = (value: string) => {
    if (image?.path) {
      onChange({
        ...image,
        altText: value || undefined,
      });
    }
  };

  const handleImageError = () => {
    setHasError(true);
  };

  const handleImageLoad = () => {
    setHasError(false);
  };

  // Render preview
  const renderPreview = () => {
    if (!image?.path) {
      return (
        <div className={styles.placeholderPreview}>
          <Image24Regular />
        </div>
      );
    }

    if (hasError) {
      return (
        <div className={styles.errorPreview}>
          <Warning24Regular />
          <Text size={100}>Image not found</Text>
        </div>
      );
    }

    return (
      <img
        src={image.path}
        alt={image.altText || label}
        className={styles.imagePreview}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    );
  };

  return (
    <div className={styles.container}>
      <Text weight="semibold">{label}</Text>
      <div className={styles.previewContainer}>
        {renderPreview()}
        <div className={styles.fieldsContainer}>
          <Field label="Image Path">
            <ImagePicker
              value={image?.path || ""}
              onChange={handlePathChange}
              placeholder="/img/..."
            />
          </Field>
          <Field label="Alt Text">
            <Input
              value={image?.altText || ""}
              onChange={(e, data) => handleAltTextChange(data.value)}
              placeholder="Image description for accessibility"
              disabled={!image?.path}
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

export default ImageField;
