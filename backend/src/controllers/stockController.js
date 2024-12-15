import Stock from "../models/Stock.model.js";

export const viewAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find()
            .populate("warehouse", "name")
            .populate("product", "name");
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStock = async (req, res) => {
    const { warehouseId, productId, size, colour, quantity } = req.body;

    try {
        const stock = await Stock.findOne({ warehouse: warehouseId, product: productId, size, colour });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        stock.quantity += quantity;

        if (stock.quantity < 0) {
            return res.status(400).json({ message: "Insufficient stock to reduce" });
        }

        await stock.save();
        res.status(200).json({ message: "Stock updated successfully", stock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const transferStock = async (req, res) => {
    const { fromWarehouseId, toWarehouseId, productId, size, colour, quantity } = req.body;

    try {
        const fromStock = await Stock.findOne({ warehouse: fromWarehouseId, product: productId, size, colour });
        const toStock = await Stock.findOne({ warehouse: toWarehouseId, product: productId, size, colour });

        if (!fromStock || fromStock.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock in the source warehouse" });
        }

        fromStock.quantity -= quantity;
        await fromStock.save();

        if (toStock) {
            toStock.quantity += quantity;
            await toStock.save();
        } else {
            await Stock.create({ warehouse: toWarehouseId, product: productId, size, colour, quantity });
        }

        res.status(200).json({ message: "Stock transferred successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
