import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { DbProduct } from "@/types/database";

interface Props {
  products: DbProduct[];
}

const FeaturedProducts = ({ products }: Props) => {
  if (!products || products.length === 0) return null;

  const featured = products.slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-2">
            Curated For You
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Featured Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
