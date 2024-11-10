import Product from "../../models/productModel.js";
import cloudinary from "../../utils/cloudinary.js";

export const admAddProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        let imageUrl = null;

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                imageUrl = result.secure_url;
            } catch (error) {
                console.log('Cloudinary upload error:', error);
                return res.status(400).json({ error: 'Failed to upload the image to Cloudinary' });
            }
        }

        const product = await Product.create({
            name,
            price,
            imageUrl
        });

        console.log(product);
        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};
