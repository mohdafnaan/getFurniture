// import mongoose from "mongoose";

// const manufacturerSchema = new mongoose.Schema(
//   {
//     // ===== FACTORY DETAILS =====
//     ownerName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     ownerPhone: {
//       type: String,
//       required: true,
//     },
//     factoryName: {
//       type: String,
//       required: true,
//     },
//     experienceYears: {
//       type: Number,
//       required: true,
//     },
//     // ===== LOCATION DETAILS =====
//     fullAddress: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     pincode: {
//       type: Number,
//       required: true,
//     },

//     // ===== RELATION WITH PRODUCTS =====

//     products: [
//       {
//         type: String,
//         productId: "",
//         productName: "",
//         productImage: "",
//         productPrice: "",
//       },
//     ],
//   },
//   { timestamps: true },
// );

// const manufacturerModel = mongoose.model("Manufacturer", manufacturerSchema);
// export default manufacturerModel;
