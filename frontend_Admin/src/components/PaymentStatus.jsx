import React from "react";
import PropTypes from "prop-types";

const PaymentStatus = ({ onChange, orderDetails }) => {
  const handlePaymentStatusChange = ({ target }) => {
    onChange(target.name, target.value);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="form-control">
        <label
          htmlFor="payment_status"
          className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
        >
          Payment Status *
        </label>
        <select
          id="payment_status"
          name="payment_status"
          onChange={handlePaymentStatusChange}
          className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-[#2F60F3] focus:border-[#2F60F3] hover:cursor-pointer text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
        >
          <option value="">Select</option>
          <option value="paid">Paid</option>
          <option value="partially">Partially Paid</option>
          <option value="credit">Credit</option>
          <option value="others">Others</option>
        </select>
      </div>
      {orderDetails.payment_status == "others" && (
        <div className="form-control pt-4">
          <label
            htmlFor="otherpayment_status"
            className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] mb-2"
          >
            Give Comment for payment status
          </label>
          <input
            name="otherpayment_status"
            id="otherpayment_status"
            placeholder="Payment status"
            value={orderDetails.otherpayment_status}
            onChange={handlePaymentStatusChange}
            className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-[#2F60F3] focus:border-[#2F60F3] hover:cursor-pointer text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
          />
        </div>
      )}
    </div>
  );
};
PaymentStatus.propTypes = {
  onChange: PropTypes.func.isRequired,
  orderDetails: PropTypes.shape({
    payment_status: PropTypes.string.isRequired,
    otherpayment_status: PropTypes.string,
  }).isRequired,
};
export default PaymentStatus;
