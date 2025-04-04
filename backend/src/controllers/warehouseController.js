const Warehouse = require("../models/Warehouse.model.js");

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find()
      .select("-__v")
      .populate("products.productId"); // Exclude internal fields
    warehouses.forEach((warehouse) => {
      warehouse.products = warehouse.products.filter(
        (product) => product.productId !== null
      );
    });
    res.status(200).json({ warehouses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createWarehouses = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.name || !data.address || !data.email) {
      return res.status(500).json({ message: "Invalid Data", success: false });
    }
    const warehouse = await (await Warehouse.create(data)).save();
    if (warehouse) {
      return res.json({
        success: true,
        message: "Warehouse Created Successfully",
        warehouse,
      });
    }
    return res.json({ success: false, message: "Something Went Wrong!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addProductInWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { $push: { products: product } },
      { new: true }
    );
    if (warehouse) {
      return res.json({
        success: true,
        message: "Product added to warehouse successfully.",
        warehouse,
      });
    }
    res.status(500).json({ message: "Something went wrong!", success: false });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const removeProductInWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    if (!id || !productId) {
      return res.status(400).json({
        success: false,
        message: "Warehouse ID and Product ID are required.",
      });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { $pull: { products: { productId: productId } } },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from warehouse successfully.",
      warehouse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while removing the product.",
    });
  }
};

const deteteWarehouses = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findByIdAndDelete(id);
    if (warehouse) {
      return res.json({
        success: true,
        message: "Warehouse deleted Successfully",
        warehouse,
      });
    }
    return res.json({ success: false, message: "Something Went Wrong!" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const editWarehouseProductQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    if (!id || !productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Warehouse ID, Product ID, and quantity are required.",
      });
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number.",
      });
    }

    const warehouse = await Warehouse.findOneAndUpdate(
      { _id: id, "products.productId": productId },
      { $set: { "products.$.quantity": quantity } }, // Update quantity of the specific product
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse or product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product quantity updated successfully.",
      warehouse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createWarehouses,
  deteteWarehouses,
  addProductInWarehouse,
  editWarehouseProductQuantity,
  getAllWarehouses,
  removeProductInWarehouse,
};
