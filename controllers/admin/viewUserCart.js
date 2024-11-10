import Cart from "../../models/CartModel.js";

export const viewUserCart = async (req, res) => {
    try {
        const {
            userId
        } = req.params;

        const cart = await Cart.findOne({
                userId
            })
            .populate('products.productId')
            .exec();

            if (!cart) {
            return res.status(200).json({
                products: [],
                totalPrice: 0
            });
        }
        console.log(cart);
        
        res.status(200).json(cart)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving user cart",
            error: error.message
        })
    }
}