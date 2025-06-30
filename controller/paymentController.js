const Razorpay = require("razorpay");
require("dotenv").config()


const instance = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
  });


const payment=async (req, res) => {
    const { amount } = req.body;
  
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };
  
    try {
      const order = await instance.orders.create(options);
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  }

  module.exports={payment}