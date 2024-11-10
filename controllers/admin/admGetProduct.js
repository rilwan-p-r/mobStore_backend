import Product from "../../models/productModel.js";

export const admGetProduct = async (req, res) => {
    try {
        const product = await Product.find().sort({ createdAt: -1 }).exec();
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving products", error: error.message });
    }
};
