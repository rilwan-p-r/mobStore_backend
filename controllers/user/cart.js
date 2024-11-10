import asyncHandler from "express-async-handler";
import Cart from "../../models/CartModel.js";

const addProductToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;

    if (quantity > 5) {
        res.status(400);
        throw new Error("Maximum quantity allowed is 5");
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = await Cart.create({
                userId,
                products: [{ productId, quantity }],
                totalPrice: 0  // Will be updated after populating product details
            });
        } else {
            // Check if product already exists in cart
            const existingProduct = cart.products.find(
                (item) => item.productId.toString() === productId
            );

            if (existingProduct) {
                // Update quantity if product exists
                existingProduct.quantity = quantity;
            } else {
                // Add new product if it doesn't exist
                cart.products.push({ productId, quantity });
            }

            await cart.save();
        }

        // Populate product details and calculate total price
        const populatedCart = await Cart.findById(cart._id)
            .populate('products.productId')
            .exec();

        // Calculate total price
        const totalPrice = populatedCart.products.reduce((sum, item) => {
            return sum + (item.productId.price * item.quantity);
        }, 0);

        // Update total price
        cart.totalPrice = totalPrice;
        await cart.save();
        res.status(200)
           .json(populatedCart);
    } catch (error) {
        res.status(500);
        throw new Error("Error adding product to cart: " + error.message);
    }
});

const updateCartQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    if (quantity > 5) {
        res.status(400);
        throw new Error("Maximum quantity allowed is 5");
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const productItem = cart.products.find(
        (item) => item.productId.toString() === productId
    );

    if (!productItem) {
        res.status(404);
        throw new Error("Product not found in cart");
    }

    productItem.quantity = quantity;
    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id)
        .populate('products.productId')
        .exec();

    // Update total price
    const totalPrice = updatedCart.products.reduce((sum, item) => {
        return sum + (item.productId.price * item.quantity);
    }, 0);

    cart.totalPrice = totalPrice;
    await cart.save();

    res.status(200)
       .json(updatedCart);
});

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId })
        .populate('products.productId')
        .exec();

    if (!cart) {
        return res.status(200)
                  .json({
                   products: [], totalPrice: 0 
                   });
    }
    res.status(200)
       .json(cart);
});

export { 
         addProductToCart,
         updateCartQuantity,
         getCart };