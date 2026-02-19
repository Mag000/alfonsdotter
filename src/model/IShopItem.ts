import { IImage } from "./IImage";

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
  /** Product variants */
  variants?: IShopItem[];
}
