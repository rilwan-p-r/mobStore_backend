import Cart from "../../../models/CartModel.js";

export const addProductToCart = async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;

    if (quantity > 5) {
        return res.status(400).json({ message: "Maximum quantity allowed is 5" });
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                products: [{ productId, quantity }],
                totalPrice: 0 
            });
        } else {
            // Check if product already exists in cart
            const existingProduct = cart.products.find(
                (item) => item.productId.toString() === productId
            );

            if (existingProduct) {
                existingProduct.quantity = quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            await cart.save();
        }
        const populatedCart = await Cart.findById(cart._id)
            .populate('products.productId')
            .exec();

        // Calculate total price
        const totalPrice = populatedCart.products.reduce((sum, item) => {
            return sum + (item.productId.price * item.quantity);
        }, 0);

        cart.totalPrice = totalPrice;
        await cart.save();

        res.status(200).json(populatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding product to cart", error: error.message });
    }
};
