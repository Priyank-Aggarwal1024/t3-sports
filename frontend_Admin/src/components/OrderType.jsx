import React from 'react'

const OrderType = ({ onChange }) => {
  const handleOrderTypeChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="form-control">
        <label htmlFor="payment_method" className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4">
          Payment Type
        </label>
        <select
          id="payment_method"
          name="payment_method"
          onChange={handleOrderTypeChange}
          className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-primary focus:border-primary hover:cursor-pointer text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
        >
          <option value="">Select</option>
          <option value="prepaid">Prepaid</option>
          <option value="COD">Cash on Delivery (COD)</option>
        </select>
      </div>
    </div>
  )
}

export default OrderType