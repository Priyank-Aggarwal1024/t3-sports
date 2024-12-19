import React from 'react'

const OrderType = ({ onChange }) => {
  const handleOrderTypeChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Order Type *
        </label>
        <select
          id="payment_method"
          name="payment_method"
          onChange={handleOrderTypeChange}
          className="mt-1 block w-full py-2 px-3 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary hover:cursor-pointer text-sm dark:bg-black dark:text-white"
        >
          <option value="">Select Order Type</option>
          <option value="prepaid">Prepaid</option>
          <option value="COD">Cash on Delivery (COD)</option>
        </select>
      </div>
    </div>
  )
}

export default OrderType