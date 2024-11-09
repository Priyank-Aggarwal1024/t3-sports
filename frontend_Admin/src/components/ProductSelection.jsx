import axios from "axios";
import React, { useEffect, useState } from "react";

const ProductSelection = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // Track individual product quantities

  useEffect(() => {
    // Fetch products data when the component mounts
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

  const handleQuantityChange = (productId, quantity) => {
    // Ensure quantities are updated individually for each product
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity, // Update the quantity for the specific product
    }));
  };

  const handleSelectProduct = (product) => {
    const productQuantity = quantities[product.id] || 1; // Default quantity to 1 if not set
    const exists = selectedProducts.find((p) => p.id === product.id);

    if (exists) {
      // If product is already selected, update its quantity
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: productQuantity } : p
        )
      );
    } else {
      // Add new product to selectedProducts with the specified quantity
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, quantity: productQuantity },
      ]);
    }

    // Optionally, reset quantity input to 1 after adding the product
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.id]: 1, // Reset to 1 for next selection
    }));
  };

  useEffect(() => {
    // Pass the selected products to the parent component (OrderForm)
    onProductSelect(selectedProducts);
  }, [selectedProducts, onProductSelect]);

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Select Products
      </h3>
      <div className="flex">
        {products.map((product) => (
          <div key={product.id} className="p-2 px-4 border flex justify-between items-center w-full border-gray-600 rounded-md dark:text-white text-black">
            <h4 className="font-semibold">{product.name}</h4>
            <p className="dark:text-white text-black text-sm">₹{product.price.toFixed(2)}</p>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                value={quantities[product.id] || 1} // Default value to 1
                onChange={(e) => handleQuantityChange(product.id, +e.target.value)}
                className=" rounded-md p-1 pl-4 mr-2 bg-black dark:text-white text-black text-sm"
              />
              <button
                type="button" // Prevent form submission
                onClick={() => handleSelectProduct(product)}
                className="bg-primary text-white rounded-lg py-1 px-4 text-sm"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        {
          selectedProducts.map((item, index) => {
            return (
              <>
              <div className="dark:text-white text-black">
                Product {index+1} | <span> {item.name} = {item.quantity}units</span>
                </div>
              </>
            )
          })
        }
      </div>
    </div>
  );
};

export default ProductSelection;
  