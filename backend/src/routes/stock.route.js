import express from "express";
import { viewAllStocks, updateStock, transferStock } from "../controllers/stockController.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAdmin, viewAllStocks);
router.post("/update", isAdmin, updateStock);
router.post("/transfer", isAdmin, transferStock);

export default router;
