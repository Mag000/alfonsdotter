import { IGalleryItem } from "./IGalleryItem";
import { IImage } from "./IImage";
import { IShopItem } from "./IShopItem";

export interface IPage {
  navTitle: string;
  navText?: string;
  headline?: string;
  text?: string;
  logoImage?: IImage;
  leadImage?: IImage;
  contactForm?: boolean;
  galleryItems?: IGalleryItem[];
  shopItems?: IShopItem[];
  menuItems?: IPage[];
}
