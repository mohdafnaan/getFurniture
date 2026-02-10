import mongoose from "mongoose";

const manufacturerSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      type: Number,
      default: null,
    },
    phoneOtp: {
      type: Number,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },

    // ===== FACTORY DETAILS =====

    factoryName: {
      type: String,
      required: true,
    },

    factoryDescription: {
      type: String,
      required: true,
    },

    gstNumber: {
      type: String,
    },

    experienceYears: {
      type: Number,
      required: true,
    },

    // ===== LOCATION DETAILS =====

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      fullAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },

    // ===== RELATION WITH PRODUCTS =====

    products: [
      {
        type: String,
        productId : "",
        productName : "",
        productImage : "",
        productPrice : "",
    },
    ],
  },
  { timestamps: true },
);

const manufacturerModel = mongoose.model("Manufacturer", manufacturerSchema);
export default manufacturerModel;
