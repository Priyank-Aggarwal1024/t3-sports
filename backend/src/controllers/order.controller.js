import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import axios from 'axios';
import Product from "../models/product.model.js";
const NIMBUS_API_KEY = process.env.NIMBUS_API_KEY;

export const createOrder = async (req, res) => {
  try {
    const { length, breadth, height, ...orderdata } = req.body;
    const newOrder = new Order({ ...orderdata, volumetricWeight: length * breadth * height });
    const savedOrder = await newOrder.save();
    const customerDetails = await Customer.findById(orderdata.customer);
    if (!customerDetails) throw new Error('Customer not found');

    const nimbusProducts = orderdata.products.map((product) => ({
      name: product.productName,
      qty: product.quantity,
      price: product.price
    }));

    const nimbusOrderData = {
      order_number: savedOrder.order_number,
      payment_method: savedOrder.payment_method,
      amount: savedOrder.amount,
      fname: customerDetails.fname,
      lname: customerDetails.lname,
      phone: customerDetails.phone,
      address: savedOrder.shippingDetails[0].shippingAddress[0].address,
      address_2: savedOrder.shippingDetails[0].shippingAddress[0].address_2,
      city: savedOrder.shippingDetails[0].shippingAddress[0].city,
      state: savedOrder.shippingDetails[0].shippingAddress[0].state,
      pincode: savedOrder.shippingDetails[0].shippingAddress[0].pincode,
      country: savedOrder.shippingDetails[0].shippingAddress[0].country,
      products: nimbusProducts,
      weight: savedOrder.weight,
      length,
      breadth,
      height
    };
    orderdata.products.forEach(async (product) => {
      const prd = await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -product.quantity } }, { new: true });
    })
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
      trackingId: nimbusResponse.data.tracking_id,
      order_id: nimbusResponse.data.data
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
