import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ComposerSection } from "@/components/home/ComposerSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { HashScroll } from "@/components/ui/HashScroll";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HashScroll />
      <section id="accueil" className="scroll-mt-20">
        <Hero />
      </section>
      <section id="best-sellers" className="scroll-mt-20">
        <FeaturedProducts />
      </section>
      <section id="menu" className="scroll-mt-20">
        <ComposerSection />
      </section>
      <section id="avis" className="scroll-mt-20">
        <ReviewsSection />
      </section>
      <section id="contact" className="scroll-mt-20">
        <ContactSection />
      </section>
    </>
  );
}
