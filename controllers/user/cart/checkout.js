import nodemailer from 'nodemailer';
import { emailTemplate } from '../../../utils/emailTemplate.js';
import Cart from '../../../models/CartModel.js';

const checkout = async (req, res) => {
  try {
    const { summary } = req.body;
    const userId = req.user._id;    

    // Clear user's cart
    await Cart.deleteMany({ userId });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: summary.customerDetails.emailId,
      subject: 'Order Confirmation - Thank You for Your Purchase!',
      html: emailTemplate(summary)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process checkout',
      error: error.message
    });
  }
};

export default checkout;