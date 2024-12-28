import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import axios from 'axios';
import Product from "../models/product.model.js";
import Warehouse from "../models/Warehouse.model.js"
import nodemailer from 'nodemailer'
const NIMBUS_API_KEY = process.env.NIMBUS_API_KEY;

const generateEmailHtml = (savedOrder, customerDetails, warehouse) => {
  let str = `
  <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ccc; border-radius: 5px; max-width: 600px; margin: 0 auto;">
    <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px;">
      <span style="display: inline-block; width: 120px;">Name</span>
      <span style="display: inline-block; width: 70px;">Quantity</span>
      <span style="display: inline-block; width: 70px;">Price</span>
    </div>
`;

  savedOrder.products.forEach(prod => {
    str += `
    <div style="font-size: 14px; margin-bottom: 5px;">
      <span style="display: inline-block; width: 120px;">${prod.productName}</span>
      <span style="display: inline-block; width: 70px;">${prod.quantity}</span>
      <span style="display: inline-block; width: 70px;">${prod.price}</span>
    </div>
  `;
  });

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>T3 Sports | New Order</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #2c3e50;">This order is assigned to warehouse: <span style="color: #27ae60;">${warehouse.name}</span></h2>
            <br/>
            <h3 style="color: #34495e;">Order Summary</h3>
            <h4 style="color: #34495e;">Customer Details:</h4>
            <p style="margin: 5px 0; font-size: 14px;">Name: <strong>${customerDetails.fname} ${customerDetails.lname}</strong></p>
            <br/>
            <h4 style="color: #34495e;">Products:</h4>
            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff;">
                ${str}
            </div>
            <br/>
            <h4 style="color: #34495e;">Shipping Details</h4>
            <p style="margin: 5px 0; font-size: 14px;">Address: <strong>${savedOrder.shippingDetails[0].shippingAddress[0].address}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">Pincode: <strong>${savedOrder.shippingDetails[0].shippingAddress[0].pincode}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">City: <strong>${savedOrder.shippingDetails[0].shippingAddress[0].city}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">State: <strong>${savedOrder.shippingDetails[0].shippingAddress[0].state}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">Country: <strong>${savedOrder.shippingDetails[0].shippingAddress[0].country}</strong></p>
            <br/>
            <h3 style="color: #2c3e50;">Total Amount</h3>
            <p style="font-size: 16px; font-weight: bold; color: #e74c3c;">Rs. ${savedOrder.totalAmount}</p>
        </div>
    </body>
    </html>
`;
  return html
}



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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.NODEMAILER_EMAIL}`, // Your Gmail address
        pass: `${process.env.NODEMAILER_PASS}`, // Replace with the app password
      },
    });
    const warehouse = await Warehouse.findById(savedOrder.warehouse_id);
    let emailHtml = generateEmailHtml(savedOrder, customerDetails, warehouse)
    await transporter.sendMail({
      from: `T3 Sports <${process.env.NODEMAILER_EMAIL}>`, // Sender address
      to: `${warehouse.email}`, // List of recipients
      subject: "New Order Created", // Subject line
      html: emailHtml
    });
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
