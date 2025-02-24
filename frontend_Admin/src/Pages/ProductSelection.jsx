import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const ProductSelection = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    // Fetch the products from the backend
    axios.get("/api/products").then((response) => {
      setProducts(response.data.products);
    });
  }, []);

  const handleAddProduct = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    onProductSelect([...selectedProducts, { ...product, quantity: 1 }]);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
    onProductSelect(updatedProducts);
  };

  return (
    <div>
      <h2>Select Products</h2>
      <select onChange={(e) => handleAddProduct(e.target.value)}>
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>

      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product, index) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
ProductSelection.propTypes = {
  onProductSelect: PropTypes.func.isRequired,
};

export default ProductSelection;
