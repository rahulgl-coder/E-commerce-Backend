

const express = require("express");
const paymentRouter = express.Router();
const controller=require("../controller/paymentController")



paymentRouter.post("/create-order",controller.payment );

module.exports = paymentRouter;

