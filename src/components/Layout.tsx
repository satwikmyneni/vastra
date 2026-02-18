import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings, fetchCategories } from "@/lib/api";
import { FavoritesProvider } from "@/context/FavoritesContext";

import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-background">
        <AnnouncementBar text={settings?.announcement_text} />
        <Header categories={categories} />
        <main>{children}</main>
        <Footer
          whatsappNumber={settings?.whatsapp_number}
          categories={categories}
        />
        <WhatsAppButton whatsappNumber={settings?.whatsapp_number} />
      </div>
    </FavoritesProvider>
  );
};

export default Layout;
