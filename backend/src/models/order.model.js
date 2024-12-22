import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
  warehouse_id: { type: mongoose.Schema.Types.ObjectId },
  order_number: { type: String, required: true },
  payment_status: {
    type: String,
    enum: ['paid', 'partially', 'credit', 'others'],
    required: true
  },
  payment_method: {
    type: String,
    enum: ['prepaid', 'COD'],
    required: [true, "Payment method is required"]
  },
  otherpayment_status: {
    type: String
  },
  amount: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [{
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  shippingDetails: [{
    shippingAddress: [{
      address: { type: String, required: true },
      address_2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true }
    }],
    shippingCharges: { type: Number, required: true },
    codCharges: { type: Number },
  }],
  courier_id: { type: Number },
  taxAmount: { type: Number },
  discount: { type: Number },
  weight: { type: Number },
  volumetricWeight: { type: Number },
  totalAmount: { type: Number, required: true },
  note: {
    type: String,
    default: ""
  },
  insuranceRequired: {
    type: Boolean,
    default: false
  },
  status: { type: String, enum: ['ordered', 'packaging', 'shipped', 'delivered', 'returned', 'customer unavailable'], default: 'ordered' },
  nimbuspostTrackingId: { type: String }, // For fetching status from Nimbuspost
  dateOfOrder: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
export default Order;
