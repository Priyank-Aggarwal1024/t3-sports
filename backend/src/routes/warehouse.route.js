import express from "express";
import { getAllWarehouses } from "../controllers/warehouseController.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAdmin, getAllWarehouses);

export default router;
