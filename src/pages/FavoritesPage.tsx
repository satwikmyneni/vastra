import Layout from "@/components/Layout";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const favoriteProducts = products.filter((p) =>
    favorites.includes(p.id)
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-10">
          Your Favorites ({favoriteProducts.length})
        </h1>

        {isLoading && <p>Loading...</p>}

        {!isLoading && favoriteProducts.length === 0 && (
          <p className="text-muted-foreground">
            You haven't added any favorites yet.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FavoritesPage;
