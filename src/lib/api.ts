import { supabase } from "@/integrations/supabase/client";
import { DbCategory, DbProduct, DbSettings, ProductWithCategory } from "@/types/database";

// -----------------------------
// Categories
// -----------------------------
export async function fetchCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
}

// -----------------------------
// Products
// -----------------------------
export async function fetchProducts(): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductWithCategory[]) || [];
}

export async function fetchProductsByCategory(
  categorySlug: string
): Promise<ProductWithCategory[]> {
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!cat) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("category_id", cat.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductWithCategory[]) || [];
}

export async function fetchProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as ProductWithCategory | null;
}

// -----------------------------
// SEARCH (CLEAN + STABLE)
// -----------------------------
export async function searchProducts(
  query: string
): Promise<ProductWithCategory[]> {
  const clean = query.trim();
  if (!clean) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .ilike("name", `%${clean}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data as ProductWithCategory[]) || [];
}

// -----------------------------
// Product CRUD
// -----------------------------
export async function createProduct(product: Partial<DbProduct>) {
  const { data, error } = await supabase
    .from("products")
    .insert(product as any)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<DbProduct>) {
  const { data, error } = await supabase
    .from("products")
    .update(product as any)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// -----------------------------
// Categories CRUD
// -----------------------------
export async function createCategory(category: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}) {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(
  id: string,
  category: Partial<DbCategory>
) {
  const { data, error } = await supabase
    .from("categories")
    .update(category as any)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// -----------------------------
// Settings
// -----------------------------
export async function fetchSettings(): Promise<DbSettings | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as DbSettings | null;
}

export async function updateSettings(
  id: string,
  settings: Partial<DbSettings>
) {
  const { data, error } = await supabase
    .from("settings")
    .update(settings as any)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// -----------------------------
// Image Upload
// -----------------------------
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  const { error } = await supabase
    .storage
    .from("product-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase
    .storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
