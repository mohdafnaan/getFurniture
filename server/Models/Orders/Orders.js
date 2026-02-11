import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // User who requested the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },

    userPhone: {
      type: String,
      required: true,
    },

    userAddress: {
      type: String,
      required: true,
    },

    // Product Details (snapshot at order time)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    modelName: {
      type: String,
      required: true,
    },

    priceRange: {
      min: Number,
      max: Number,
    },

    // Product image stored at order time
    productImage: {
      filename: String,
      path: String,
      mimetype: String,
    },

    // Manufacturer details stored directly
    manufacturerName: {
      type: String,
      required: true,
    },

    factoryName: {
      type: String,
      required: true,
    },

    manufacturerPhone: {
      type: String,
      required: true,
    },

    // Order Status
    status: {
      type: String,
      enum: ["pending", "contacted", "in-process", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
