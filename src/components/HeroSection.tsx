import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

interface Props {
  title?: string | null;
  subtitle?: string | null;
  bannerUrl?: string | null;
}

const HeroSection = ({ title, subtitle, bannerUrl }: Props) => {
  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <img
        src={bannerUrl || heroBanner}
        alt="Premium ethnic fashion collection"
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-lg">
          <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-primary-foreground/80 mb-3">New Collection 2026</p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight mb-4">
            {(title || "Timeless Elegance").split(" ").map((word, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {i === 1 ? <span className="text-gradient-gold">{word}</span> : word}
              </span>
            ))}
          </h2>
          <p className="text-primary-foreground/80 text-base md:text-lg mb-8 max-w-md">
            {subtitle || "Discover our curated collection of premium ethnic wear, handcrafted with love for every occasion."}
          </p>
          <Link to="/category/sarees" className="inline-block bg-gradient-gold text-primary-foreground px-8 py-3.5 rounded-md font-medium text-sm tracking-wide hover:opacity-90 transition-opacity shadow-elegant">
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
