import productsModel, { availableitems } from "../models/productModel.mjs";
import mongoose from "mongoose";

//Add Product API
const addProduct = async (req, res) => {
  const {
    categoryName,
    productName,
    quantity,
    volume,
    discription,
    price,
    imageUrl,
  } = req.body;
  console.log("called ");

  const existCategory = await productsModel
    .findOne({ categoryName })
    .populate("products");
  console.log(existCategory);
  const newProduct = new availableitems({
    productName,
    quantity,
    volume,
    discription,
    price,
    imageUrl,
  });

  if (existCategory) {
    const existProduct = existCategory.products.find(
      (product) =>
        product.productName === productName && product.volume === volume
    );
    if (existProduct) {
      res.send("Product with that volume already exist");
    } else {
      const product = await newProduct.save();

      existCategory.products.push(product._id);

      existCategory.save();

      res.status(200).json({
        success: true,
        message: "The product is added successfully",
        product: newProduct,
      });
    }
  } else {
    const item = await newProduct.save();
    const product = new productsModel({
      categoryName: categoryName,
      products: [item._id],
    });
    const savedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "The product is added successfully",
      product: savedProduct,
    });
  }
};

//Update Product API

const updateProduct = async (req, res) => {
  try {
    /*const categoryId = req.params.category;
    const productId = req.params.id;

    const update = req.body.product;

    const update1 = {
      $set: {
        "products.$.productName": update.productName,
        "products.$.quantity": update.Quantity,
        "products.$.volume": update.volume,
        "products.$.discription": update.discription,
        "products.$.price": update.price,
      },
    };

    const query = { _id: categoryId, "products._id": productId };

    await productsModel.findOneAndUpdate(query, update1, { new: true });
    res.status(200).json({
      sucess: true,
      message: "The product has been successfully updated",
    });*/
    const productId = req.params.id;
    const update = req.body;
    const query = { _id: productId };

    await availableitems.findByIdAndUpdate(query, update, { new: true });

    const temp = await productsModel
      .findOne({
        _id: req.params.category,
      })
      .populate("products");

    console.log(temp);
    res.status(200).json({
      sucess: true,
      message: "The product has been successfully updated",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

//Delete Product API

const deleteProduct = async (req, res) => {
  try {
    /*
    const category = req.params.category;
    const productId = req.params.id;

    const query = {
      _id: category,
    };
    const update = {
      $pull: {
        products: {
          _id: productId,
        },
      },
    };

    await productsModel.updateOne(query, update, { new: true });
    res.status(200).json({
      sucess: true,
      message: "The product has been successfully deleted",
    });*/
    const productId = req.params.id;

    await availableitems.updateOne(
      { _id: productId },
      { $set: { delete: true } }
    );
    await productsModel.deleteOne();
    res.status(200).json({
      sucess: true,
      message: "The product has been successfully deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

//Display category wise Products API

const categoryProducts = async (req, res) => {
  try {
    const categoryId = req.params.category;
    const displayProducts = await productsModel
      .findOne({ _id: categoryId }, { products: 1, _id: 0 })
      .populate({
        path: "products",
        match: { delete: false },
      });
    res.status(200).json({
      sucess: true,
      availableitems: displayProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

//Display total products API

//Search Product through category

const categorySearch = async (req, res) => {
  try {
    const item = req.query.name;
    const categoryId = req.params.category;
    const displayProducts = await productsModel
      .findOne({ _id: categoryId })
      .populate("products");
    const searchRegex = new RegExp(item, "i");

    const product = displayProducts.products.filter((product) =>
      searchRegex.test(product.productName)
    );
    res.status(200).json({
      sucess: true,
      products: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

//Search Prduct from whole database
const searchHome = async (req, res) => {
  try {
    const name = req.query.name;
    const productsAvailable = await availableitems.find({ delete: false });

    const searchRegex = new RegExp(name, "i");
    const product = productsAvailable.filter((product) =>
      searchRegex.test(product.productName)
    );
    res.status(200).json({
      sucess: true,
      product: product,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

// Available categories
const categories = async (req, res) => {
  console.log("called");
  try {
    const names = await productsModel.find({}, { categoryName: 1 });
    console.log(names);
    const cnames = [];
    for (let i in names) {
      cnames.push(names[i]);
    }
    res.status(200).json({
      categories: cnames,
    });
  } catch (error) {
    res.status(400).json({
      error: "please try again",
    });
  }
};
export {
  addProduct,
  updateProduct,
  deleteProduct,
  categoryProducts,
  categorySearch,
  searchHome,
  categories,
};
