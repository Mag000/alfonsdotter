import { IImage } from "./IImage";

export interface IGalleryItem {
  title?: string;
  description?: string;
  thumbnail?: IImage;
  image?: IImage;
  variants?: IGalleryItem[];
}
