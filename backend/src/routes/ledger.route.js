import express from "express";
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';
import { createLedger, getAllLedgers, updateLedger } from "../controllers/ledger.controller.js";

const router = express.Router();

router.get("/", verifyToken, getAllLedgers);
router.post("/create", verifyToken, isAdmin, createLedger);
router.put("/:id", verifyToken, isAdmin, updateLedger);

export default router;
