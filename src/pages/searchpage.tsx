import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import * as Api from "../lib/api";

const SearchPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => Api.searchProducts(query),
    enabled: !!query,
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-8">
          Search Results for "{query}"
        </h1>

        {isLoading && <p>Searching...</p>}

        {!isLoading && products.length === 0 && (
          <p>No products found.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
