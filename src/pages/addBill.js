import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Homeheader from "../components/homeHeader";
import { Input } from "@material-tailwind/react";
import { GrAdd } from "react-icons/gr";
import { Button } from "@material-tailwind/react";
import { MdOutlineDownloadDone } from "react-icons/md";
const AddBill = () => {
  const [customerName, setCustomerName] = useState("");
  const [number, setnumber] = useState();
  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [paidAmount, setPaidAmount] = useState();
  const [balanceDuration, setBalanceDuration] = useState();
  const [showSuggestion, setShowSuggestions] = useState(false);
  const [suggestedItems, setSuggesteditem] = useState();
  const [volume, setVolume] = useState();
  const [productId, setProductId] = useState();
  const [cost, setCost] = useState();
  const [availableQuantity, setAvailableQuantity] = useState();

  const addItem = async () => {
    try {
      if (productName && requiredQuantity && productId) {
        setItems((prevItems) => [
          ...prevItems,
          {
            name: productName,
            quantity: requiredQuantity,
            volume: volume,
            productId: productId,
            cost: cost,
            availableQuantity: availableQuantity,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    console.log("itemsssss ", items);
  }, [items]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:4000/product/search?name=${productName}`
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
  }, [productName]);

  useEffect(() => {
    setTotalAmount(
      items.reduce((total, item) => {
        return total + item.quantity * item.cost;
      }, 0)
    );
    setProductName("");
    setRequiredQuantity("");
  }, [items]);

  const handleProductName = (e) => {
    setProductName(e.target.value);
    setShowSuggestions(true);
  };
  const handleSuggestionClick = (
    selectedProduct,
    volume,
    productId,
    quantity,
    cost
  ) => {
    setProductName(selectedProduct);
    setVolume(volume);
    setProductId(productId);
    setAvailableQuantity(quantity);
    setCost(cost);
    setShowSuggestions(false);
  };
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter(
      (obj) => obj.productId !== items[index].productId
    );
    console.log("entereddd", updatedItems);
    setItems(updatedItems);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addToBill = await fetch(`http://localhost:4000/bill/addbill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
          customerName: customerName,
          customerPhone: number,
          totalAmount: totalAmount,
          paidAmount: paidAmount,
          balanceDuration: balanceDuration,
        }),
      });
      if (addToBill.ok) {
        const data = await addToBill.json();

        if (data.message === "successfull") {
          setItems([]);
          setCustomerName("");
          setnumber("");
          setPaidAmount("");
        }
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Homeheader />
      <div className="  mx-24 ">
        <div className=" w-full justify-center flex mt-6  mx-auto">
          <div>
            <Input
              variant="standard"
              label=" Customer Name"
              required
              className="  border-b-2 border-black"
              onChange={(e) => setCustomerName(e.target.value)}
              value={customerName}
            />
          </div>

          <div className="ml-10">
            <Input
              variant="standard"
              label="Mobile Number"
              required
              className=" border-black border-b-2"
              onChange={(e) => setnumber(e.target.value)}
              value={number}
            />
          </div>
        </div>
        <div className=" mx-auto w-fit mt-10 h-screen">
          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead className=" border-b-2 border-black">
                  <tr>
                    <th></th>
                    <th className=" font-bold text-lg  text-black">
                      Product Name
                    </th>
                    <th className=" font-bold text-lg  text-black">Volume</th>
                    <th className=" font-bold text-lg  text-black">Quantity</th>
                    <th className=" font-bold text-lg  text-black">Cost</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="">
                      <th className="">{index + 1}</th>
                      <td className="mx-auto ">{item.name}</td>
                      <td className="mx-auto ">{item.volume}</td>
                      <td className="mx-auto ">
                        <input
                          type="number"
                          onChange={(e) => {
                            const updatedQuantity = parseInt(e.target.value);
                            if (
                              !isNaN(updatedQuantity) &&
                              updatedQuantity >= 0
                            ) {
                              const updatedItems = [...items];
                              updatedItems[index].quantity = updatedQuantity;
                              setItems(updatedItems);
                            }
                          }}
                          value={item.quantity}
                          className=" mx-auto w-7"
                        ></input>
                      </td>
                      <td className="mx-auto ">{item.quantity * item.cost}</td>
                      <td
                        onClick={() => handleDeleteItem(index)}
                        className="px-auto"
                      >
                        <MdDelete size={20} />
                      </td>
                    </tr>
                  ))}
                  <tr className="">
                    <th></th>
                    <td className=" relative">
                      <input
                        type="text"
                        className=" bg-transparent outline-none border-b border-black "
                        placeholder="Item Name"
                        onChange={handleProductName}
                        value={productName}
                      ></input>

                      {showSuggestion &&
                        suggestedItems.length > 0 &&
                        productName.length > 0 && (
                          <ul className="absolute z-10 mt-2 w-48  bg-white border border-gray-300 ml-20">
                            {suggestedItems.map((item, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleSuggestionClick(
                                    item.productName,
                                    item.volume,
                                    item._id,
                                    item.quantity,
                                    item.price
                                  )
                                }
                                className="p-2 cursor-pointer hover:bg-gray-100"
                              >
                                {item.productName} {"--"}
                                {item.volume}
                              </li>
                            ))}
                          </ul>
                        )}
                    </td>
                    <td></td>
                    <td>
                      <input
                        type="number"
                        placeholder="Qty"
                        className=" w-7 bg-transparent outline-none border border-black"
                        onChange={(e) => setRequiredQuantity(e.target.value)}
                        value={requiredQuantity}
                      ></input>
                    </td>

                    <td>
                      <Button
                        variant="gradient"
                        onClick={addItem}
                        color="green"
                      >
                        <GrAdd color="white" size={10} />
                      </Button>
                    </td>
                  </tr>

                  <tr className=" mt-7 outline-none">
                    <th></th>
                    <td colSpan={2}></td>
                    <td className="  ">Total amount:</td>
                    <td>{totalAmount}</td>
                  </tr>
                  <tr className=" mt-7">
                    <th></th>
                    <td colSpan={2}></td>
                    <td className="  w-fit ">Paid Amount:</td>
                    <td>
                      <input
                        type="number"
                        onChange={(e) => setPaidAmount(e.target.value)}
                        value={paidAmount}
                        className="border-b-2 border-black outline-none"
                      ></input>
                    </td>
                  </tr>

                  <tr>
                    {totalAmount - paidAmount > 0 && (
                      <>
                        <td></td>
                        <td colSpan={2}></td>
                        <td>balanceDuration :</td>
                        <td>
                          <input
                            type="date"
                            onChange={(e) => setBalanceDuration(e.target.value)}
                          />
                        </td>
                      </>
                    )}
                    {paidAmount - totalAmount > 0 && (
                      <>
                        <td colSpan={3}>
                          Give back the remaining amount of{" "}
                          {paidAmount - totalAmount}
                        </td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                variant="gradient"
                color="green"
                type="submit"
                className=" mr-1 "
              >
                <span>Confirm</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBill;
