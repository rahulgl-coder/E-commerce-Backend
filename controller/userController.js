
const jwt=require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const User=require("../model/userModel")
const Product=require("../model/product")
const Cart=require("../model/cart")
const Address=require("../model/address")
const nodemailer=require("nodemailer")
require("dotenv").config()
const { OAuth2Client } = require('google-auth-library');
const Otp=require("../model/otp")
const crypto=require("crypto")


const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
  },
  tls: {
      rejectUnauthorized: false 
  }
})


const sendOtp=async(email,otp,userId)=>{

   try {
    await Otp.create({ userId: userId, otp: otp });
      const info =await transporter.sendMail({
          from: `E-commerce <${process.env.EMAIL_USER}>`,
          to:email,
          subject:"otp verification",
          text:`your otp code is :${otp}`
      })
 
      
  } catch (error) { 
    console.error("Error sending OTP email:", error);

    throw new Error("Failed to send OTP email");
  }



}



const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
    
        await Otp.deleteMany({ userId: existingUser._id }); 
        const otp = crypto.randomInt(100000, 999999).toString();
        await sendOtp(email, otp,existingUser);
        // await Otp.create({ userId: existingUser._id, otp: otp });

        return res.status(200).json({ message: "OTP resent. Please verify.", user: existingUser });
      }
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const otp = crypto.randomInt(100000, 999999).toString();
    await sendOtp(email, otp,newUser._id);
    await Otp.create({ userId: newUser._id, otp: otp });

    res.status(201).json({ message: "Signup successful. Please verify OTP.", user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



const verifyOtp = async (req, res) => {
  try {
    const { otp, user } = req.body;
    const userId = user._id;

   if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const otpRecord = await Otp.findOne({ otp, userId });



    if (!otpRecord) {

      await User.deleteOne({ _id: userId, isVerified: false });
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.findByIdAndUpdate(userId, { isVerified: true });
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const resendOtp = async (req, res) => {
  try {
    const { email,purpose } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  

    if (purpose === "signup") {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }
    } else if (purpose === "forgot_password") {
      if (!user.isVerified) {
        return res.status(400).json({ message: "User is not verified" });
      }
    } else {
        res.status(400).json({ message: "Invalid purpose" });
    }
    await Otp.deleteMany({ userId: user._id });


    const otp = crypto.randomInt(100000, 999999).toString();


    await sendOtp(email, otp,user._id);


   

    return res.status(200).json({ message: "New OTP sent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const resetPassword=async(req,res)=>{

      const userId=req.params.id
      const {password}=req.body
 try {
        const hashedPassword = await bcrypt.hash(password, 10);
       const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
       return res.status(200).json({ user:user });

      } catch (error) {
          return res.status(500).json({ message: "Server error" });
      }



}



const logIn=async(req,res)=>{
    const {email,password}=req.body

    
   
    if ( !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
      }

      try {
        const existingUser = await User.findOne({ email });
      console.log(existingUser.password);
      
        
        if (!existingUser) {
         return res.status(500).json({ message: "user not found" });
        }
         const isMatch = await bcrypt.compare(password, existingUser.password);
   
     
        if(!isMatch){
           return res.status(500).json({ message: "password dont match" });
         } 
         const token = jwt.sign(
          {
            id: existingUser._id,
            role: existingUser.role, 
          },
          process.env.SECRET_KEY,
          { expiresIn: '1h' } 
        );

         return res.status(200).json({ message: "loggin successfully",user:existingUser,token:token });

       } catch (error) {
        return res.status(500).json({ message: "Error" })
      }


}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });  

    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await sendOtp(email, otp, user._id);

    return res.status(200).json({ message: "An OTP has been sent to your email", user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getProduct=async(req,res)=>{

  try {
    const product=await Product.find()
    
    return res.status(200).json({ message: "products",product:product });
  } catch (error) {
    return res.status(500).json({ message: "Error" }) 
  }

}

const findOne=async(req,res)=>{
  const id=req.params.id
  try {
    const product=await Product.findById(id)
 
    
    return res.status(200).json({ message: "products",product:product });

  } catch (error) {
    return res.status(500).json({ message: "Error" }) 
  }
  }




  const googleLogin=async (req,res)=>{
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const { token: googleToken } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience:process.env.CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const { email, name } = payload;

      let user = await User.findOne({ email });
      if (!user) user = await User.create({ name, email });

      const jwtToken = jwt.sign(
        {
          id: user._id,
          role: user.role, 
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' } 
      );
  
      return res.status(200).json({ message: "loggin successfully",user:user,token: jwtToken });
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
   }



   const addCart=async(req,res)=>{
  
    
    const { userId, productId, quantity } = req.body;

    try {
      const existing = await Cart.findOne({ userId, productId });
  
      if (existing) {
        existing.quantity += quantity;
        await existing.save();
        return res.json({ message: 'Cart updated', cartItem: existing });
      }
  
      const newCartItem = new Cart({ userId, productId, quantity });
      await newCartItem.save();


      res.status(201).json({ message: 'Item added to cart', cartItem: newCartItem });
    } catch (err) {
      res.status(500).json({ message: 'Error adding to cart', error: err });
    }


   }


   const getCart=async(req,res)=>{
    try {

  
      const cartItems = await Cart.find({ userId: req.params.id }).populate('productId');
    
     
      res.json({ cartItems });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch cart items' });
    }
        
}

const removeCart=async(req,res)=>{
  const id=req.params.id
try {
    await Cart.findByIdAndDelete(id)
    return res.status(200).json({ message: "deleted" });
} catch (error) {
  res.status(400).json({error:error.message})
}

}

const addAddress=async(req,res)=>{

  try {
    const { userId, name, house, street, location, city, state, pincode } = req.body;

    if (!userId || !name || !house || !street || !location || !city || !state || !pincode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    const newAddress = new Address({
      userId,
      name,
      house,
      street,
      location,
      city,
      state,
      pincode
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {

    res.status(500).json({ message: 'Failed to save address' });
  }
  

}


const getAddress=async(req,res)=>{

  try {
    const addresses = await Address.find({ userId: req.params.id });
    res.json({ addresses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }


}



module.exports = {signUp,logIn,getProduct,findOne,googleLogin,addCart,getCart,removeCart,addAddress,getAddress, verifyOtp,resendOtp,forgotPassword,resetPassword};
