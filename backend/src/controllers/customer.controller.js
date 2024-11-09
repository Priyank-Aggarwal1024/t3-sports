import Customer from '../models/customer.model.js';

export const createCustomer = async (req, res) => {
  try {
    const { fname, lname, phone } = req.body;

    let customer = await Customer.findOne({ phone });
    if (customer) {
      return res.status(200).json({ customer });
    }

    customer = new Customer({ fname, lname, phone });
    await customer.save();

    res.status(201).json({ customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search for customers by query
export const getCustomerBySearch = async (req, res) => {
  try {
    const { query } = req.body;

    const customers = await Customer.find({
      $or: [
        { fname: new RegExp(query, 'i') },
        { lname: new RegExp(query, 'i') },
        { phone: new RegExp(query, 'i') },
      ],
    });

    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
