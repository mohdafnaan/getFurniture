import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    manufacturerName: {
      type: String,
      required: true,
    },
    manufacturerPhone : {
      type : String,
      required : true,
    },
    factoryName: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
  
    category: {
      type: String,
      enum: ["sofa", "bed", "chair", "table", "cupboard","other"],
      required: true,
    },

    description: {
      type: String,
    },

    priceRange: {
      min: Number,
      max: Number,
    },

    images: [
      {
        filename: String,
        path: String,
        mimetype : String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);
export default productModel;
