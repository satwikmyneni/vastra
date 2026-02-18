import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { fetchProductsByCategory, fetchCategories, fetchProducts } from "../lib/api";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const category = categories.find((c) => c.slug === slug);

  const { data: rawProducts = [] } = useQuery({
    queryKey: ["products-by-category", slug],
    queryFn: () => slug ? fetchProductsByCategory(slug) : fetchProducts(),
  });

  const categoryProducts = useMemo(() => {
    const items = [...rawProducts];
    switch (sort) {
      case "price-asc":
        return items.sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price));
      case "price-desc":
        return items.sort((a, b) => Number(b.discount_price || b.price) - Number(a.discount_price || a.price));
      default:
        return items;
    }
  }, [rawProducts, sort]);

  const fabrics = [...new Set(categoryProducts.map((p) => p.fabric).filter(Boolean))];
  const colors = [...new Set(categoryProducts.map((p) => p.color).filter(Boolean))];

  // Fallback images
  const fallbackImages: Record<string, string> = {};

  return (
    <Layout>
      <div className="relative h-48 md:h-64 overflow-hidden bg-secondary">
        {category?.image_url && <img src={category.image_url} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground">{category?.name || "All Products"}</h1>
            <p className="text-primary-foreground/70 mt-2">{categoryProducts.length} Products</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors md:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground hidden md:inline">Sort by:</span>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none bg-secondary text-foreground text-sm px-4 py-2 pr-8 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/30">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className={`${filtersOpen ? "block" : "hidden"} md:block w-full md:w-56 shrink-0`}>
            <div className="space-y-6">
              {fabrics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Fabric</h4>
                  <div className="space-y-2">
                    {fabrics.map((f) => (
                      <label key={f} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                        <input type="checkbox" className="rounded border-border accent-primary" /> {f}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Color</h4>
                  <div className="space-y-2">
                    {colors.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                        <input type="checkbox" className="rounded border-border accent-primary" /> {c}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1">
            {categoryProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No products in this category yet.</p>
                <p className="text-sm mt-1">Products added via the admin panel will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
