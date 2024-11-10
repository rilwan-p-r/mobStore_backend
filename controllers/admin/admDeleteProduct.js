import Product from "../../models/productModel.js";
import cloudinary from "../../utils/cloudinary.js";

export const admDeleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        if (product.imageUrl) {
            const publicId = product.imageUrl.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error('Cloudinary deletion error:', error);
                return res.status(400).json({ error: 'Failed to delete image from Cloudinary' });
            }
        }

        await Product.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Product Deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
