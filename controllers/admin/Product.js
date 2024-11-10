import asyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";
import cloudinary from "../../utils/cloudinary.js";

const admAddProduct =asyncHandler(async(req,res)=>{
    const {name, price} = req.body;
    let imageUrl = null;
    if(req.file){
        try{
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl=  result.secure_url;
        }catch(error){
            console.log('Cloudinary upload error:', error);
            return res.status(400).json({error:'failed to upload the image to cloudinary'})
        }
    }

    const product = await Product.create({
        name,
        price,
        imageUrl
    })
    console.log(product)
    res.status(201).json(product)
})

const admGetProduct  = asyncHandler(async(req,res)=>{
    const product = await Product.find().sort({createdAt:-1}).exec()
    res.status(200).json(product);
})


const admEditProduct = asyncHandler(async (req, res) => {
    const { name, price } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product Not Found');
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
    res.status(200).json(product);
});

const admDeleteProduct=asyncHandler(async(req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        res.status(404);
        throw new Error('Product Not Found');
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
    await Product.deleteOne({_id:req.params.id});
    res.status(200).json({message:'Product Deleted'});
})

export {
    admAddProduct,
    admGetProduct,
    admEditProduct,
    admDeleteProduct,
 };