const express = require("express");
const orderRouter = express.Router();
const controller=require("../controller/orderController")



orderRouter.post("/addorder",controller.addOrder )
orderRouter.get("/getorder/:id",controller.getOrder)
orderRouter.delete("/deletecart/:id",controller.deleteCart)








module.exports=orderRouter