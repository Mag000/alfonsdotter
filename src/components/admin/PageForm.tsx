import {
  Badge,
  Button,
  Card,
  CardHeader,
  Divider,
  Field,
  Input,
  makeStyles,
  Text,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import {
  Add24Regular,
  ArrowDown24Regular,
  ArrowUp24Regular,
  Delete24Regular,
  Document24Regular,
  ErrorCircle16Regular,
  Eye24Regular,
  EyeOff24Regular,
  Warning16Regular,
} from "@fluentui/react-icons";
import React, { useCallback } from "react";
import { IValidationError } from "../../model/IEditorState";
import { IGalleryItem } from "../../model/IGalleryItem";
import { IImage } from "../../model/IImage";
import {
  IBottomSection,
  ICard,
  ICarouselItem,
  IContentColumn,
  IContentSection,
  IInfoItem,
  IInfoSection,
  ILeadSection,
  INavSection,
  IPage,
  SectionType,
} from "../../model/IPage";
import { IShopItem } from "../../model/IShopItem";
import { GalleryEditor } from "./GalleryEditor";
import { ImageField } from "./ImageField";
import { ImagePicker } from "./ImagePicker";
import { MenuEditor } from "./MenuEditor";
import { ShopEditor } from "./ShopEditor";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
    maxWidth: "800px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
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
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingHorizontalM,
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  validationErrors: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalM,
  },
  errorItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorPaletteRedBackground1,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
  },
  warningItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
  },
  sectionPanel: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  sectionPanelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
  },
  sectionPanelControls: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexShrink: "0",
  },
  addSectionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
  },
  cardItemPanel: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
  },
  cardItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const SECTION_LABELS: Record<SectionType, string> = {
  leadSection: "Toppbild",
  contentSection: "Innehåll",
  cardSection: "Kort",
  carouselSection: "Bildkarusell",
  bottomSection: "Bottensektion",
  infoSection: "Infosektion",
};

const ALL_SECTIONS: SectionType[] = [
  "leadSection",
  "contentSection",
  "cardSection",
  "carouselSection",
  "infoSection",
  "bottomSection",
];

const inferSectionOrder = (page: IPage): SectionType[] =>
  ALL_SECTIONS.filter((type) => {
    switch (type) {
      case "leadSection":
        return !!page.leadSection?.leadImage;
      case "contentSection":
        return !!(
          page.contentSection?.headline ||
          page.contentSection?.text ||
          (page.contentSection?.columns?.length ?? 0) > 0 ||
          (page.contentSection?.galleryItems?.length ?? 0) > 0 ||
          (page.contentSection?.shopItems?.length ?? 0) > 0
        );
      case "cardSection":
        return (page.cardSection?.cards.length ?? 0) > 0;
      case "carouselSection":
        return (page.carouselSection?.items?.length ?? 0) > 0;
      case "infoSection":
        return (page.infoSection?.items?.length ?? 0) > 0;
      case "bottomSection":
        return (
          page.bottomSections ??
          (page.bottomSection ? [page.bottomSection] : [])
        ).some((s) => s.image || s.text);
      default:
        return false;
    }
  });

interface IPageFormProps {
  page: IPage;
  pageIndex: number;
  onChange: (updatedPage: IPage) => void;
  validationErrors: IValidationError[];
}

