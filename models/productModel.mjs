import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
  },
  volume: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  discription: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});
const availableitems = mongoose.model("product", productSchema);
export { availableitems };
const products = new Schema({
  categoryName: {
    type: String,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("productCategory", products);
