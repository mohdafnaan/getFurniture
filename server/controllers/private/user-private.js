import express from "express";

import userModel from "../../Models/User/User.js";
import productModel from "../../Models/Products/Product.js";
import orderModel from "../../Models/Orders/Orders.js";
import sendMail from "../../utils/mailer.js";

const router = express.Router();

// add to cart
router.post("/add-to-favourites/:productId", async (req, res) => {
  try {
    let productId = req.params.productId;
    let user = await userModel.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    let product = await productModel.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    let isAlreadyFavourite = user.favourites.some(
      (fav) => fav.productId === productId,
    );
    if (isAlreadyFavourite) {
      return res.status(400).json({ message: "Product already in favourites" });
    }
    user.favourites.push(productId);
    await user.save();
    res.status(200).json({ message: "Product added to favorites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// get all favorite products of a user
router.get("/favourites", async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user.favourites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// remove from favorites
router.delete("/remove-from-favourites/:productId", async (req, res) => {
  try {
    let productId = req.params.productId;
    let user = await userModel.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.favourites = user.favourites.filter(
      (id) => id.toString() !== productId,
    );
    await user.save();
    res.status(200).json({ message: "Product removed from favorites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// place a new order
router.post("/place-order/:productId", async (req, res) => {
  try {
    // got product
    let productId = req.params.productId;

    // got login user
    let user = await userModel.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // got product details
    let product = await productModel.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    // Check for existing pending order
    const existingOrder = await orderModel.findOne({ 
        userId: user._id, 
        productId: productId, 
        status: { $in: ['pending', 'contacted', 'in-process'] } // Allow re-ordering only if previous order is completed/cancelled
    });
    
    if (existingOrder) {
        return res.status(400).json({ message: "Order already placed" });
    }

    // got product image
    const productImage = product.images?.[0] || null;

    // order placed
    await orderModel.create({
      userId: user._id,
      userName: user.name,
      userPhone: user.phone,
      userAddress: user.address,
      productId: product._id,
      modelName: product.modelName,
      priceRange: product.priceRange,
      productImage,
      manufacturerName: product.manufacturerName, // Added manufacturerName
      factoryName: product.factoryName,
      manufacturerPhone: product.manufacturerPhone,
    });

    // Send confirmation email to user
    await sendMail(
      user.email,
      "Order Confirmation - GetFurniture",
      `Dear ${user.name},<br><br>Thank you for placing an order for <b>${product.modelName}</b>.<br>Our team will respond to you within 4-5 hours to confirm the details and process your request.<br><br><b>Target Price Range:</b> ₹${product.priceRange.min} - ₹${product.priceRange.max}<br><br>Best Regards,<br>GetFurniture Team`,
      true
    );

    // Send notification email to admin
    await sendMail(
      process.env.EMAIL, // Admin gets notified
      "New Order Received - GetFurniture",
      `<b>New Order Alert!</b><br><br>A new order has been placed.<br><br><b>User:</b> ${user.name} (${user.phone})<br><b>Product:</b> ${product.modelName}<br><b>Factory:</b> ${product.factoryName}<br><br>Please check the admin dashboard for more details.`,
      true
    );
    res.status(201).json({ message: "Order placed! Our team will contact you within 4-5 hours." });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get all orders of a user
router.get("/products", async (req, res) => {
  try {
    let products = await productModel
      .find()
      .select("modelName images priceRange factoryName description category");
    
    // Normalize image paths
    const cleanedProducts = products.map(p => {
        const product = p.toObject();
        if(product.images && product.images.length > 0) {
            product.images = product.images.map(img => ({
                ...img,
                path: `uploads/products/${img.filename}` 
            }));
        }
        return product;
    });

    res.status(200).json(cleanedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get products by category
router.get("/products/:category", async (req, res) => {
  try {
    let category = req.params.category;
    let products = await productModel
      .find({ $or: [{ category }, { modelName: category }] })
      .select("modelName images priceRange factoryName description category");
      
    // Normalize image paths
    const cleanedProducts = products.map(p => {
        const product = p.toObject();
        if(product.images && product.images.length > 0) {
            product.images = product.images.map(img => ({
                ...img,
                path: `uploads/products/${img.filename}` 
            }));
        }
        return product;
    });

    res.status(200).json(cleanedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get order-history of a user
router.get("/order-history", async (req, res) => {
  try {
    let orders = await orderModel
      .find({ userId: req.user.userId })
      .select("-userId -__v")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


// cancel an order
router.delete("/cancel-order/:orderid", async (req, res) => {
    try {
        let orderId = req.params.orderid;
        await orderModel.deleteOne({_id : orderId,userId : req.user.userId});
        res.status(200).json({message : "Order cancelled successfullly"})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


export default router;
