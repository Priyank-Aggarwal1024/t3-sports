import React from 'react'

const PaymentStatus = ({ onChange, orderDetails }) => {
    const handlePaymentStatusChange = ({ target }) => {
        onChange(target.name, target.value);
    };

    return (
        <div className="space-y-4">
            <div className="form-control">
                <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Payment Status *
                </label>
                <select
                    id="payment_status"
                    name="payment_status"
                    onChange={handlePaymentStatusChange}
                    className="mt-1 block w-full py-2 px-3 bg-white rounded-md shadow-md focus:outline-none focus:ring-primary focus:border-primary hover:cursor-pointer text-sm dark:bg-black dark:text-white"
                    required
                >
                    <option value="">Select Payment Status</option>
                    <option value="paid">Paid</option>
                    <option value="partially">Partially Paid</option>
                    <option value="credit">Credit</option>
                    <option value="others">Others</option>
                </select>
            </div>
            {orderDetails.payment_status == "others" && <div className="form-control">
                <label htmlFor="otherpayment_status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Give Comment for payment status
                </label>
                <input
                    name="otherpayment_status"
                    id="otherpayment_status"
                    placeholder="Payment Method"
                    value={orderDetails.otherpayment_status}
                    onChange={handlePaymentStatusChange}
                    className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
                />
            </div>}
        </div>
    )
}

export default PaymentStatus