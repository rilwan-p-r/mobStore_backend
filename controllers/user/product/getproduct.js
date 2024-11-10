import asyncHandler from "express-async-handler";
import Product from "../../../models/productModel.js";

export const getProducts = asyncHandler(async(req,res)=>{
    const product = await Product.find().sort({createdAt:-1}).exec();
    console.log(product);
    res.status(200).json(product);
})
