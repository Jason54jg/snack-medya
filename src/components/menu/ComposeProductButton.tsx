"use client";

import {
  useConfiguratorStore,
  type ConfigMode,
} from "@/lib/store/configurator";
import type { MenuCategoryId } from "@/data/menu";

type Props = {
  productId: string;
  category: MenuCategoryId;
  label: string;
  className?: string;
};

export function ComposeProductButton({
  productId,
  category,
  label,
  className,
}: Props) {
  const selectFromCatalog = useConfiguratorStore((s) => s.selectFromCatalog);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        selectFromCatalog(category as ConfigMode, productId);
        const url = new URL(window.location.href);
        url.searchParams.set("product", productId);
        url.hash = "menu";
        window.history.replaceState(null, "", url.toString());
        document.getElementById("menu")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      {label}
    </button>
  );
}
