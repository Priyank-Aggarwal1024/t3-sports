const Customer = require("../models/customer.model.js");
const Order = require("../models/order.model.js");
const axios = require("axios");
const Warehouse = require("../models/Warehouse.model.js");
const nodemailer = require("nodemailer");
const Ledger = require("../models/ledger.model.js");
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

  savedOrder.products.forEach((prod) => {
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
            <p style="margin: 5px 0; font-size: 14px;">Address: <strong>${savedOrder.shippingDetails.shippingAddress.address}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">Pincode: <strong>${savedOrder.shippingDetails.shippingAddress.pincode}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">City: <strong>${savedOrder.shippingDetails.shippingAddress.city}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">State: <strong>${savedOrder.shippingDetails.shippingAddress.state}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">Country: <strong>${savedOrder.shippingDetails.shippingAddress.country}</strong></p>
            <br/>
            <h3 style="color: #2c3e50;">Total Amount</h3>
            <p style="font-size: 16px; font-weight: bold; color: #e74c3c;">Rs. ${savedOrder.totalAmount}</p>
        </div>
    </body>
    </html>
`;
  return html;
};

const createOrder = async (req, res) => {
  try {
    const orderdata = req.body;
    const newOrder = new Order({ ...orderdata, ordertype: "assign" });
    const savedOrder = await newOrder.save();
    const customerDetails = await Customer.findById(orderdata.customer);
    if (!customerDetails) throw new Error("Customer not found");

    const warehouseId = orderdata.warehouse_id;
    orderdata.products.forEach(async (prod) => {
      await Warehouse.findOneAndUpdate(
        { _id: warehouseId, "products.productId": prod._id },
        {
          $inc: { "products.$.quantity": -prod.quantity }, // Decrement the quantity
        },
        { new: true }
      );
    });
    await savedOrder.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.NODEMAILER_EMAIL}`, // Your Gmail address
        pass: `${process.env.NODEMAILER_PASS}`, // Replace with the app password
      },
    });
    const warehouse = await Warehouse.findById(savedOrder.warehouse_id);
    let emailHtml = generateEmailHtml(savedOrder, customerDetails, warehouse);
    await transporter.sendMail({
      from: `T3 Sports <${process.env.NODEMAILER_EMAIL}>`, // Sender address
      to: `${warehouse.email}`, // List of recipients
      subject: "New Order Created", // Subject line
      html: emailHtml,
    });
    return res.status(201).json({
      success: true,
      message: "Order Assigned successfully",
      order: savedOrder,
      // trackingId: nimbusResponse.data.tracking_id,
      // order_id: nimbusResponse.data.data
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message:
        "Error creating order: " +
        (error.response?.data?.message || error.message),
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = (
      await Order.find()
        .select(
          "-shippingDetails -updatedAt -discount -insuranceRequired -otherpayment_status -other_platform -__v"
        )
        .populate("customer")
    ).reverse();
    // const response = await axios.get('https://ship.nimbuspost.com/api/orders', {
    //   headers: {
    //     'NP-API-KEY': NIMBUS_API_KEY
    //   }
    // });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    // Fetch all orders with ordertype 'assign'
    const assignedOrders = await Order.find({ ordertype: "assign" })
      .populate("warehouse_id")
      .populate("customer")
      .select("-__v");
    if (!assignedOrders || assignedOrders.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No assigned orders found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assigned orders retrieved successfully.",
      data: assignedOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching assigned orders.",
      error: error.message,
    });
  }
};
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("warehouse_id")
      .populate("customer");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const fulfillOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { breadth, height, length, nimbusProducts, ...data } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      {
        ...data,
        volumetricWeight: breadth * height * length,
        ordertype: "fulfilled",
      },
      {
        new: true, // Returns the updated document
        runValidators: true, // Ensures validations defined in the schema are applied
      }
    ).populate("customer");
    if (!order) {
      return res
        .status(500)
        .json({ success: false, message: "Order id is required!" });
    }
    const ledgerDate = new Date().toISOString(); // If no date is provided, use the current date

    const ledgerEntry = new Ledger({
      transactionType: "debit",
      customer: order.customer._id,
      amount: order.totalAmount,
      date: ledgerDate,
    });

    // Save the ledger entry to the database
    await ledgerEntry.save();
    let nimbusdata = {};
    if (order.platform == "nimbus") {
      const nimbusProductsData = nimbusProducts.map((prod) => {
        return {
          name: prod.productName,
          price: prod.price,
          qty: prod.quantity,
        };
      });
      const nimbusOrderData = {
        order_number: order.order_number,
        payment_method: order.payment_method,
        amount: nimbusProductsData.reduce(
          (total, product) => total + product.qty * product.price,
          0
        ),
        fname: order.customer.fname,
        lname: order.customer.lname,
        phone: order.customer.phone,
        address: order.shippingDetails.shippingAddress.address,
        city: order.shippingDetails.shippingAddress.city,
        state: order.shippingDetails.shippingAddress.state,
        pincode: order.shippingDetails.shippingAddress.pincode,
        country: order.shippingDetails.shippingAddress.country,
        products: nimbusProductsData,
        breadth,
        height,
        length,
        weight: data.weight,
      };
      const nimbusResponse = await axios.post(
        "https://ship.nimbuspost.com/api/orders/create",
        nimbusOrderData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "NP-API-KEY": NIMBUS_API_KEY,
          },
        }
      );
      order.nimbuspostTrackingId = nimbusResponse.data.tracking_id;
      await order.save();
      nimbusdata = {
        trackingId: nimbusResponse.data.tracking_id,
        order_id: nimbusResponse.data.data,
      };
    }
    return res.status(201).json({
      success: true,
      message: "Order Fulfilled successfully",
      order,
      ...nimbusdata,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

// Update order status and tracking link
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, trackinglink } = req.body; // Assuming you send status and trackingLink in the request body

  try {
    // Find the order by ID and update the fields
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: status, // Update the status
        trackinglink: trackinglink, // Update the tracking link
      },
      { new: true } // Return the updated order
    );
    // If order not found, return a 404
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Return the updated order in the response
    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order to delete
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Iterate over products in the order to increment their quantities in the warehouse
    const warehouseId = order.warehouse_id;
    for (const product of order.products) {
      await Warehouse.findOneAndUpdate(
        { _id: warehouseId, "products.productId": product._id },
        {
          $inc: { "products.$.quantity": product.quantity }, // Increment the quantity
        },
        { new: true }
      );
    }

    // Delete the order
    await Order.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Order deleted and warehouse quantities updated successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({
      success: false,
      message:
        "Error deleting order: " +
        (error.response?.data?.message || error.message),
    });
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  fulfillOrder,
  getAssignedOrders,
  getOrderById,
  getOrders,
  updateOrder,
};
