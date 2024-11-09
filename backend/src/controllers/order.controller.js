import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js"; 
import axios from 'axios';
const NIMBUS_API_KEY = process.env.NIMBUS_API_KEY;

export const createOrder = async (req, res) => {
  try {
    const {
      order_number,
      customer,
      products,
      payment_method,
      shippingDetails,
      taxAmount,
      discount,
      weight,
      length,
      breadth,
      height,
      totalAmount,
      amount
    } = req.body;

    const newOrder = new Order({
      order_number,
      customer,
      products,
      payment_method,
      shippingDetails,
      taxAmount,
      discount,
      weight,
      length,
      breadth,
      height,
      totalAmount,
      amount
    });

    const savedOrder = await newOrder.save();
    const customerDetails = await Customer.findById(customer);
    if (!customerDetails) throw new Error('Customer not found');

    const nimbusProducts = products.map((product) => ({
      name: product.productName,
      qty: product.quantity,
      price: product.price
    }));

    const nimbusOrderData = {
      order_number: savedOrder.order_number,
      payment_method,
      amount,
      fname: customerDetails.fname,
      lname: customerDetails.lname,
      phone: customerDetails.phone,
      address: shippingDetails[0].shippingAddress[0].address,
      address_2: shippingDetails[0].shippingAddress[0].address_2,
      city: shippingDetails[0].shippingAddress[0].city,
      state: shippingDetails[0].shippingAddress[0].state,
      pincode: shippingDetails[0].shippingAddress[0].pincode,
      country: shippingDetails[0].shippingAddress[0].country,
      products: nimbusProducts,
      weight,
      length,
      breadth,
      height
    };

    const nimbusResponse = await axios.post(
      'https://ship.nimbuspost.com/api/orders/create', 
      nimbusOrderData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'NP-API-KEY': NIMBUS_API_KEY
        }
      }
    );

    savedOrder.nimbuspostTrackingId = nimbusResponse.data.tracking_id;
    await savedOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
      trackingId: nimbusResponse.data.tracking_id
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating order: " + (error.response?.data?.message || error.message)
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const response = await axios.get('https://ship.nimbuspost.com/api/orders', {
      headers: {
        'NP-API-KEY': NIMBUS_API_KEY
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
