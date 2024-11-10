import Cart from "../../../models/CartModel.js";

export const getCartProducts = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId })
            .populate('products.productId')
            .exec();

        if (!cart) {
            return res.status(200).json({
                products: [],
                totalPrice: 0
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving cart products",
            error: error.message
        });
    }
};
