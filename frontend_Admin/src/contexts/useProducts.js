// useProducts.js
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({ name: "", price: "" });

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search text
  const filterProducts = (searchText) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

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
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setUpdatedProductData({
      name: product.name,
      price: product.price,
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
  };
};

export default useProducts;
