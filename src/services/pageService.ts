import { IGalleryItem } from "../model/IGalleryItem";
import { IImage } from "../model/IImage";
import { IPage, IPagesData, ISiteSettings } from "../model/IPage";
import { IShopItem } from "../model/IShopItem";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ""); // e.g. "/dist"

// Image paths in pages.json are root-relative (/img/...) so they are
// independent of the app's base path and the server deploy folder.
const prefixPath = (path: string): string => path;

const prefixImage = (img?: IImage): IImage | undefined =>
  img ? { ...img, path: prefixPath(img.path) } : undefined;

const prefixGalleryItem = (item: IGalleryItem): IGalleryItem => ({
  ...item,
  path: prefixPath(item.path),
  variants: item.variants?.map(prefixGalleryItem),
});

const prefixShopItem = (item: IShopItem): IShopItem => ({
  ...item,
  path: prefixPath(item.path),
  subItems: item.subItems?.map((s) => ({ ...s, path: prefixPath(s.path) })),
});

const prefixPagePaths = (page: IPage): IPage => ({
  ...page,
  navSection: page.navSection
    ? { ...page.navSection, logoImage: prefixImage(page.navSection.logoImage) }
    : undefined,
  leadSection: page.leadSection
    ? {
        ...page.leadSection,
        leadImage: prefixImage(page.leadSection.leadImage),
      }
    : undefined,
  contentSection: page.contentSection
    ? {
        ...page.contentSection,
        galleryItems: page.contentSection.galleryItems?.map(prefixGalleryItem),
        shopItems: page.contentSection.shopItems?.map(prefixShopItem),
      }
    : undefined,
  bottomSection: page.bottomSection
    ? { ...page.bottomSection, image: prefixImage(page.bottomSection.image) }
    : undefined,
});

const getImageGallery = (folderName: string): IImage[] => {
  const images: IImage[] = [];
  for (let n = 1; n <= 22; n++) {
    // Changed n<22 to n <= 22 for inclusiveness
    images.push({
      path: `img/${folderName}/Arg_beskuren.jpg`, // Fixed string interpolation
      altText: "My nice photo",
    });
  }
  return images;
};

export const pageService = {
  getPagesData: async (): Promise<IPagesData> => {
    const res = await fetch("/pages.json");
    const raw: IPage[] | IPagesData = await res.json();
    // Backward compatible: support legacy format (plain IPage[]) and new wrapped format
    const pages = Array.isArray(raw) ? raw : (raw.pages ?? []);
    const siteSettings = Array.isArray(raw) ? {} : (raw.siteSettings ?? {});
    return {
      siteSettings,
      pages: pages.map(prefixPagePaths),
    };
  },
  getPages: async (): Promise<IPage[]> => {
    const data = await pageService.getPagesData();
    return data.pages;
  },
  getSiteSettings: async (): Promise<ISiteSettings> => {
    const data = await pageService.getPagesData();
    return data.siteSettings;
  },
  // getPage: (name: string) => {
  //   return pages.find((p) => p.navTitle == name);
  // },
};
