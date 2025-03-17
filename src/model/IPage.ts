import { IImage } from "./IImage";

export interface IPage {
  navTitle: string;
  navText?: string;
  headline?: string;
  text?: string;
  logoImage?: IImage;
  leadImage?: IImage;
  contactForm?: boolean;
  galleryItems?: IImage[];
  menuItems?: IPage[];
}
