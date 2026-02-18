import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);


  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    discount_price: "",
    description: "",
    stock: "",
    sizes: "",
    category_id: "",
    is_new: false,
    is_sale: false,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔐 Protect Route
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) navigate("/admin-login");
    };
    checkSession();
  }, [navigate]);

  // 📦 Fetch Data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else if (data) {
      setCategories(data);
    }
  };

  // 🔗 Auto Slug
  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  // 🖼 Upload Images to Supabase Storage
  const uploadImages = async () => {
    const urls: string[] = [];

    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return [];
      }

      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      if (data) {
        urls.push(data.publicUrl);
      }
    }

    return urls;
  };

  // ⚡ Fixed category image upload
  const uploadCategoryImage = async () => {
    if (!categoryImageFile) return null;

    const fileName = `category-${Date.now()}-${categoryImageFile.name}`;

    const { error } = await supabase.storage
      .from("categories") // using same bucket as products
      .upload(fileName, categoryImageFile);

    if (error) {
      console.error("Error uploading category image:", error);
      return null;
    }

    const { data } = supabase.storage.from("categories").getPublicUrl(fileName);
    return data?.publicUrl || null;
  };

  // 💾 Save or Update Product in Database
  const handleSubmitProduct = async () => {
    // Check if category is selected
    if (!form.category_id) {
      setError("Please select a category for the product.");
      return;
    }

    // Ensure images are uploaded and URLs are returned
    const imageUrls = await uploadImages();
    if (!imageUrls.length) {
      console.error("No images uploaded.");
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      discount_price: form.discount_price
        ? Number(form.discount_price)
        : null,
      description: form.description || null,
      stock: form.stock ? Number(form.stock) : 0,
      sizes: form.sizes
        ? form.sizes.split(",").map((s) => s.trim())
        : null,
      category_id: form.category_id,
      is_new: form.is_new,
      is_sale: form.is_sale,
      images:
        imageUrls.length > 0
          ? imageUrls
          : editingProduct?.images || null,
    };

    try {
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);

        if (error) {
          console.error("Error updating product:", error);
          return;
        }
      } else {
        // Insert new product
        const { error } = await supabase.from("products").insert([payload]);

        if (error) {
          console.error("Error inserting product:", error);
          return;
        }
      }

      resetForm();
      fetchProducts();
      setError(null); // Clear error after successful submission
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // 💾 Save or Update Category in Database
  const handleSubmitCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert("Category name is required");
      return;
    }

    let imageUrl = editingCategory?.image || null;
    if (categoryImageFile) {
      imageUrl = await uploadCategoryImage();
    }

    const payload = {
      name: categoryForm.name,
      slug: categoryForm.slug || generateSlug(categoryForm.name),
      description: categoryForm.description || null,
      image: imageUrl,
    };

    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editingCategory.id);

        if (error) {
          console.error("Error updating category:", error);
          return;
        }
      } else {
        // Insert new category
        const { error } = await supabase.from("categories").insert([payload]);

        if (error) {
          console.error("Error inserting category:", error);
          return;
        }
      }

      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      price: "",
      discount_price: "",
      description: "",
      stock: "",
      sizes: "",
      category_id: "",
      is_new: false,
      is_sale: false,
    });
    setImageFiles([]);
    setEditingProduct(null);
    setError(null); // Clear error message when form is reset
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
    });
    setCategoryImageFile(null);
    setEditingCategory(null);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      description: product.description || "",
      stock: product.stock?.toString() || "",
      sizes: product.sizes?.join(", ") || "",
      category_id: product.category_id,
      is_new: product.is_new,
      is_sale: product.is_sale,
    });
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Error deleting product:", error);
      } else {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) {
        console.error("Error deleting category:", error);
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="min-h-screen p-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/admin-login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Product Form */}
      <div className="bg-white shadow p-6 rounded-xl max-w-4xl space-y-4">
        <h2 className="text-xl font-semibold">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
                slug: generateSlug(e.target.value),
              })
            }
            className="border p-3 rounded"
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Discount Price"
            value={form.discount_price}
            onChange={(e) =>
              setForm({
                ...form,
                discount_price: e.target.value,
                is_sale: !!e.target.value,
              })
            }
            className="border p-3 rounded"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-3 rounded col-span-2"
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
            className="border p-3 rounded"
          />

          <input
            placeholder="Sizes (S,M,L)"
            value={form.sizes}
            onChange={(e) =>
              setForm({ ...form, sizes: e.target.value })
            }
            className="border p-3 rounded"
          />

          <select
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: e.target.value })
            }
            className="border p-3 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}

          <div className="col-span-2 flex gap-4">
            <label>
              <input
                type="checkbox"
                checked={form.is_new}
                onChange={(e) =>
                  setForm({ ...form, is_new: e.target.checked })
                }
              />{" "}
              New
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.is_sale}
                onChange={(e) =>
                  setForm({ ...form, is_sale: e.target.checked })
                }
              />{" "}
              On Sale
            </label>
          </div>

          <input
            type="file"
            multiple
            onChange={(e) =>
              setImageFiles(
                e.target.files ? Array.from(e.target.files) : []
              )
            }
            className="col-span-2"
          />


          <button
            onClick={handleSubmitProduct}
            className="bg-black text-white py-3 rounded col-span-2"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>

          {editingProduct && (
            <button
              onClick={resetForm}
              className="bg-gray-300 py-2 rounded col-span-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Category Form */}
      <div className="bg-white shadow p-6 rounded-xl max-w-4xl space-y-4">
        <h2 className="text-xl font-semibold">
          {editingCategory ? "Edit Category" : "Add Category"}
        </h2>

        <input
          value={categoryForm.name}
          onChange={(e) =>
            setCategoryForm({
              ...categoryForm,
              name: e.target.value,
              slug: generateSlug(e.target.value),
            })
          }
          placeholder="Category Name"
          className="border p-3 rounded w-full"
        />

        <input
          value={categoryForm.slug}
          onChange={(e) =>
            setCategoryForm({ ...categoryForm, slug: e.target.value })
          }
          placeholder="Category Slug"
          className="border p-3 rounded w-full"
        />

        <textarea
          value={categoryForm.description}
          onChange={(e) =>
            setCategoryForm({ ...categoryForm, description: e.target.value })
          }
          placeholder="Category Description"
          className="border p-3 rounded col-span-2"
        />
        <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setCategoryImageFile(
      e.target.files ? e.target.files[0] : null
    )
  }
  className="border p-3 rounded w-full"
/>


        <button
          onClick={handleSubmitCategory}
          className="bg-black text-white py-3 rounded"
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">₹{product.price}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        {categories.map((category) => (
          <div
            key={category.id}
            className="border p-4 rounded-xl flex justify-between items-center">
          <div>
            {category.image && (
  <img
    src={category.image}
    alt={category.name}
    className="w-16 h-16 object-cover rounded mb-2"
  />
)}
          </div>
          
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleEditCategory(category)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
