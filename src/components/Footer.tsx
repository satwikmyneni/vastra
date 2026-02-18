import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import WhatsAppLogo from "@/assets/whatsapp-icon.svg";
import { DbCategory } from "@/types/database";

interface Props {
  whatsappNumber?: string | null;
  categories: DbCategory[];
}

const Footer = ({ whatsappNumber, categories }: Props) => {
  const number = whatsappNumber || "919876543210";

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-display font-bold text-gradient-gold mb-4">Vastra</h3>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">Premium ethnic fashion for every occasion. Handcrafted with love, delivered with care.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Collections</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.id}><Link to={`/category/${cat.slug}`} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{cat.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Contact</Link></li>
              <li><Link to="/" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Visit Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" /><span className="text-sm text-primary-foreground/60">123 Fashion Street,  One Town, Vijayawada 520001</span></li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-gold shrink-0" /><span className="text-sm text-primary-foreground/60">+91 98765 43210</span></li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-gold shrink-0" /><span className="text-sm text-primary-foreground/60">admin@vastra.in</span></li>
              <li>
                <a
  href="https://wa.me/919876543210"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3 rounded-md font-medium transition"
>
  <img
    src={WhatsAppLogo}
    alt="WhatsApp"
    className="w-5 h-5"
  />
  Chat on WhatsApp
</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-xs text-primary-foreground/40">© 2026 Vastra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
