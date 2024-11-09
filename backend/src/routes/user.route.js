import express from "express";
import { getUsers, getUser, getUserById, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/get-users", getUsers);
router.get("/get-user/:email", getUser);
router.get("/get-user-by-id/:id", getUserById);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
