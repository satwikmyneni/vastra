import { useQuery } from "@tanstack/react-query";
import { fetchSettings, fetchCategories, fetchProducts } from "@/lib/api";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Index = () => {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar text={settings?.announcement_text} />
      <Header categories={categories} />
      <main>
        <HeroSection
          title={settings?.hero_title}
          subtitle={settings?.hero_subtitle}
          bannerUrl={settings?.hero_banner_url}
        />
        <CategoryGrid categories={categories} />
        <FeaturedProducts products={products} />
      </main>
      <Footer whatsappNumber={settings?.whatsapp_number} categories={categories} />
      <WhatsAppButton whatsappNumber={settings?.whatsapp_number} />
    </div>
  );
};

export default Index;
