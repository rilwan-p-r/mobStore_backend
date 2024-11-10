import User from "../../models/userModel.js"

export const getUsers = async(req,res)=>{
    try{
        const users = await User.find()
        res.status(200).json(users)
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Error retrieving users", error: error.message })
    }
}