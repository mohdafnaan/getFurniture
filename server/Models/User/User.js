import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
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

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    profileImage: {
      type: String,
      default: "",
    },

    favorites: [
      {
        type: String,
        productId : "",
        productName : "",
        productImage : "",
        productPrice : "",
      },
    ],
    isVerified : {
        type : Boolean,
        default : false
    },
    emailOtp : {
        type : Number,
        default : null
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
