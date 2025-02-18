// // models/Customer.js
// import mongoose from 'mongoose';

// const customerSchema = new mongoose.Schema({
//   fname: { type: String, required: true },
//   lname: { type: String, required: true },
//   phone: { type: String, required: true },
// });

// const Customer = mongoose.model('Customer', customerSchema);
// export default Customer;

import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      default: () => `CUST-${Date.now()}`,
    },
    email: {
      type: String,
    },
    fname: {
      type: String,
      required: [true, "First Name is required"],
      minlength: [2, "First Name must be at least 2 characters long"],
      maxlength: [50, "First Name cannot exceed 50 characters"],
      trim: true,
    },
    lname: {
      type: String,
      required: [true, "Last Name is required"],
      minlength: [2, "Last Name must be at least 2 characters long"],
      maxlength: [50, "Last Name cannot exceed 50 characters"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      maxlength: [200, "Address cannot exceed 200 characters"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pin Code is required"],
      // match: ['^\\d{6}$', 'Pin Code must be a 6-digit number'],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      maxlength: [100, "City name cannot exceed 100 characters"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      maxlength: [100, "State name cannot exceed 100 characters"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      maxlength: [100, "Country name cannot exceed 100 characters"],
      trim: true,
    },
    sport: {
      type: String,
      required: [true, "Sport is required"],
      enum: [
        "Quad Hockey",
        "Inline Hockey",
        "Ice Hockey",
        "Roll ball",
        "Others",
      ],
    },
    othersport: {
      type: String,
    },
    customertype: {
      type: String,
      required: [true, "Customer Type is required"],
      enum: ["Coach", "Player", "Other"],
    },
    othercustomertype: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      // match: ['^[0-9]{10}$', 'Phone Number must be a valid 10-digit number'],
    },
  },
  {
    timestamps: true,
  }
);
customerSchema.pre("save", function (next) {
  if (this.email === "") {
    this.email = null;
  }
  next();
});
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
