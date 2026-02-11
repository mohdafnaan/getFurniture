import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    manufacturerId: {
        type: String,
        required: true,
    },
    status : {
        type: String,
        enum : ["pending","accepted","rejected","completed"],
        default : "pending"
    }
},{timestamps:true})

const orderModel = mongoose.model("Order",orderSchema);
export default orderModel; 