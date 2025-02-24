const express = require("express");
const {
  addProductInWarehouse,
  createWarehouses,
  deteteWarehouses,
  editWarehouseProductQuantity,
  getAllWarehouses,
  removeProductInWarehouse,
} = require("../controllers/warehouseController.js");
const { isAdmin } = require("../middleware/auth.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.get("/", verifyToken, getAllWarehouses);
router.post("/create", verifyToken, isAdmin, createWarehouses);
router.put("/add-product/:id", verifyToken, isAdmin, addProductInWarehouse);
router.put(
  "/remove-product/:id",
  verifyToken,
  isAdmin,
  removeProductInWarehouse
);
router.delete("/:id", verifyToken, isAdmin, deteteWarehouses);
router.put(
  "/edit-product-quantity/:id",
  verifyToken,
  isAdmin,
  editWarehouseProductQuantity
);

module.exports = router;
