const express = require("express");
const adminRoute = express.Router();
const controller=require("../controller/adminController")
const verifyToken=require("../middleware/verifyToken")
const authorize =require("../middleware/authorize")
const createS3Uploader = require("s3-easy-uploader");
require("dotenv").config()


const upload = createS3Uploader({
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME ,
    region: process.env.AWS_REGION
  });

adminRoute.post("/add",upload.single("image"),controller.add)
adminRoute.get("/products",verifyToken,authorize("admin"),controller.get)
adminRoute.delete("/delete/:id",verifyToken,authorize("admin"),controller.del)
adminRoute.patch("/block/:id",verifyToken,authorize("admin"),controller.block)
adminRoute.put("/edit/:id",verifyToken,authorize("admin"),controller.edit)



module.exports=adminRoute