import { IGalleryItem } from "./IGalleryItem";
import { IImage } from "./IImage";
import { IShopItem } from "./IShopItem";

export interface INavSection {
  navTitle?: string;
  navText?: string;
  logoImage?: IImage;
}

export interface ILeadSection {
  leadImage?: IImage;
}

export interface IMailFormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required?: boolean;
}

export interface IMailFormSubmitAction {
  endpoint: string;
  method: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface IMailForm {
  fields: IMailFormField[];
  submitAction: IMailFormSubmitAction;
}

export interface IContentColumn {
  width?: number;
  headline?: string;
  text?: string;
  image?: IImage;
  mailForm?: IMailForm;
}

export interface IContentSection {
  headline?: string;
  text?: string;
  columns?: IContentColumn[];
  galleryItems?: IGalleryItem[];
  shopItems?: IShopItem[];
  contactForm?: boolean;
  mailForm?: IMailForm;
}

export interface IBottomSection {
  image?: IImage;
  title?: string;
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface ICarouselItem {
  path: string;
  title?: string;
  altText?: string;
}

export interface ICarouselSection {
  items?: ICarouselItem[];
}

export interface ICard {
  image?: IImage;
  title?: string;
  teaser?: string;
  longText?: string;
  infoSection?: IInfoSection;
}

export interface ICardSection {
  cards: ICard[];
}

export interface IInfoItem {
  text?: string;
  image?: IImage;
}

export interface IInfoSection {
  items: IInfoItem[];
}

export type SectionType =
  | "leadSection"
  | "contentSection"
  | "cardSection"
  | "carouselSection"
  | "bottomSection"
  | "infoSection";

export interface IPage {
  navSection?: INavSection;
  leadSection?: ILeadSection;
  contentSection?: IContentSection;
  carouselSection?: ICarouselSection;
  cardSection?: ICardSection;
  infoSection?: IInfoSection;
  /** @deprecated use bottomSections */
  bottomSection?: IBottomSection;
  bottomSections?: IBottomSection[];
  menuItems?: IPage[];
  sectionOrder?: SectionType[];
  hiddenSections?: SectionType[];
}

export interface ISiteSettings {
  instagramUrl?: string;
  contactEmail?: string;
  footerCopyright?: string;
}

export interface IPagesData {
  pages: IPage[];
  siteSettings: ISiteSettings;
}
