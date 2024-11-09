import React from "react";

const OrderSummary = ({ selectedCustomer, products }) => {
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="p-4 rounded-lg bg-gray-100 dark:bg-darkPrimary dark:text-white text-black">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Order Summary
      </h3>
      {/* <p>Order By: {selectedCustomer.fname + " " + selectedCustomer.lname}</p> */}
      <p className="font-semibold text-sm">Total Quantity: {totalQuantity}</p>
      <p className="font-semibold text-sm">Total Price: ₹{totalPrice.toFixed(2)}</p>
      <h4 className="font-semibold mt-4">Products:</h4>
      <ul>
        {products.map((product, index) => (
          <li key={index} className="flex justify-between">
            <span>{product.name}</span>
            <span>{`Quantity: ${product.quantity}, Price: $${(product.price * product.quantity).toFixed(2)}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderSummary;
