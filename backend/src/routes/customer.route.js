// routes/customerRoutes.js
import express from 'express';
import { createCustomer, getCustomerBySearch, getCustomers, updateCustomer, deleteCustomer } from '../controllers/customer.controller.js';
const router = express.Router();
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';


router.get('/', verifyToken, getCustomers);
router.post('/create', verifyToken, isAdmin, createCustomer);
router.post('/search', verifyToken, isAdmin, getCustomerBySearch);
router.put('/customer/:id', verifyToken, isAdmin, updateCustomer);
router.delete('/customer/:id', verifyToken, isAdmin, deleteCustomer);


export default router;