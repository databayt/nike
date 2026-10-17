import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Favorite {
  productId: string;
  name: string;
  subtitle?: string;
  image: string;
  price: number;
  salePrice?: number;
  href: string;
}

interface FavoritesState {
  items: Favorite[];
  toggle: (item: Favorite) => void;
  remove: (productId: string) => void;
}

/** Browser-persisted favourites (the DB wishlist needs a signed-in user). Newest first. */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const has = get().items.some((i) => i.productId === item.productId);
        set({ items: has ? get().items.filter((i) => i.productId !== item.productId) : [item, ...get().items] });
      },
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
    }),
    { name: "favorites-storage" },
  ),
);
