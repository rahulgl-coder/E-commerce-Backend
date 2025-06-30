const Order = require('../model/order');
const User=require("../model/userModel")
const Product=require("../model/product")
const Cart=require("../model/cart")
const Address=require("../model/address")


   const addOrder=async (req, res) => {
  try {
 
    
    const { userId, cartItems, address, totalAmount, paymentId } = req.body;

    const newOrder = new Order({
      userId,
      cartItems,
      address,
      totalAmount,
      paymentId,
      paymentStatus: paymentId ? 'paid' : 'pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Order placement failed', error });
  }
};

const getOrder = async (req, res) => {
    try {
   
  
      const orders = await Order.find({ userId: req.params.id })
        .populate({
          path: 'cartItems.productId',
          select: 'name image',
        })
        .sort({ createdAt: -1 });
  
      res.json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  };
  

  const deleteCart = async (req, res) => {
    try {
   
      const result = await Cart.deleteMany({ userId: req.params.id });
      
     
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} cart items for user ID: ${req.params.id}`,
        deletedCount: result.deletedCount
      });
    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to delete cart items",
        error: error.message
      });
    }
  };

module.exports ={addOrder,getOrder,deleteCart}