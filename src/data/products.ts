import categorySarees from "@/assets/category-sarees.jpg";
import categorySalwar from "@/assets/category-salwar.jpg";
import categoryLehenga from "@/assets/category-lehenga.jpg";
import categoryGowns from "@/assets/category-gowns.jpg";
import categoryBridal from "@/assets/category-bridal.jpg";
import categoryMen from "@/assets/category-men.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  discountPrice?: number;
  description: string;
  fabric: string;
  sizes: string[];
  stock: "In Stock" | "Out of Stock";
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  sku?: string;
  color?: string;
  style?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export const WHATSAPP_NUMBER = "919876543210";

export const categories: Category[] = [
  { id: "1", name: "Sarees", slug: "sarees", image: categorySarees, description: "Timeless elegance in every drape" },
  { id: "2", name: "Salwar Kameez", slug: "salwar-kameez", image: categorySalwar, description: "Comfort meets tradition" },
  { id: "3", name: "Lehenga Choli", slug: "lehenga-choli", image: categoryLehenga, description: "Grace for every celebration" },
  { id: "4", name: "Gowns", slug: "gowns", image: categoryGowns, description: "Modern glamour redefined" },
  { id: "5", name: "Bridal", slug: "bridal", image: categoryBridal, description: "Your dream bridal ensemble" },
  { id: "6", name: "Men", slug: "men", image: categoryMen, description: "Regal ethnic wear for men" },
];

export const products: Product[] = [
  {
    id: "1", name: "Royal Banarasi Silk Saree", slug: "royal-banarasi-silk-saree",
    category: "Sarees", categorySlug: "sarees", price: 12999, discountPrice: 9999,
    description: "Exquisite Banarasi silk saree with intricate gold zari work. Perfect for weddings and festive occasions.",
    fabric: "Banarasi Silk", sizes: ["Free Size"], stock: "In Stock",
    images: [categorySarees], isSale: true, color: "Red", style: "Traditional",
  },
  {
    id: "2", name: "Pastel Chikankari Salwar Suit", slug: "pastel-chikankari-salwar-suit",
    category: "Salwar Kameez", categorySlug: "salwar-kameez", price: 7499,
    description: "Delicate Lucknowi Chikankari work on soft georgette fabric. A perfect blend of comfort and style.",
    fabric: "Georgette", sizes: ["S", "M", "L", "XL", "XXL"], stock: "In Stock",
    images: [categorySalwar], isNew: true, color: "Blue", style: "Lucknowi",
  },
  {
    id: "3", name: "Bridal Velvet Lehenga", slug: "bridal-velvet-lehenga",
    category: "Lehenga Choli", categorySlug: "lehenga-choli", price: 45999, discountPrice: 39999,
    description: "Stunning bridal lehenga in rich velvet with heavy zardozi embroidery. A masterpiece for your special day.",
    fabric: "Velvet", sizes: ["S", "M", "L", "XL"], stock: "In Stock",
    images: [categoryLehenga], isSale: true, color: "Maroon", style: "Bridal",
  },
  {
    id: "4", name: "Emerald Embroidered Gown", slug: "emerald-embroidered-gown",
    category: "Gowns", categorySlug: "gowns", price: 18999,
    description: "Flowing emerald gown with golden thread embroidery. Perfect for receptions and evening events.",
    fabric: "Silk Georgette", sizes: ["S", "M", "L", "XL"], stock: "In Stock",
    images: [categoryGowns], isNew: true, color: "Green", style: "Indo-Western",
  },
  {
    id: "5", name: "Red Bridal Lehenga Set", slug: "red-bridal-lehenga-set",
    category: "Bridal", categorySlug: "bridal", price: 75999, discountPrice: 65999,
    description: "Magnificent red bridal lehenga with intricate gold embroidery. Complete with matching dupatta and blouse.",
    fabric: "Raw Silk", sizes: ["S", "M", "L", "XL"], stock: "In Stock",
    images: [categoryBridal], color: "Red", style: "Bridal",
  },
  {
    id: "6", name: "Royal Blue Sherwani", slug: "royal-blue-sherwani",
    category: "Men", categorySlug: "men", price: 24999,
    description: "Regal blue silk sherwani with golden embroidery. Perfect for weddings and special occasions.",
    fabric: "Silk", sizes: ["S", "M", "L", "XL", "XXL"], stock: "In Stock",
    images: [categoryMen], isNew: true, color: "Blue", style: "Sherwani",
  },
  {
    id: "7", name: "Kanjivaram Silk Saree", slug: "kanjivaram-silk-saree",
    category: "Sarees", categorySlug: "sarees", price: 15999,
    description: "Authentic Kanjivaram silk saree with traditional motifs and a rich pallu.",
    fabric: "Kanjivaram Silk", sizes: ["Free Size"], stock: "In Stock",
    images: [categorySarees], color: "Red", style: "Traditional",
  },
  {
    id: "8", name: "Designer Anarkali Suit", slug: "designer-anarkali-suit",
    category: "Salwar Kameez", categorySlug: "salwar-kameez", price: 8999, discountPrice: 6999,
    description: "Floor-length Anarkali suit with floral embroidery and net dupatta.",
    fabric: "Net & Silk", sizes: ["S", "M", "L", "XL"], stock: "In Stock",
    images: [categorySalwar], isSale: true, color: "Pink", style: "Anarkali",
  },
];

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getWhatsAppLink(product: Product): string {
  const message = encodeURIComponent(
    `Hello, I'm interested in this product:\n\nProduct Name: ${product.name}\nPrice: ₹${product.discountPrice || product.price}\nProduct Link: ${window.location.origin}/product/${product.slug}`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
