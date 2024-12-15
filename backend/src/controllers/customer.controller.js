// import Customer from '../models/customer.model.js';

// export const createCustomer = async (req, res) => {
//   try {
//     const { fname, lname, phone } = req.body;

//     let customer = await Customer.findOne({ phone });
//     if (customer) {
//       return res.status(200).json({ customer });
//     }

//     customer = new Customer({ fname, lname, phone });
//     await customer.save();

//     res.status(201).json({ customer });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Fetch all customers
// export const getCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find();
//     res.status(200).json({ success: true, customers });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Search for customers by query
// export const getCustomerBySearch = async (req, res) => {
//   try {
//     const { query } = req.body;

//     const customers = await Customer.find({
//       $or: [
//         { fname: new RegExp(query, 'i') },
//         { lname: new RegExp(query, 'i') },
//         { phone: new RegExp(query, 'i') },
//       ],
//     });

//     res.status(200).json({ customers });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// Create a new customer
export const createCustomer = async (req, res) => {
  try {
    const { fname, lname, phone, address, pinCode, city, state, sport, customerType } = req.body;

    let customer = await Customer.findOne({ phone });
    if (customer) {
      return res.status(200).json({ customer });
    }

    customer = new Customer({ fname, lname, phone, address, pinCode, city, state, sport, customerType });
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
        { address: new RegExp(query, 'i') },
        { city: new RegExp(query, 'i') },
        { state: new RegExp(query, 'i') },
        { sport: new RegExp(query, 'i') },
        { customerType: new RegExp(query, 'i') }
      ],
    });

    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
