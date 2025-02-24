const Customer = require("../models/customer.model.js");

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const {
      fname,
      lname,
      phone,
      address,
      pincode,
      city,
      state,
      sport,
      customertype,
      othersport,
      email,
      othercustomertype,
      country,
    } = req.body;

    let customer = new Customer({
      fname,
      lname,
      phone,
      address,
      pincode,
      city,
      state,
      sport,
      customertype,
      othersport,
      email,
      othercustomertype,
      country,
    });
    await customer.save();

    res.status(201).json({ customer });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search for customers by query
const getCustomerBySearch = async (req, res) => {
  try {
    let { query } = req.body;
    if (!query) {
      query = "";
    }
    console.log(query);
    const customers = await Customer.find({
      $or: [
        { fname: { $regex: query, $options: "i" } },
        { lname: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { customerId: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, customer });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete a Customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createCustomer,
  deleteCustomer,
  getCustomerBySearch,
  getCustomers,
  updateCustomer,
};
