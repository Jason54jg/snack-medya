"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConfiguratorState } from "@/lib/store/configurator";

export type CartLine = {
  id: string;
  title: string;
  detail: string;
  price: number;
  config: ConfiguratorState;
};

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "id">) => void;
  removeLine: (id: string) => void;
  clear: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addLine: (line) =>
        set((s) => ({
          lines: [
            ...s.lines,
            { ...line, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
          ],
        })),

      removeLine: (id) =>
        set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),

      clear: () => set({ lines: [] }),

      total: () =>
        Math.round(
          get().lines.reduce((sum, l) => sum + l.price, 0) * 100,
        ) / 100,
    }),
    { name: "snack-medya-cart" },
  ),
);
