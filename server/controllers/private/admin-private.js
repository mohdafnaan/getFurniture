import express from "express";
import fs from "fs";
import path from "path";
import productModel from "../../Models/Products/Product.js";
import orderModel from "../../Models/Orders/Orders.js";
import upload from "../../utils/upload.js";
import userModel from "../../Models/User/User.js";

const router = express.Router();

// Add a new product (admin only)
router.post("/add-product", upload.array("images", 2), async (req, res) => {
  try {
    let {
      manufacturerName,
      manufacturerPhone,
      factoryName,
      modelName,
      category,
      description,
      minPrice,
      maxPrice,
    } = req.body;
    if (
      !modelName || !category || !minPrice || !maxPrice) {
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
      manufacturerName,
      manufacturerPhone,
      factoryName,
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


// Delete a product by ID
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from uploads folder
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const filePath = img.path;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting file:", err.message);
          }
        });
      });
    }

    // Delete product from database
    await productModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Get all products (for admin dashboard)
router.get("/get-all-products", async (req, res) => {
  try {
    let products = await productModel.find({},{images:1,manufacturerName:1,factoryName:1,modelName:1,priceRange:1});
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});


// get all products of a manufacturer using phone number
router.get("/products-man/:phone", async (req, res) => {
  try {
    let { phone } = req.params;
    let products = await productModel.find({ manufacturerPhone: phone  });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});


//get all orders
router.get("/getallorders",async (req,res)=>{
  try {
    let orders = await orderModel.find({status : "pending"})
    res.status(200).json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

// order completed
router.get("/completeorder/:orderid",async (req,res)=>{
  try {
    let orderId = req.params.orderid;
    await orderModel.updateOne({_id : orderId},{$set:{status:"completed"}})
    res.status(200).json({message : "order completed sucessfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})
export default router;
