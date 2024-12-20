import express from "express";
import { viewAllStocks, updateStock, transferStock } from "../controllers/stockController.js";
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/", verifyToken, isAdmin, viewAllStocks);
router.post("/update", verifyToken, isAdmin, updateStock);
router.post("/transfer", verifyToken, isAdmin, transferStock);

export default router;
