import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DbCategory } from "@/types/database";

// Fallback images
import categorySarees from "@/assets/category-sarees.jpg";
import categorySalwar from "@/assets/category-salwar.jpg";
import categoryLehenga from "@/assets/category-lehenga.jpg";
import categoryGowns from "@/assets/category-gowns.jpg";
import categoryBridal from "@/assets/category-bridal.jpg";
import categoryMen from "@/assets/category-men.jpg";

const fallbackImages: Record<string, string> = {
  sarees: categorySarees,
  "salwar-kameez": categorySalwar,
  "lehenga-choli": categoryLehenga,
  gowns: categoryGowns,
  bridal: categoryBridal,
  men: categoryMen,
};

interface Props {
  categories: DbCategory[];
}

const CategoryGrid = ({ categories }: Props) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">
            Explore
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="group relative block aspect-[3/4] rounded-lg overflow-hidden shadow-card"
              >
                <img
                  src={
                    cat.image || 
                    fallbackImages[cat.slug] || 
                    categorySarees
                  }
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-display font-bold text-white">
                    {cat.name}
                  </h3>

                  {cat.description && (
                    <p className="text-xs md:text-sm text-white/80 mt-1">
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
