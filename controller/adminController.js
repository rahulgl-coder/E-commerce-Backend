

const Product=require("../model/product")


 const add = async (req, res) => {
    try {
      
      const { name, price, Quantity ,image} = req.body;
      const imageUrl = req.file.location;
  
      const product = await Product.create({ name, price, Quantity , image: imageUrl });  
      res.status(201).json({ message: "Product added", product });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


  const get=async(req,res)=>{

   
    try {
        const product= await Product.find()
        return res.status(200).json({ message: "products",product:product });
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

   const del =async (req,res)=>{
    const id=req.params.id
    try {

        await Product.findByIdAndDelete(id)
        return res.status(200).json({ message: "deleted" });
    } catch (error) {
        res.status(400).json({error:error.message})
    }
 }

 const block  =  async(req,res)=>{
    const { id } = req.params;
  const { blocked } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { blocked },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: `Product ${blocked ? "blocked" : "unblocked"} successfully`,
      product,
    });
  } catch (err) {
    console.error("Error updating product block status:", err);
    res.status(500).json({ message: "Server error" });
  }
 }


 const edit=async(req,res)=>{
     const id=req.params.id
     const data=req.body
     try {
         const product=await Product.findByIdAndUpdate(id,data,{
          new:true,
          runValidators:true
         });
         return res.status(200).json(product)

      
     } catch (error) {
      res.status(500).json({ message: "Server error" });
     }
}



  module.exports={add,get,del,block,edit}



