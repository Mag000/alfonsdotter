import { IImage } from "../model/IImage";
import { IPage } from "../model/IPage";

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
  getPages: async (): Promise<IPage[]> => {
    const pages = await fetch("pages.json");
    return pages.json();
  },
  // getPage: (name: string) => {
  //   return pages.find((p) => p.navTitle == name);
  // },
};
