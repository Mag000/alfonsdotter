import { IShopItem } from "./IShopItem";

export interface ICartEntry {
  /** Unique key: `${item.path}|${variant?.path ?? ''}` */
  key: string;
  item: IShopItem;
  /** Selected variant, if the item has variants */
  variant?: IShopItem;
  quantity: number;
  /** null means "contact for pricing" */
  unitPrice: number | null;
}
