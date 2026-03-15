import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ICartEntry } from "../model/ICartEntry";
import { IShopItem } from "../model/IShopItem";

const SESSION_KEY = "housecat_cart";

interface ICartContext {
  entries: ICartEntry[];
  itemCount: number;
  /** null when any entry has null unitPrice */
  total: number | null;
  addToCart: (item: IShopItem, variant?: IShopItem) => void;
  removeEntry: (key: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<ICartContext | null>(null);

function buildKey(item: IShopItem, variant?: IShopItem): string {
  return `${item.path}|${variant?.path ?? ""}`;
}

function resolvePrice(item: IShopItem, variant?: IShopItem): number | null {
  const src = variant ?? item;
  return src.price !== undefined ? src.price : null;
}

function loadFromSession(): ICartEntry[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as ICartEntry[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<ICartEntry[]>(loadFromSession);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(entries));
  }, [entries]);

  const addToCart = useCallback((item: IShopItem, variant?: IShopItem) => {
    const key = buildKey(item, variant);
    const unitPrice = resolvePrice(item, variant);
    setEntries((prev) => {
      const existing = prev.find((e) => e.key === key);
      if (existing) {
        return prev.map((e) =>
          e.key === key ? { ...e, quantity: e.quantity + 1 } : e,
        );
      }
      return [...prev, { key, item, variant, quantity: 1, unitPrice }];
    });
  }, []);

  const removeEntry = useCallback((key: string) => {
    setEntries((prev) => prev.filter((e) => e.key !== key));
  }, []);

  const clearCart = useCallback(() => setEntries([]), []);

  const itemCount = entries.reduce((sum, e) => sum + e.quantity, 0);
  const total = entries.some((e) => e.unitPrice === null)
    ? null
    : entries.reduce((sum, e) => sum + (e.unitPrice ?? 0) * e.quantity, 0);

  return (
    <CartContext.Provider
      value={{ entries, itemCount, total, addToCart, removeEntry, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): ICartContext {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
