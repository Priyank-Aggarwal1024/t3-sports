import Warehouse from "../models/Warehouse.model.js";

export const getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find().select("-__v"); // Exclude internal fields
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
