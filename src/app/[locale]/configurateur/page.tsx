import { ClientHashRedirect } from "@/components/ui/ClientHashRedirect";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function ConfiguratorRedirect({ searchParams }: Props) {
  const { product } = await searchParams;
  const query = product ? `product=${encodeURIComponent(product)}` : "";
  return <ClientHashRedirect hash="menu" query={query} />;
}
