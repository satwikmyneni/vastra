import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { useFavorites } from "@/context/FavoritesContext";
import {
  fetchProductBySlug,
  fetchProductsByCategory,
  fetchSettings,
} from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { MessageCircle, Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug || ""),
    enabled: !!slug,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related-products", product?.categories?.slug],
    queryFn: () => fetchProductsByCategory(product!.categories!.slug),
    enabled: !!product?.categories?.slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Product not found
          </h1>
        </div>
      </Layout>
    );
  }
  
  

  const price = Number(product.price);
  const discountPrice = product.discount_price
    ? Number(product.discount_price)
    : null;
  const hasDiscount = discountPrice && discountPrice < price;

  const whatsappNumber = settings?.whatsapp_number || "919390738856";

  const handleWhatsAppClick = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);

    const imageUrl = product.images?.[0] || "";

    const message = `
Hello, I'm interested in this product:

Product: ${product.name}
Price: ₹${discountPrice || price}
Size: ${selectedSize || "Not Applicable"}

// Image: ${imageUrl}
Product Link: ${window.location.href}
    `;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const relatedFiltered = related
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const favoriteActive = isFavorite(product.id);

  return (
    <Layout>
      <Helmet>
      <title>{product.name} | Vastra</title>

      <meta property="og:title" content={product.name} />
      <meta
        property="og:description"
        content={product.description || "Premium ethnic wear by Vastra"}
      />
      <meta property="og:image" content={product.images?.[0]} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="product" />

      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {product.categories && (
            <>
              <Link
                to={`/category/${product.categories.slug}`}
                className="hover:text-foreground"
              >
                {product.categories.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary"
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-primary mb-2">
              {product.categories?.name}
            </p>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold">
                ₹{(discountPrice || price).toLocaleString("en-IN")}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-lg line-through text-muted-foreground">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-rose font-semibold">
                    {Math.round(((price - discountPrice!) / price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-3">
                  Select Size <span className="text-rose">*</span>
                </p>

                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`px-5 py-2 rounded-md border transition-all duration-200 text-sm ${
                        selectedSize === size
                          ? "bg-black text-white border-black scale-105"
                          : "hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {sizeError && (
                  <p className="text-sm text-rose mt-2">
                    Please select a size before proceeding.
                  </p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleWhatsAppClick}
                disabled={product.sizes?.length > 0 && !selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-md font-medium text-sm transition-all ${
                  product.sizes?.length > 0 && !selectedSize
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "bg-[#25D366] hover:bg-[#1ebe57] text-white"
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                Enquire on WhatsApp
              </button>

              {/* Animated Favorite Button */}
              <motion.button
  whileTap={{ scale: 0.8 }}
  onClick={() => toggleFavorite(product.id)}
  className={`px-4 py-3.5 border rounded-md transition ${
    isFavorite(product.id)
      ? "bg-rose-500 text-white border-rose-500"
      : "hover:border-primary hover:text-primary"
  }`}
>
  <Heart
    className="h-5 w-5"
    fill={isFavorite(product.id) ? "currentColor" : "none"}
  />
</motion.button>

            </div>
          </div>
        </div>

        {/* Related */}
        {relatedFiltered.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedFiltered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
