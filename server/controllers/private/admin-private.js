import express from "express";
import manufacturerModel from "../../Models/Manufacturers/Man.js";
import productModel from "../../Models/Products/Product.js";
import upload from "../../utils/upload.js";

const router = express.Router();

// Route to get all manufacturers
router.get("/get-manufacturers", async (req, res) => {
  try {
    let manufacturers = await manufacturerModel.find({});
    res.status(200).json({ manufacturers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// Route to register a new manufacturer
router.post("/register-manufacturer", async (req, res) => {
  try {
    let {
      ownerName,
      factoryName,
      experienceYears,
      fullAddress,
      city,
      state,
      pincode,
    } = req.body;
    if (
      !ownerName ||
      !factoryName ||
      !experienceYears ||
      !fullAddress ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let dupManu = await manufacturerModel.findOne({ factoryName });
    if (dupManu) {
      return res.status(400).json({ message: "Manufacturer already exists" });
    }
    await manufacturerModel.create({
      ownerName,
      factoryName,
      experienceYears,
      fullAddress,
      city,
      state,
      pincode,
    });
    res.status(201).json({ message: "Manufacturer created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/add-product", upload.array("images", 2), async (req, res) => {
  try {
    let {
      manufacturerId,
      modelName,
      category,
      description,
      minPrice,
      maxPrice,
    } = req.body;
    if (!manufacturerId || !modelName || !category || !minPrice || !maxPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }
    const images = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    }));

    await productModel.create({
      manufacturerId,
      modelName,
      category,
      description,
      priceRange: { min: minPrice, max: maxPrice },
      images,
    });
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/delete-product/:id",async(req,res)=>{
    try {
        let {id} = req.params;
        let product = await productModel.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        await productModel.findByIdAndDelete(id);
        res.status(200).json({message:"Product deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})
export default router;
