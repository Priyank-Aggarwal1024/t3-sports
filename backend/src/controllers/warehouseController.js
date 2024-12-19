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
        if (!data || !data.name || !data.address) {
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
