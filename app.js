const express=require("express")
const app=express()
const cors = require("cors");
require("dotenv").config()

const db=require("./dataBase/dataBase")

const userRoute=require("./routes/auth")
const adminRoute=require("./routes/admin")
const orderRoute=require("./routes/order")
const paymentRoute=require("./routes/payment")

db()



const allowedOrigins = [
  "https://e-commerce-frontend-edby.onrender.com",
  "http://localhost:5173",
 " https://e-commerce-caps.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// app.use(cors({
//     origin: "https://e-commerce-5-kdu1.onrender.com"||http://localhost:5173/,
//     credentials: true
//   }));
app.use(express.json());


app.use("/api/auth", userRoute);
app.use("/api/admin",adminRoute);
app.use("/api/order",orderRoute)
app.use("/api/payment",paymentRoute)



app.listen(process.env.PORT,()=>{
    console.log("server connection succesfull");
    
})

