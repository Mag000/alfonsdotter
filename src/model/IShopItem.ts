import { IImage } from "./IImage";

export interface IShopVariant {
  /** Variant title, e.g. "A4 print" */
  title?: string;
  /** Price in SEK, null = "contact for pricing" */
  price?: number | null;
}

export interface IShopItem {
  /** Image path for the product (required) */
  path: string;
  /** Product title */
  title?: string;
  /** Product description */
  description?: string;
  /** Price in SEK, null = "contact for pricing" */
  price?: number | null;
  /** Thumbnail image */
  thumbnail?: IImage;
  /** Full-size image */
  image?: IImage;
  /** Additional images shown with prev/next arrows */
  subItems?: { path: string }[];
  /** Purchasable variants (size, format, etc.) — apply to the main image */
  variants?: IShopVariant[];
}
