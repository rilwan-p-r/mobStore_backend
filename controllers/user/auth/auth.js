import User from "../../../models/userModel.js";
import { generateToken } from "../../../utils/generateToken.js";

const signUp = async (req, res) => {
    try {
        console.log('req', req.body);
        const { name, email, password } = req.body;

        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({ message: 'User already exists with this email address' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            generateToken(res, user._id, 'userJwt');
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during sign-up", error: error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id, 'userJwt');
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during sign-in", error: error.message });
    }
};

export { signUp, signIn };
