import { IImage } from "./IImage";

export interface IShopItem {
  title?: string;
  description?: string;
  thumbnail?: IImage;
  image?: IImage;
  variants?: IShopItem[];
}
