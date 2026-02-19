import { IImage } from "./IImage";

export interface IGalleryItem {
  navTitle?: string;
  title?: string;
  tagLine?: string;
  description?: string;
  thumbnail?: IImage;
  variants?: IGalleryItem[];
  path: string;
  altText?: string;
  width?: number;
  height?: number;
}
