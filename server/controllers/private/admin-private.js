import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import productModel from "../../Models/Products/Product.js";
import orderModel from "../../Models/Orders/Orders.js";
import upload from "../../utils/upload.js";
import userModel from "../../Models/User/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Add a new product (admin only)
router.post("/add-product", upload.array("images", 5), async (req, res) => {
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

    // Check all required fields from the Mongoose schema
    if (
      !modelName ||
      !category ||
      !minPrice ||
      !maxPrice ||
      !manufacturerName ||
      !manufacturerPhone ||
      !factoryName
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        details: {
          modelName: !modelName,
          category: !category,
          minPrice: !minPrice,
          maxPrice: !maxPrice,
          manufacturerName: !manufacturerName,
          manufacturerPhone: !manufacturerPhone,
          factoryName: !factoryName,
        },
      });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // Construct images array
    const images = req.files.map((file) => ({
      filename: file.filename,
      path: `uploads/products/${file.filename}`,
      mimetype: file.mimetype,
    }));

    // Create the product in database
    await productModel.create({
      manufacturerName: manufacturerName || "N/A",
      manufacturerPhone: manufacturerPhone || "N/A",
      factoryName: factoryName || "GetFurniture Factory",
      modelName,
      category,
      description,
      priceRange: { min: Number(minPrice), max: Number(maxPrice) },
      images,
    });

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Server error while adding product",
      error: error.message,
    });
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
        let filePath;
        if (path.isAbsolute(img.path)) {
          filePath = img.path;
        } else {
          // img.path is 'uploads/products/filename.jpg'
          // __dirname is 'server/controllers/private'
          filePath = path.resolve(__dirname, "../..", img.path);
        }

        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log("Error deleting file:", err.message);
            }
          });
        }
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
    let products = await productModel.find(
      {},
      {
        images: 1,
        manufacturerName: 1,
        factoryName: 1,
        modelName: 1,
        priceRange: 1,
      },
    );
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
    let products = await productModel.find({ manufacturerPhone: phone });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//get all orders
router.get("/getallorders", async (req, res) => {
  try {
    let orders = await orderModel.find({ status: "pending" });

    // Normalize image paths
    const cleanedOrders = orders.map((o) => {
      const order = o.toObject();
      if (order.productImage) {
        order.productImage.path = `uploads/products/${order.productImage.filename}`;
      }
      return order;
    });

    res.status(200).json(cleanedOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// order completed
router.get("/completeorder/:orderid", async (req, res) => {
  try {
    let orderId = req.params.orderid;
    await orderModel.updateOne(
      { _id: orderId },
      { $set: { status: "completed" } },
    );
    res.status(200).json({ message: "order completed sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
export default router;
