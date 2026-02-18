import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { ProductWithCategory } from "@/types/database";

interface ProductCardProps {
  product: ProductWithCategory;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const price = Number(product.price);

  const discountPrice =
    product.discount_price !== null &&
    product.discount_price !== undefined
      ? Number(product.discount_price)
      : null;

  const hasDiscount =
    discountPrice !== null && discountPrice < price;

  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0;

  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/fallback-image.jpg";

  // Logic to display stock status based on actual quantity
  const stockStatus = () => {
    const stockQuantity = product.stock; // Assuming stock is a number field

    if (stockQuantity <= 0) {
      return "Out of Stock";
    } else if (stockQuantity <= 5) {
      return "Limited Stock";
    } else {
      return "In Stock";
    }
  };

  return (
    <div className="group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-3 shadow-sm hover:shadow-md transition-all duration-300">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <span className="bg-black text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-sm">
                New
              </span>
            )}

            {hasDiscount && (
              <span className="bg-rose-600 text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-foreground hover:text-rose-600 transition"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.categories?.name || "Uncategorized"}
          </p>

          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Stock Status */}
          <p className="text-sm text-gray-500">
            {stockStatus()}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              ₹{(discountPrice || price).toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <span className="text-xs line-through text-muted-foreground">
                ₹{price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
