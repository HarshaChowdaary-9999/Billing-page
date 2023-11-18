import React, { useEffect, useState } from "react";
import Homeheader from "../components/homeHeader";

import { Input } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
const EditProduct = () => {
  const [onclickAddProduct, setonclickAddProduct] = useState(false);
  const [onclickUpdateProduct, setOnclickUpdateProduct] = useState(false);
  const [onclickDeleteProduct, setonclickDeleteProduct] = useState(false);
  const [categoryName, setCategoryName] = useState();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState();
  const [volume, setVolume] = useState();
  const [price, setPrice] = useState();
  const [discription, setDiscription] = useState();
  const [showSuggestion, setShowSuggestions] = useState(false);
  const [suggestedItems, setSuggesteditem] = useState();
  const [productId, setProductId] = useState();
  const [productOnSearch, setProductOnSearch] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [size, setSize] = React.useState(null);

  const handleOpen = (value) => setSize(value);
  const handleOpenUpdateProduct = (value) => setSize(value);
  const handleAddProductClick = () => {
    handleOpen("md");
    setonclickAddProduct(true);
    setOnclickUpdateProduct(false);
    setonclickDeleteProduct(false);
    setCategoryName("");
    setDiscription("");
    setPrice("");
    setProductName("");
    setVolume("");
    setQuantity("");
  };
  const handleUpdateItemClick = () => {
    handleOpenUpdateProduct("md");
    setonclickAddProduct(false);
    setOnclickUpdateProduct(true);
    setonclickDeleteProduct(false);
    setCategoryName("");
    setDiscription("");
    setPrice("");
    setProductName("");
    setVolume("");
    setQuantity("");
    setImageUrl("");
  };
  const handleDeleteItemClick = () => {
    handleOpen("md");
    setonclickAddProduct(false);
    setOnclickUpdateProduct(false);
    setonclickDeleteProduct(true);
    setCategoryName("");
    setDiscription("");
    setPrice("");
    setProductName("");
    setVolume("");
    setQuantity("");
    setImageUrl("");
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const addProductResponse = await fetch(
        `http://localhost:4000/product/addProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName,
            productName,
            quantity,
            volume,
            price,
            discription,
            imageUrl,
          }),
        }
      );
      if (addProductResponse.ok) {
        const data = await addProductResponse.json();
        console.log(data);
        if (data.success === true) {
          console.log("success");
          setCategoryName("");
          setDiscription("");
          setPrice("");
          setProductName("");
          setVolume("");
          setQuantity("");
          setImageUrl("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleProductSearch = (e) => {
    setProductOnSearch(e.target.value);
    setShowSuggestions(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:4000/product/search?name=${productOnSearch}`
        );

        if (productResponse.ok) {
          const items = await productResponse.json();
          setSuggesteditem(items.product);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [productOnSearch]);
  const handleSuggestionOnClick = (
    productId,
    name,
    volume,
    quantity,
    discription,
    price,
    imageUrl
  ) => {
    setProductId(productId);
    setProductName(name);
    setVolume(volume);
    setQuantity(quantity);
    setDiscription(discription);
    setPrice(price);
    setImageUrl(imageUrl);
    setShowSuggestions(false);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = await fetch(
        `http://localhost:4000/product/updateProduct/category/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: productName,
            volume: volume,
            quantity: quantity,
            discription: discription,
            price: price,
            imageUrl: imageUrl,
          }),
        }
      );
      if (updateData.ok) {
        const data = await updateData.json();
        if (data.sucess === true) {
          setProductId("");
          setDiscription("");
          setPrice("");
          setProductName("");
          setVolume("");
          setQuantity("");
          setImageUrl("");
        } else {
          throw new Error("Failed");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      console.log(productId, " The deleting id ");
      const deleteItem = await fetch(
        `http://localhost:4000/product/deleteProduct/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (deleteItem.ok) {
        const response = await deleteItem.json();
        console.log(response);
        if (response.sucess === true) {
          setProductId("");
          setDiscription("");
          setPrice("");
          setProductName("");
          setVolume("");
          setQuantity("");
          setImageUrl("");
        } else {
          throw new Error("failed");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Homeheader />
      <div className="flex flex-col w-full lg:flex-row mt-6">
        <div
          className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center hover:bg-orange-600 font-bold"
          onClick={handleAddProductClick}
        >
          ADD PRODUCT
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div
          className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center hover:bg-orange-600 font-bold"
          onClick={handleUpdateItemClick}
        >
          UPDATE PRODUCT
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div
          className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center hover:bg-orange-600 font-bold"
          onClick={handleDeleteItemClick}
        >
          DELETE PRODUCT
        </div>
      </div>
      <div className={onclickAddProduct ? "" : "hidden"}>
        <Dialog
          open={
            size === "xs" ||
            size === "sm" ||
            size === "md" ||
            size === "lg" ||
            size === "xl" ||
            size === "xxl"
          }
          size={"lg"}
          handler={handleOpen}
        >
          <DialogHeader>
            {onclickAddProduct && "Add Item"}
            {onclickUpdateProduct && "Update Item"}
            {!onclickAddProduct && !onclickUpdateProduct && "Delete Item"}
          </DialogHeader>
          <DialogBody divider>
            <form
              className="flex flex-col"
              onSubmit={onclickAddProduct ? handleAddProduct : handleUpdate}
            >
              <div className="flex justify-center mx-auto">
                <div className="flex items-center my-2 mx-4">
                  {onclickAddProduct && (
                    <Input
                      variant="standard"
                      label="Category Name"
                      required
                      className="border-b-2 border-black"
                      onChange={(e) => setCategoryName(e.target.value)}
                      value={categoryName}
                    />
                  )}

                  <div>
                    {(onclickUpdateProduct || onclickDeleteProduct) && (
                      <div className=" my-2">
                        <Input
                          variant="standard"
                          label="Search"
                          className=" border-b-2 border-black outline-none"
                          onChange={handleProductSearch}
                          value={productOnSearch}
                        />
                        {showSuggestion &&
                          productOnSearch.length > 0 &&
                          suggestedItems.length > 0 && (
                            <ul>
                              {suggestedItems.map((item, index) => (
                                <li
                                  className=" overflow-auto"
                                  key={index}
                                  onClick={() =>
                                    handleSuggestionOnClick(
                                      item._id,
                                      item.productName,
                                      item.volume,
                                      item.quantity,
                                      item.discription,
                                      item.price,
                                      item.imageUrl
                                    )
                                  }
                                >
                                  {item.productName}
                                  {"--"}
                                  {item.volume}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center my-2 mx-4">
                  <Input
                    variant="standard"
                    label="Product Name"
                    required
                    className="border-b-2 border-black "
                    onChange={(e) => setProductName(e.target.value)}
                    value={productName}
                  />
                </div>
              </div>
              <div className=" flex  justify-center mx-auto my-4">
                <div className="flex items-center  mx-2">
                  <Input
                    label="Quantity"
                    type="number"
                    required
                    className=" border-solid border-4  border-black  "
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                  />
                </div>

                <div className="flex items-center  mx-2">
                  <Input
                    label="Volume"
                    type="text"
                    required
                    className=" border-solid border-4  border-black  "
                    onChange={(e) => setVolume(e.target.value)}
                    value={volume}
                  />
                </div>

                <div className="flex items-center  mx-2">
                  <Input
                    label="Price"
                    type="number"
                    required
                    className=" border-solid border-4  border-black  "
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                  />
                </div>
              </div>

              <div className="flex items-center mx-auto my-2">
                <div className="form-control mx-4">
                  <label className="label">
                    <span className="label-text">Discription</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="Enter ...."
                    onChange={(e) => setDiscription(e.target.value)}
                    value={discription}
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ImageURL</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="Enter ...."
                    onChange={(e) => setImageUrl(e.target.value)}
                    value={imageUrl}
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-center my-2">
                {!onclickDeleteProduct && (
                  <Button
                    variant="gradient"
                    color="green"
                    type="submit"
                    className=" font-semibold border bg-slate-500 px-5"
                  >
                    {onclickAddProduct && "ADD ITEM"}
                    {onclickUpdateProduct && "UPDATE"}
                  </Button>
                )}

                {onclickDeleteProduct && (
                  <Button
                    variant="gradient"
                    color="red"
                    type="submit"
                    className=" font-semibold border bg-slate-500 px-5"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => handleOpen(null)}
              className="mr-1"
            >
              <span>close</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};

export default EditProduct;
