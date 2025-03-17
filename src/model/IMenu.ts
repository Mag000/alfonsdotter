import { IPage } from "./IPage";

export interface IMenu {
  width: string;
  menuItems: IPage[];
  onCartClicked: () => void;
}
