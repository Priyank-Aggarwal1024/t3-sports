// models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  phone: { type: String, required: true },
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
