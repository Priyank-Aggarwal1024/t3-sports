import React from "react";
import PropTypes from "prop-types";
const OrderDetails = ({ orderDetails, setOrderDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="number"
        placeholder="Shipping Charges"
        value={orderDetails.shippingCharges}
        onChange={(e) =>
          setOrderDetails({ ...orderDetails, shippingCharges: e.target.value })
        }
        className="p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        placeholder="COD Charges"
        value={orderDetails.codCharges}
        onChange={(e) =>
          setOrderDetails({ ...orderDetails, codCharges: e.target.value })
        }
        className="p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        placeholder="Tax Amount"
        value={orderDetails.taxAmount}
        onChange={(e) =>
          setOrderDetails({ ...orderDetails, taxAmount: e.target.value })
        }
        className="p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        placeholder="Discount"
        value={orderDetails.discount}
        onChange={(e) =>
          setOrderDetails({ ...orderDetails, discount: e.target.value })
        }
        className="p-2 border border-gray-300 rounded-lg"
      />
      <h3 className="col-span-full">Dimensions (cm)</h3>
      <input
        type="number"
        placeholder="Length"
        value={orderDetails.dimensions.length}
        onChange={(e) =>
          setOrderDetails({
            ...orderDetails,
            dimensions: { ...orderDetails.dimensions, length: e.target.value },
          })
        }
        className="p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        placeholder="Width"
        value={orderDetails.dimensions.width}
        onChange={(e) =>
          setOrderDetails({
            ...orderDetails,
            dimensions: { ...orderDetails.dimensions, width: e.target.value },
          })
        }
        className="p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        placeholder="Height"
        value={orderDetails.dimensions.height}
        onChange={(e) =>
          setOrderDetails({
            ...orderDetails,
            dimensions: { ...orderDetails.dimensions, height: e.target.value },
          })
        }
        className="p-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
};
OrderDetails.propTypes = {
  orderDetails: PropTypes.shape({
    shippingCharges: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    codCharges: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    taxAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dimensions: PropTypes.shape({
      length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
  setOrderDetails: PropTypes.func.isRequired,
};

export default OrderDetails;
