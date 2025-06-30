const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
  },

 image:{
   type:String,
   required:true
 },
 
 blocked: {
  type: Boolean,
  default: false,
},

  price: {
    type: Number,
    required: true,
   
  },
  Quantity:{
    type:Number,
    required:true

  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
