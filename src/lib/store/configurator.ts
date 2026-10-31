"use client";

import { create } from "zustand";
import type { FormulaKey, MenuCategoryId } from "@/data/menu";
import { TACO_SIZES } from "@/data/menu";

export type ConfigMode =
  | "sandwiches"
  | "durums"
  | "tacos"
  | "burgers"
  | "assiettes"
  | "bowls"
  | "salades"
  | "enfant"
  | null;

export type ConfiguratorState = {
  mode: ConfigMode;
  productId: string | null;
  formula: FormulaKey | null;
  tacoSize: "S" | "M" | "L" | "XL" | null;
  meats: string[];
  sauces: string[];
  extras: string[];
  kidsTheme: "fille" | "garcon" | null;
  kidsMeat: string | null;
  step: number;
};

type Actions = {
  setMode: (mode: ConfigMode) => void;
  setProductId: (id: string) => void;
  selectFromCatalog: (mode: ConfigMode, productId: string) => void;
  setFormula: (formula: FormulaKey) => void;
  setTacoSize: (size: "S" | "M" | "L" | "XL") => void;
  toggleMeat: (id: string) => void;
  setMeats: (ids: string[]) => void;
  toggleSauce: (id: string) => void;
  toggleExtra: (id: string) => void;
  setKidsTheme: (theme: "fille" | "garcon") => void;
  setKidsMeat: (id: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  isComplete: () => boolean;
  maxMeats: () => number;
  needsMeatChoice: () => boolean;
};

const initial: ConfiguratorState = {
  mode: null,
  productId: null,
  formula: null,
  tacoSize: null,
  meats: [],
  sauces: [],
  extras: [],
  kidsTheme: null,
  kidsMeat: null,
  step: 0,
};

export const useConfiguratorStore = create<ConfiguratorState & Actions>(
  (set, get) => ({
    ...initial,

    setMode: (mode) =>
      set({
        ...initial,
        mode,
        step: 1,
      }),

    // Les viandes dépendent du produit (panini, salade…) : on repart de zéro
    setProductId: (id) => set({ productId: id, meats: [] }),

    selectFromCatalog: (mode, productId) =>
      set({
        ...initial,
        mode,
        productId,
        step: 2,
      }),

    setFormula: (formula) => set({ formula }),

    setTacoSize: (size) =>
      set({
        tacoSize: size,
        meats: [],
      }),

    toggleMeat: (id) => {
      const { meats, maxMeats } = get();
      const max = maxMeats();
      if (meats.includes(id)) {
        set({ meats: meats.filter((m) => m !== id) });
        return;
      }
      if (max === 1) {
        set({ meats: [id] });
        return;
      }
      if (meats.length >= max) return;
      set({ meats: [...meats, id] });
    },

    setMeats: (ids) => set({ meats: ids }),

    toggleSauce: (id) => {
      const { sauces } = get();
      if (sauces.includes(id)) {
        set({ sauces: sauces.filter((s) => s !== id) });
        return;
      }
      if (sauces.length >= 2) return;
      set({ sauces: [...sauces, id] });
    },

    toggleExtra: (id) => {
      const { extras } = get();
      set({
        extras: extras.includes(id)
          ? extras.filter((e) => e !== id)
          : [...extras, id],
      });
    },

    setKidsTheme: (theme) => set({ kidsTheme: theme }),
    setKidsMeat: (id) => set({ kidsMeat: id }),

    setStep: (step) => set({ step }),
    nextStep: () => set((s) => ({ step: s.step + 1 })),
    prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

    reset: () => set(initial),

    maxMeats: () => {
      const { mode, tacoSize } = get();
      if (mode === "tacos" && tacoSize) {
        return TACO_SIZES.find((s) => s.id === tacoSize)?.meats ?? 1;
      }
      return 1;
    },

    needsMeatChoice: () => {
      const { mode, productId } = get();
      if (mode === "tacos" || mode === "enfant") return true;
      if (mode === "burgers") return false;
      if (
        productId === "panini" ||
        productId === "americain"
      ) {
        return true;
      }
      return false;
    },

    isComplete: () => {
      const s = get();
      if (s.mode === "enfant") {
        return Boolean(s.kidsTheme && s.kidsMeat);
      }
      if (s.mode === "tacos") {
        const max = s.maxMeats();
        return Boolean(
          s.tacoSize && s.formula && s.meats.length === max,
        );
      }
      if (!s.mode || !s.productId || !s.formula) return false;
      if (s.needsMeatChoice() && s.meats.length === 0) return false;
      return true;
    },
  }),
);

export function modeToCategory(mode: ConfigMode): MenuCategoryId | null {
  if (!mode) return null;
  return mode;
}
