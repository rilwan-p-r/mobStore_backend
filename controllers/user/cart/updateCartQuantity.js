import Cart from "../../../models/CartModel.js";

export const updateCartQuantity = async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    if (quantity > 5) {
        return res.status(400).json({ message: "Maximum quantity allowed is 5" });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productItem = cart.products.find(
            (item) => item.productId.toString() === productId
        );

        if (!productItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        productItem.quantity = quantity;
        const populatedCart = await Cart.populate(cart, {
            path: 'products.productId'
        });

        const totalPrice = populatedCart.products.reduce((sum, item) => {
            return sum + (item.productId.price * item.quantity);
        }, 0);

        cart.totalPrice = totalPrice;
        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate('products.productId')
            .lean()
            .exec();

            console.log('updatedCart',updatedCart);

        return res.status(200).json(updatedCart);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating cart quantity", error: error.message });
    }
};