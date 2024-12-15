// routes/customerRoutes.js
import express from 'express';
import { createCustomer, getCustomerBySearch, getCustomers,updateProduct, deleteProduct } from '../controllers/customer.controller.js';
const router = express.Router();
import { isAdmin } from "../middleware/auth.js";


router.get('/', getCustomers);
router.post('/create', isAdmin,createCustomer);
router.post('/search', isAdmin,getCustomerBySearch);
router.put('/product/:id', isAdmin,updateProduct);
router.delete('/product/:id', isAdmin,deleteProduct);


export default router;