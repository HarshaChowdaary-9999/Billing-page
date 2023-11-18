import mongoose from "mongoose";

const Schema = mongoose.Schema;

const product = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  requiredQuantity: {
    type: Number,
  },
});
const productforbill = mongoose.model("ProductForBill", product);
const billing = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductForBill", // Reference the correct model name
    },
  ],
  totalAmount: {
    type: Number,
  },
  paidStatus: {
    type: Boolean,
    default: false,
  },
  paidAmount: {
    type: Number,
  },
  balanceAmount: {
    type: Number,
  },
  billingDate: {
    type: Date,
    default: Date.now,
  },
  balanceDuration: {
    type: Date,
    default: null,
  },
});
const bill = mongoose.model("Bill", billing);
export { productforbill, bill };

const customer = new Schema({
  customerName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  history: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bill",
    },
  ],
  created: {
    type: Date,
    default: Date.now(),
  },
});
export default mongoose.model("customerBill", customer);
