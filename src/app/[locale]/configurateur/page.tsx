import { setRequestLocale } from "next-intl/server";
import { ClientHashRedirect } from "@/components/ui/ClientHashRedirect";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
};

export default async function ConfiguratorRedirect({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { product } = await searchParams;
  const query = product ? `product=${encodeURIComponent(product)}` : "";
  return <ClientHashRedirect hash="menu" query={query} />;
}
