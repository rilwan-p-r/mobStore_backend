import express  from "express";
import upload from "../middlewares/multer.js";
import { admAddProduct, admDeleteProduct, admEditProduct, admGetProduct } from "../controllers/admin/Product.js";
import { signIn, signUp } from "../controllers/user/auth.js";
import { getProduct } from "../controllers/user/getproduct.js";
import { protect } from "../middlewares/authMiddleware.js";
import { addProductToCart, getCart, updateCartQuantity } from "../controllers/user/cart.js";
const router = express.Router();


// userRoutes----
router.post('/signup',signUp);
router.post('/signin',signIn);
router.get('/getProduct',getProduct);

router.route('/cart/:productId')
      .post(protect, addProductToCart)      
      .put(protect, updateCartQuantity);

router.get('/cart/:userId', protect, getCart);  


// adminRoutes---
router.route('/admProduct')
      .post(upload.single('image'),admAddProduct)
      .get(admGetProduct)

router.route('/admProduct/:id')
      .put(upload.single('image'),admEditProduct)
      .delete(admDeleteProduct)

export default router;