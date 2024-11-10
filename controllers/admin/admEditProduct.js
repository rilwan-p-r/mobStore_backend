import Product from "../../models/productModel.js";
import cloudinary from "../../utils/cloudinary.js";

export const admEditProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        if (req.file) {
            if (product.coverImageUrl) {
                const publicId = product.imageUrl.split('/').pop().split('.')[0];
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.error('Cloudinary deletion error:', error);
                    return res.status(400).json({ error: 'Failed to delete old image from Cloudinary' });
                }
            }

            // Upload the new image to Cloudinary
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(400).json({ error: 'Failed to upload new image to Cloudinary' });
            }
        }

        // Update other fields
        product.name = name || product.name;
        product.price = price || product.price;

        await product.save();
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};
