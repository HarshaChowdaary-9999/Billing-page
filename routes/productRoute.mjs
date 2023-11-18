import express from "express";
import {
  addProduct,
  categories,
  categoryProducts,
  categorySearch,
  deleteProduct,
  searchHome,
  updateProduct,
} from "../controller/productController.mjs";

const router = express.Router();

router.get("/categorynames", categories);

router.post("/addProduct", addProduct);

router.put("/updateProduct/category/:id", updateProduct);

router.delete("/deleteProduct/:id", deleteProduct);

router.get("/:category/search", categorySearch);

router.get("/search", searchHome);

router.get("/:category", categoryProducts);

export default router;
