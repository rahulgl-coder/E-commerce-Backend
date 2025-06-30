const mongoose=require("mongoose")
require("dotenv").config()





const dbConnection=async()=>{

    try {
     

        
        await mongoose.connect(process.env.dbURL)
        console.log("database connected succesfully");
    } catch (error) {
        console.log(error.message);
    }

}
 

module.exports= dbConnection 