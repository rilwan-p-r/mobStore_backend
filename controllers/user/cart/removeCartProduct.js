import Cart from "../../../models/CartModel.js";


export const removeCartProduct = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    ).populate('products.productId');

    if (!updatedCart) {
      return res.status(500).json({ message: "Failed to remove product from cart" });
    }

    // Recalculate the total price based on remaining products in the cart
    const newTotalPrice = updatedCart.products.reduce((acc, item) => {
      const productPrice = item.productId.price;
      return acc + (productPrice * item.quantity);
    }, 0);

    // Update the cart's total price
    console.log("newTotalPrice",newTotalPrice);
    
    updatedCart.totalPrice = newTotalPrice;
    await updatedCart.save();

    return res.status(200).json({ message: "Product removed successfully", updatedCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
