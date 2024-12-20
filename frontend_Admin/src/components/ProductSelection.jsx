import axios from "axios";
import React, { useEffect, useState } from "react";
import useProducts from "../contexts/useProducts";

const ProductSelection = ({ onProductSelect }) => {
  const { products } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // Track individual product quantities
  console.log(selectedProducts)

  const handleQuantityChange = (productId, quantity) => {
    // Ensure quantities are updated individually for each product
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity, // Update the quantity for the specific product
    }));
  };

  const handleSelectProduct = (product) => {
    const productQuantity = quantities[product._id] || 1; // Default quantity to 1 if not set
    const exists = selectedProducts.find((p) => p._id === product._id);

    if (exists) {
      // If product is already selected, update its quantity
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, quantity: productQuantity } : p
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
      [product._id]: 1, // Reset to 1 for next selection
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
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
        <div className="flex w-full bg-black py-2 px-1">
          <p className="dark:text-white text-black text-sm w-full">Name</p>
          <p className="dark:text-white text-black text-sm w-full">Price</p>
          <p className="dark:text-white text-black text-sm w-full">Colour</p>
          <p className="dark:text-white text-black text-sm w-full">Size</p>
          <p className="dark:text-white text-black text-sm w-full">Quantity</p>
        </div>
        {products.map((product) => (
          product.quantity > 0 &&
          <div key={product._id} className="p-2 px-2 border flex justify-between items-center w-full border-gray-600 rounded-md dark:text-white text-black ">
            <h4 className="font-semibold w-full">{product.name}</h4>
            <p className="dark:text-white text-black text-sm w-full">₹{product.price.toFixed(2)}</p>
            <p className="dark:text-white text-black text-sm w-full">{product.colour}</p>
            <p className="dark:text-white text-black text-sm w-full">{product.size}</p>
            <div className="flex items-center w-[128px]">
              <input
                type="number"
                min="1"
                max={product.quantity}
                value={quantities[product._id] || 1} // Default value to 1
                onChange={(e) => handleQuantityChange(product._id, +e.target.value)}
                className="block w-[64px] rounded-md p-1 pl-4 mr-2 bg-black dark:text-white text-black text-sm"
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
      <div className="pt-4">
        {
          selectedProducts.map((item, index) => {
            return (
              <>
                <div className="dark:text-white text-black">
                  Product {index + 1} | <span> {item.name} = {item.quantity} units</span>
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
