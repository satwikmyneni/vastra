export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
};

export type DbProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price?: number | null;
  description?: string | null;
  stock?: number | string;
  fabric?: string | null;
  sizes?: string[] | null;
  images?: string[] | null;
  category_id?: string | null;
  categories?: DbCategory | null;
  is_new?: boolean;
  is_sale?: boolean;
  created_at?: string;
};

export type DbSettings = {
  id: string;
  whatsapp_number?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  announcement_text?: string | null;
  created_at?: string;
};

export type ProductWithCategory = DbProduct & {
  categories?: DbCategory | null;
};