export const PageForm: React.FC<IPageFormProps> = ({
  page,
  pageIndex,
  onChange,
  validationErrors,
}) => {
  const styles = useStyles();

  // Get validation state for a specific field
  const getFieldValidation = (field: string) => {
    const error = validationErrors.find((e) => e.field === field);
    return error
      ? {
          validationState:
            error.severity === "error"
              ? ("error" as const)
              : ("warning" as const),
          validationMessage: error.message,
        }
      : {};
  };

  // Handle field change
  const handleChange = useCallback(
    <K extends keyof IPage>(field: K, value: IPage[K]) => {
      onChange({ ...page, [field]: value });
    },
    [page, onChange],
  );

  const handleNavChange = useCallback(
    <K extends keyof INavSection>(field: K, value: INavSection[K]) => {
      onChange({ ...page, navSection: { ...page.navSection, [field]: value } });
    },
    [page, onChange],
  );

  const handleLeadChange = useCallback(
    <K extends keyof ILeadSection>(field: K, value: ILeadSection[K]) => {
      onChange({
        ...page,
        leadSection: { ...(page.leadSection ?? {}), [field]: value },
      });
    },
    [page, onChange],
  );

  const handleContentChange = useCallback(
    <K extends keyof IContentSection>(field: K, value: IContentSection[K]) => {
      onChange({
        ...page,
        contentSection: { ...(page.contentSection ?? {}), [field]: value },
      });
    },
    [page, onChange],
  );

  const handleBottomSectionChange = useCallback(
    <K extends keyof IBottomSection>(
      idx: number,
      field: K,
      value: IBottomSection[K],
    ) => {
      const sections = [
        ...(page.bottomSections ??
          (page.bottomSection ? [page.bottomSection] : [{}])),
      ];
      sections[idx] = { ...sections[idx], [field]: value };
      onChange({ ...page, bottomSections: sections, bottomSection: undefined });
    },
    [page, onChange],
  );

  const handleAddBottomSection = useCallback(() => {
    const sections = [
      ...(page.bottomSections ??
        (page.bottomSection ? [page.bottomSection] : [{}])),
      {},
    ];
    onChange({ ...page, bottomSections: sections, bottomSection: undefined });
  }, [page, onChange]);

  const handleRemoveBottomSection = useCallback(
    (idx: number) => {
      const sections = (
        page.bottomSections ?? (page.bottomSection ? [page.bottomSection] : [])
      ).filter((_, i) => i !== idx);
      onChange({
        ...page,
        bottomSections: sections.length ? sections : undefined,
        bottomSection: undefined,
      });
    },
    [page, onChange],
  );

  const handleCardChange = useCallback(
    <K extends keyof ICard>(cardIndex: number, field: K, value: ICard[K]) => {
      const cards = [...(page.cardSection?.cards ?? [])];
      cards[cardIndex] = { ...cards[cardIndex], [field]: value };
      onChange({ ...page, cardSection: { cards } });
    },
    [page, onChange],
  );

  const handleAddCard = useCallback(() => {
    const cards = [...(page.cardSection?.cards ?? []), {}];
    onChange({ ...page, cardSection: { cards } });
  }, [page, onChange]);

  const handleRemoveCard = useCallback(
    (cardIndex: number) => {
      const cards = (page.cardSection?.cards ?? []).filter(
        (_, i) => i !== cardIndex,
      );
      onChange({ ...page, cardSection: { cards } });
    },
    [page, onChange],
  );

  const handleCarouselItemChange = useCallback(
    <K extends keyof ICarouselItem>(
      itemIndex: number,
      field: K,
      value: ICarouselItem[K],
    ) => {
      const items = [...(page.carouselSection?.items ?? [])];
      items[itemIndex] = {
        ...items[itemIndex],
        [field]: value,
      } as ICarouselItem;
      onChange({
        ...page,
        carouselSection: { ...page.carouselSection, items },
      });
    },
    [page, onChange],
  );

  const handleAddCarouselItem = useCallback(() => {
    const items: ICarouselItem[] = [
      ...(page.carouselSection?.items ?? []),
      { path: "" },
    ];
    onChange({ ...page, carouselSection: { ...page.carouselSection, items } });
  }, [page, onChange]);

  const handleRemoveCarouselItem = useCallback(
    (itemIndex: number) => {
      const items = (page.carouselSection?.items ?? []).filter(
        (_, i) => i !== itemIndex,
      );
      onChange({
        ...page,
        carouselSection: { ...page.carouselSection, items },
      });
    },
    [page, onChange],
  );

  const handleInfoItemChange = useCallback(
    <K extends keyof IInfoItem>(
      itemIndex: number,
      field: K,
      value: IInfoItem[K],
    ) => {
      const items = [...(page.infoSection?.items ?? [])];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      onChange({ ...page, infoSection: { items } });
    },
    [page, onChange],
  );

  const handleAddInfoItem = useCallback(() => {
    const items: IInfoItem[] = [...(page.infoSection?.items ?? []), {}];
    onChange({ ...page, infoSection: { items } });
  }, [page, onChange]);

  const handleRemoveInfoItem = useCallback(
    (itemIndex: number) => {
      const items = (page.infoSection?.items ?? []).filter(
        (_, i) => i !== itemIndex,
      );
      onChange({ ...page, infoSection: { items } });
    },
    [page, onChange],
  );

  const handleCardInfoItemChange = useCallback(
    <K extends keyof IInfoItem>(
      cardIndex: number,
      itemIndex: number,
      field: K,
      value: IInfoItem[K],
    ) => {
      const cards = [...(page.cardSection?.cards ?? [])];
      const items = [...(cards[cardIndex].infoSection?.items ?? [])];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      cards[cardIndex] = {
        ...cards[cardIndex],
        infoSection: { items } as IInfoSection,
      };
      onChange({ ...page, cardSection: { cards } });
    },
    [page, onChange],
  );

  const handleAddCardInfoItem = useCallback(
    (cardIndex: number) => {
      const cards = [...(page.cardSection?.cards ?? [])];
      const items: IInfoItem[] = [
        ...(cards[cardIndex].infoSection?.items ?? []),
        {},
      ];
      cards[cardIndex] = {
        ...cards[cardIndex],
        infoSection: { items } as IInfoSection,
      };
      onChange({ ...page, cardSection: { cards } });
    },
    [page, onChange],
  );

  const handleRemoveCardInfoItem = useCallback(
    (cardIndex: number, itemIndex: number) => {
      const cards = [...(page.cardSection?.cards ?? [])];
      const items = (cards[cardIndex].infoSection?.items ?? []).filter(
        (_, i) => i !== itemIndex,
      );
      cards[cardIndex] = {
        ...cards[cardIndex],
        infoSection: { items } as IInfoSection,
      };
      onChange({ ...page, cardSection: { cards } });
    },
    [page, onChange],
  );

  const handleColumnChange = useCallback(
    <K extends keyof IContentColumn>(
      colIndex: number,
      field: K,
      value: IContentColumn[K],
    ) => {
      const columns = [...(page.contentSection?.columns ?? [])];
      columns[colIndex] = { ...columns[colIndex], [field]: value };
      handleContentChange("columns", columns);
    },
    [page, handleContentChange],
  );

  const handleAddColumn = useCallback(() => {
    const columns: IContentColumn[] = [
      ...(page.contentSection?.columns ?? []),
      { width: 50 },
    ];
    handleContentChange("columns", columns);
  }, [page, handleContentChange]);

  const handleRemoveColumn = useCallback(
    (colIndex: number) => {
      const columns = (page.contentSection?.columns ?? []).filter(
        (_, i) => i !== colIndex,
      );
      handleContentChange("columns", columns);
    },
    [page, handleContentChange],
  );

  // Section ordering
  const effectiveOrder = page.sectionOrder ?? inferSectionOrder(page);

  const handleAddSection = useCallback(
    (type: SectionType) => {
      const newOrder = [...effectiveOrder, type];
      const update: Partial<IPage> = { sectionOrder: newOrder };
      if (type === "leadSection" && !page.leadSection) update.leadSection = {};
      if (type === "contentSection" && !page.contentSection)
        update.contentSection = {};
      if (type === "cardSection" && !page.cardSection)
        update.cardSection = { cards: [] };
      if (type === "carouselSection" && !page.carouselSection)
        update.carouselSection = { items: [] };
      if (type === "infoSection" && !page.infoSection)
        update.infoSection = { items: [] };
      if (type === "bottomSection" && !page.bottomSections?.length)
        update.bottomSections = [{}];
      onChange({ ...page, ...update });
    },
    [page, onChange, effectiveOrder],
  );

  const handleRemoveSection = useCallback(
    (type: SectionType) => {
      const newOrder = effectiveOrder.filter((t) => t !== type);
      const update: Partial<IPage> = { sectionOrder: newOrder };
      switch (type) {
        case "leadSection":
          update.leadSection = undefined;
          break;
        case "contentSection":
          update.contentSection = undefined;
          break;
        case "cardSection":
          update.cardSection = undefined;
          break;
        case "carouselSection":
          update.carouselSection = undefined;
          break;
        case "infoSection":
          update.infoSection = undefined;
          break;
        case "bottomSection":
          update.bottomSections = undefined;
          (update as Partial<IPage>).bottomSection = undefined;
          break;
      }
      onChange({ ...page, ...update });
    },
    [page, onChange, effectiveOrder],
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newOrder = [...effectiveOrder];
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1],
      ];
      onChange({ ...page, sectionOrder: newOrder });
    },
    [page, onChange, effectiveOrder],
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === effectiveOrder.length - 1) return;
      const newOrder = [...effectiveOrder];
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
      onChange({ ...page, sectionOrder: newOrder });
    },
    [page, onChange, effectiveOrder],
  );

  const availableSections = ALL_SECTIONS.filter(
    (t) => !effectiveOrder.includes(t),
  );

  const hiddenSections = page.hiddenSections ?? [];
  const isSectionHidden = (type: SectionType) => hiddenSections.includes(type);

  const handleToggleVisibility = useCallback(
    (type: SectionType) => {
      const hidden = page.hiddenSections ?? [];
      const next = hidden.includes(type)
        ? hidden.filter((t) => t !== type)
        : [...hidden, type];
      onChange({ ...page, hiddenSections: next.length ? next : undefined });
    },
    [page, onChange],
  );

  const renderSectionEditor = (type: SectionType) => {
    switch (type) {
      case "leadSection":
        return (
          <ImageField
            label="Toppbild"
            image={page.leadSection?.leadImage}
            onChange={(image: IImage | undefined) =>
              handleLeadChange("leadImage", image)
            }
          />
        );
      case "contentSection":
        return (
          <>
            <div className={styles.fieldGroup}>
              <Field label="Rubrik" className={styles.fullWidth}>
                <Input
                  value={page.contentSection?.headline || ""}
                  onChange={(e, data) =>
                    handleContentChange("headline", data.value)
                  }
                  placeholder="Sidans rubrik"
                />
              </Field>
              <Field label="Brödtext" className={styles.fullWidth}>
                <Textarea
                  value={page.contentSection?.text || ""}
                  onChange={(e, data) =>
                    handleContentChange("text", data.value)
                  }
                  placeholder="Sidans text. Tryck Enter för radbrytningar."
                  resize="vertical"
                  rows={10}
                />
              </Field>
            </div>
            <Divider />
            <Text weight="semibold">Kolumner</Text>
            {(page.contentSection?.columns ?? []).map((col, i) => (
              <div key={i} className={styles.cardItemPanel}>
                <div className={styles.cardItemHeader}>
                  <Text weight="semibold">Kolumn {i + 1}</Text>
                  <Button
                    appearance="subtle"
                    icon={<Delete24Regular />}
                    size="small"
                    onClick={() => handleRemoveColumn(i)}
                    aria-label="Ta bort kolumn"
                  />
                </div>
                <Field label="Bredd (%)">
                  <Input
                    type="number"
                    value={col.width != null ? String(col.width) : ""}
                    onChange={(e, data) =>
                      handleColumnChange(
                        i,
                        "width",
                        data.value !== "" ? Number(data.value) : undefined,
                      )
                    }
                    placeholder="50"
                  />
                </Field>
                <Field label="Rubrik">
                  <Input
                    value={col.headline || ""}
                    onChange={(e, data) =>
                      handleColumnChange(i, "headline", data.value)
                    }
                  />
                </Field>
                <Field label="Text">
                  <Textarea
                    value={col.text || ""}
                    onChange={(e, data) =>
                      handleColumnChange(i, "text", data.value)
                    }
                    rows={5}
                    resize="vertical"
                  />
                </Field>
                <ImageField
                  label="Bild"
                  image={col.image}
                  onChange={(image: IImage | undefined) =>
                    handleColumnChange(i, "image", image)
                  }
                />
              </div>
            ))}
            <Button
              appearance="outline"
              icon={<Add24Regular />}
              size="small"
              onClick={handleAddColumn}
            >
              Lägg till kolumn
            </Button>
            <Divider />
            <GalleryEditor
              items={page.contentSection?.galleryItems || []}
              onChange={(items: IGalleryItem[]) =>
                handleContentChange("galleryItems", items)
              }
            />
            <ShopEditor
              items={page.contentSection?.shopItems || []}
              onChange={(items: IShopItem[]) =>
                handleContentChange("shopItems", items)
              }
            />
          </>
        );
      case "cardSection":
        return (
          <div className={styles.section}>
            {(page.cardSection?.cards ?? []).map((card, i) => (
              <div key={i} className={styles.cardItemPanel}>
                <div className={styles.cardItemHeader}>
                  <Text weight="semibold">Kort {i + 1}</Text>
                  <Button
                    appearance="subtle"
                    icon={<Delete24Regular />}
                    size="small"
                    onClick={() => handleRemoveCard(i)}
                    aria-label="Ta bort kort"
                  />
                </div>
                <ImageField
                  label="Bild"
                  image={card.image}
                  onChange={(image: IImage | undefined) =>
                    handleCardChange(i, "image", image)
                  }
                />
                <Field label="Titel">
                  <Input
                    value={card.title || ""}
                    onChange={(e, data) =>
                      handleCardChange(i, "title", data.value)
                    }
                  />
                </Field>
                <Field label="Ingress">
                  <Textarea
                    value={card.teaser || ""}
                    onChange={(e, data) =>
                      handleCardChange(i, "teaser", data.value)
                    }
                    rows={3}
                    resize="vertical"
                  />
                </Field>
                <Field label="Lång text">
                  <Textarea
                    value={card.longText || ""}
                    onChange={(e, data) =>
                      handleCardChange(i, "longText", data.value)
                    }
                    rows={5}
                    resize="vertical"
                  />
                </Field>
                <Text weight="semibold" size={200}>
                  Infoobjekt
                </Text>
                {(card.infoSection?.items ?? []).map((item, j) => (
                  <div key={j} className={styles.cardItemPanel}>
                    <div className={styles.cardItemHeader}>
                      <Text weight="semibold">Objekt {j + 1}</Text>
                      <Button
                        appearance="subtle"
                        icon={<Delete24Regular />}
                        size="small"
                        onClick={() => handleRemoveCardInfoItem(i, j)}
                        aria-label="Ta bort objekt"
                      />
                    </div>
                    <ImageField
                      label="Bild"
                      image={item.image}
                      onChange={(image: IImage | undefined) =>
                        handleCardInfoItemChange(i, j, "image", image)
                      }
                    />
                    <Field label="Text">
                      <Textarea
                        value={item.text || ""}
                        onChange={(e, data) =>
                          handleCardInfoItemChange(i, j, "text", data.value)
                        }
                        rows={2}
                        resize="vertical"
                      />
                    </Field>
                  </div>
                ))}
                <Button
                  appearance="outline"
                  icon={<Add24Regular />}
                  size="small"
                  onClick={() => handleAddCardInfoItem(i)}
                >
                  Lägg till infoobjekt
                </Button>
              </div>
            ))}
            <Button
              appearance="outline"
              icon={<Add24Regular />}
              size="small"
              onClick={handleAddCard}
            >
              Lägg till kort
            </Button>
          </div>
        );
      case "carouselSection":
        return (
          <div className={styles.section}>
            {(page.carouselSection?.items ?? []).map((item, i) => (
              <div key={i} className={styles.cardItemPanel}>
                <div className={styles.cardItemHeader}>
                  <Text weight="semibold">Bild {i + 1}</Text>
                  <Button
                    appearance="subtle"
                    icon={<Delete24Regular />}
                    size="small"
                    onClick={() => handleRemoveCarouselItem(i)}
                    aria-label="Ta bort bild"
                  />
                </div>
                <Field label="Sökväg">
                  <ImagePicker
                    value={item.path}
                    onChange={(value) =>
                      handleCarouselItemChange(i, "path", value)
                    }
                    placeholder="/img/mapp/bild.webp"
                  />
                </Field>
                <Field label="Titel">
                  <Input
                    value={item.title || ""}
                    onChange={(e, data) =>
                      handleCarouselItemChange(i, "title", data.value)
                    }
                  />
                </Field>
                <Field label="Alt-text">
                  <Input
                    value={item.altText || ""}
                    onChange={(e, data) =>
                      handleCarouselItemChange(i, "altText", data.value)
                    }
                  />
                </Field>
              </div>
            ))}
            <Button
              appearance="outline"
              icon={<Add24Regular />}
              size="small"
              onClick={handleAddCarouselItem}
            >
              Lägg till bild
            </Button>
          </div>
        );
      case "infoSection":
        return (
          <div className={styles.section}>
            {(page.infoSection?.items ?? []).map((item, i) => (
              <div key={i} className={styles.cardItemPanel}>
                <div className={styles.cardItemHeader}>
                  <Text weight="semibold">Objekt {i + 1}</Text>
                  <Button
                    appearance="subtle"
                    icon={<Delete24Regular />}
                    size="small"
                    onClick={() => handleRemoveInfoItem(i)}
                    aria-label="Ta bort objekt"
                  />
                </div>
                <ImageField
                  label="Bild"
                  image={item.image}
                  onChange={(image: IImage | undefined) =>
                    handleInfoItemChange(i, "image", image)
                  }
                />
                <Field label="Text">
                  <Textarea
                    value={item.text || ""}
                    onChange={(e, data) =>
                      handleInfoItemChange(i, "text", data.value)
                    }
                    rows={3}
                    resize="vertical"
                  />
                </Field>
              </div>
            ))}
            <Button
              appearance="outline"
              icon={<Add24Regular />}
              size="small"
              onClick={handleAddInfoItem}
            >
              Lägg till objekt
            </Button>
          </div>
        );
      case "bottomSection": {
        const bSections =
          page.bottomSections ??
          (page.bottomSection ? [page.bottomSection] : [{}]);
        return (
          <>
            {bSections.map((bs, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  padding: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Text weight="semibold" size={200}>
                    Bottensektion {bSections.length > 1 ? idx + 1 : ""}
                  </Text>
                  {bSections.length > 1 && (
                    <Button
                      appearance="subtle"
                      icon={<Delete24Regular />}
                      size="small"
                      onClick={() => handleRemoveBottomSection(idx)}
                      aria-label="Ta bort"
                    />
                  )}
                </div>
                <ImageField
                  label="Bild"
                  image={bs.image}
                  onChange={(image: IImage | undefined) =>
                    handleBottomSectionChange(idx, "image", image)
                  }
                />
                <Field label="Titel">
                  <Input
                    value={bs.title || ""}
                    onChange={(e, data) =>
                      handleBottomSectionChange(idx, "title", data.value)
                    }
                  />
                </Field>
                <Field label="Text">
                  <Textarea
                    value={bs.text || ""}
                    onChange={(e, data) =>
                      handleBottomSectionChange(idx, "text", data.value)
                    }
                    rows={5}
                    resize="vertical"
                  />
                </Field>
                <Field label="Knapptext">
                  <Input
                    value={bs.buttonText || ""}
                    onChange={(e, data) =>
                      handleBottomSectionChange(idx, "buttonText", data.value)
                    }
                    placeholder="T.ex. Läs mer"
                  />
                </Field>
                <Field label="Knapplänk (URL)">
                  <Input
                    value={bs.buttonUrl || ""}
                    onChange={(e, data) =>
                      handleBottomSectionChange(idx, "buttonUrl", data.value)
                    }
                    placeholder="https://..."
                  />
                </Field>
              </div>
            ))}
            <Button
              appearance="outline"
              icon={<Add24Regular />}
              size="small"
              onClick={handleAddBottomSection}
            >
              Lägg till bottensektion
            </Button>
          </>
        );
      }
      default:
        return null;
    }
  };

  // Separate errors and warnings
  const errors = validationErrors.filter((e) => e.severity === "error");
  const warnings = validationErrors.filter((e) => e.severity === "warning");

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card>
        <CardHeader
          header={
            <div className={styles.header}>
              <Document24Regular />
              <Text weight="semibold" size={500}>
                {page.navSection?.navText || page.navSection?.navTitle}
              </Text>
              {errors.length > 0 && (
                <Badge color="danger" size="small">
                  {errors.length} error{errors.length !== 1 ? "s" : ""}
                </Badge>
              )}
              {warnings.length > 0 && (
                <Badge color="warning" size="small">
                  {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          }
        />
      </Card>

      {/* Validation summary */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className={styles.validationErrors}>
          {errors.map((error, i) => (
            <div key={`error-${i}`} className={styles.errorItem}>
              <ErrorCircle16Regular />
              <Text>
                {error.field}: {error.message}
              </Text>
            </div>
          ))}
          {warnings.map((warning, i) => (
            <div key={`warning-${i}`} className={styles.warningItem}>
              <Warning16Regular />
              <Text>
                {warning.field}: {warning.message}
              </Text>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Section */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Navigation</Text>
        <div className={styles.fieldGroup}>
          <Field
            label="Navigation Title (Route)"
            required
            {...getFieldValidation("navTitle")}
          >
            <Input
              value={page.navSection?.navTitle || ""}
              onChange={(e, data) => handleNavChange("navTitle", data.value)}
              placeholder="/path/to/page"
            />
          </Field>

          <Field label="Navigation Text">
            <Input
              value={page.navSection?.navText || ""}
              onChange={(e, data) => handleNavChange("navText", data.value)}
              placeholder="Menu display text"
            />
          </Field>
        </div>
        <ImageField
          label="Logotyp"
          image={page.navSection?.logoImage}
          onChange={(image: IImage | undefined) =>
            handleNavChange("logoImage", image)
          }
        />
      </div>

      <Divider />

      {/* Ordered sections */}
      {effectiveOrder.map((type, index) => (
        <React.Fragment key={type}>
          <div
            className={styles.sectionPanel}
            style={isSectionHidden(type) ? { opacity: 0.45 } : undefined}
          >
            <div className={styles.sectionPanelHeader}>
              <Text className={styles.sectionTitle}>
                {SECTION_LABELS[type]}
                {isSectionHidden(type) && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "0.75em",
                      color: "#999",
                      fontWeight: 400,
                    }}
                  >
                    (dold)
                  </span>
                )}
              </Text>
              <div className={styles.sectionPanelControls}>
                <Button
                  appearance="subtle"
                  icon={
                    isSectionHidden(type) ? (
                      <EyeOff24Regular />
                    ) : (
                      <Eye24Regular />
                    )
                  }
                  size="small"
                  onClick={() => handleToggleVisibility(type)}
                  aria-label={
                    isSectionHidden(type) ? "Visa sektion" : "Dölj sektion"
                  }
                />
                <Button
                  appearance="subtle"
                  icon={<ArrowUp24Regular />}
                  size="small"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  aria-label="Flytta upp"
                />
                <Button
                  appearance="subtle"
                  icon={<ArrowDown24Regular />}
                  size="small"
                  disabled={index === effectiveOrder.length - 1}
                  onClick={() => handleMoveDown(index)}
                  aria-label="Flytta ner"
                />
                <Button
                  appearance="subtle"
                  icon={<Delete24Regular />}
                  size="small"
                  onClick={() => handleRemoveSection(type)}
                  aria-label="Ta bort sektion"
                />
              </div>
            </div>
            {renderSectionEditor(type)}
          </div>
          {index < effectiveOrder.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      {/* Add section */}
      {availableSections.length > 0 && (
        <>
          <Divider />
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>Lägg till sektion</Text>
            <div className={styles.addSectionRow}>
              {availableSections.map((type) => (
                <Button
                  key={type}
                  appearance="outline"
                  icon={<Add24Regular />}
                  size="small"
                  onClick={() => handleAddSection(type)}
                >
                  {SECTION_LABELS[type]}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Menu Section */}
      <>
        <Divider />
        <div className={styles.section}>
          <MenuEditor
            items={page.menuItems || []}
            onChange={(items: IPage[]) => handleChange("menuItems", items)}
          />
        </div>
      </>
    </div>
  );
};

export default PageForm;
