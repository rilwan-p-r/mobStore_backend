import express  from "express";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/authMiddleware.js";
import { signIn, signUp } from "../controllers/user/auth/auth.js";
import { getCartProducts } from "../controllers/user/cart/getCartProducts.js";
import { addProductToCart } from "../controllers/user/cart/addProductToCart.js";
import { updateCartQuantity } from "../controllers/user/cart/updateCartQuantity.js";
import { getProducts } from "../controllers/user/product/getproduct.js";
import { admAddProduct } from "../controllers/admin/admAddProduct.js";
import { admGetProduct } from "../controllers/admin/admGetProduct.js";
import { admEditProduct } from "../controllers/admin/admEditProduct.js";
import { admDeleteProduct } from "../controllers/admin/admDeleteProduct.js";
import { removeCartProduct } from "../controllers/user/cart/removeCartProduct.js";
import { getUsers } from "../controllers/admin/getUsers.js";
import { viewUserCart } from "../controllers/admin/viewUserCart.js";
import checkout from "../controllers/user/cart/checkout.js";
const router = express.Router();


// userRoutes----
router.post('/signup',signUp);
router.post('/signin',signIn);
router.get('/getProduct',getProducts);

router.route('/cart/:productId')
      .post(protect, addProductToCart)      
      .put(protect, updateCartQuantity)
      .delete(protect,removeCartProduct)

router.get('/cart/:userId', protect, getCartProducts);  
router.post('/checkout',protect,checkout)


// adminRoutes---
router.route('/admProduct')
      .post(upload.single('image'),admAddProduct)
      .get(admGetProduct)

router.route('/admProduct/:id')
      .put(upload.single('image'),admEditProduct)
      .delete(admDeleteProduct)

router.get('/getUsers',getUsers);
router.get('/viewUserCart/:userId',viewUserCart)      

export default router;