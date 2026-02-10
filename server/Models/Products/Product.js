import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    manufacturerId: {
    type : String,
    required : true 
    },

    modelName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["sofa", "bed", "chair", "table", "cupboard", "other"],
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
        type: String,
      },
    ],

    dimensions: {
      length: String,
      breadth: String,
      height: String,
    },

    materialsUsed: [String],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);
export default productModel;
