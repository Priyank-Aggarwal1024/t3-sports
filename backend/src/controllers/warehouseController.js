import Warehouse from "../models/Warehouse.model.js";

export const getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find().select("-__v"); // Exclude internal fields
        res.status(200).json({ warehouses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createWarehouses = async (req, res) => {
    try {
        const data = req.body;
        if (!data || !data.name || !data.address || !data.email) {
            return res.status(500).json({ message: "Invalid Data", success: false })
        }
        const warehouse = await (await Warehouse.create(data)).save();
        if (warehouse) {
            return res.json({ success: true, message: "Warehouse Created Successfully", warehouse });
        }
        return res.json({ success: false, message: "Something Went Wrong!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const addProductInWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;
        const warehouse = await Warehouse.findByIdAndUpdate(
            id,
            { $push: { products: product } },
            { new: true }
        );
        if (warehouse) {
            return res.json({ success: true, message: "Product added successfully.", warehouse });
        }
        res.status(500).json({ message: "Something went wrong!", success: false });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}
export const removeProductInWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;
        if (!id || !productId) {
            return res.status(400).json({
                success: false,
                message: "Warehouse ID and Product ID are required."
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
                message: "Warehouse not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed successfully.",
            warehouse
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while removing the product.",
        });
    }
};

export const deteteWarehouses = async (req, res) => {
    try {
        const { id } = req.params;
        const warehouse = await Warehouse.findByIdAndDelete(id);
        if (warehouse) {
            return res.json({ success: true, message: "Warehouse deleted Successfully", warehouse });
        }
        return res.json({ success: false, message: "Something Went Wrong!" });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
