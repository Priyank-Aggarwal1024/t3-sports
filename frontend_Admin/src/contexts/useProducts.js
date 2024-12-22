// useProducts.js
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useProducts = () => {
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({ name: "", price: "" });
  const [ploading, setPloading] = useState(false)

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      setPloading(true)
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setPloading(false)
    };
    fetchProducts();
  }, [count]);

  // Filter products based on search text
  const filterProducts = (searchText) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  const getProductById = (id) => {
    if (products.findIndex((prd) => prd._id == id) != -1) {
      return products[products.findIndex((prd) => prd._id == id)];
    }
    return;
  }
  // Delete product
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("An error occurred while deleting the product");
      }
      setCount((prev) => (prev + 1) % 1001);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setUpdatedProductData({
      ...product
    });
  };

  // Update product
  const handleUpdate = async (id) => {
    try {
      await axios.put(`/api/products/${id}`, updatedProductData);
      const updatedProducts = products.map((product) =>
        product._id === id ? { ...product, ...updatedProductData } : product
      );
      setProducts(updatedProducts);
      toast.success("Product updated successfully");
      setEditingProduct(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An error occurred while updating the product");
    }
    setCount((prev) => (prev + 1) % 1001);
  };

  return {
    products,
    setProducts,
    filterProducts,
    editingProduct,
    setEditingProduct,
    updatedProductData,
    setUpdatedProductData,
    handleDelete,
    handleEdit,
    handleUpdate,
    getProductById,
    ploading
  };
};

export default useProducts;
