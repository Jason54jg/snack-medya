import { setRequestLocale } from "next-intl/server";
import { ClientHashRedirect } from "@/components/ui/ClientHashRedirect";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactRedirect({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ClientHashRedirect hash="contact" />;
}
