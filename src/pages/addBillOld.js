import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Homeheader from "../components/homeHeader";
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
  const handleDeleteItem = () => {};
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
      <div className=" w-full flex mt-6 justify-center">
        <div>
          <label className=" font-bold text-lg">CustomerName :</label>
          <input
            type="text"
            className=" ml-4 box-border border-black border-b-2 outline-none"
            placeholder="Type Customer Name"
            onChange={(e) => setCustomerName(e.target.value)}
            value={customerName}
          />
        </div>

        <div className="ml-40">
          <label className=" font-bold text-lg">Mobile Number :</label>
          <input
            type="Number"
            className=" ml-4 box-border border-black border-b-2 outline-none"
            placeholder="Enter Number"
            onChange={(e) => setnumber(e.target.value)}
            value={number}
          ></input>
        </div>
      </div>
      <div className=" flex w-fit">
        <div className=" ml-24 mt-20 box-border h-80 w-fit border-2 border-black px-24 pt-20">
          <div className=" p-2">
            <label className=" font-bold text-lg ">Item Name :</label>
            <input
              type="text"
              className=" ml-4 box-border border-black border-b-2 outline-none "
              onChange={handleProductName}
              value={productName}
              placeholder="Type Product Name"
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
          </div>
          <div className=" p-2">
            <label className=" font-bold text-lg ">Required Quantity :</label>
            <input
              type="Number"
              className=" ml-4 box-border border-black border-b-2 outline-none"
              onChange={(e) => setRequiredQuantity(e.target.value)}
              value={requiredQuantity}
              placeholder="Type Quantity"
            ></input>
          </div>
          <div className=" justify-center ">
            <button
              className=" font-bold text-lg border p-2 mt-3 ml-7 bg-slate-500 rounded-lg"
              onClick={addItem}
            >
              Add Item
            </button>
          </div>
        </div>
        <div className=" w-fit   ml-20 mt-20 box-border h-auto  border-2 border-black ">
          <div className=" mx-60">
            <p className="font-bold text-lg  ">Added Items</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className=" mt-9 mx-24 ">
              <table className=" border-collapse">
                <thead>
                  <tr>
                    <th></th>
                    <th className=" px-9">Product Name</th>
                    <th className="px-9">Volume</th>
                    <th className="px-9">Quantity</th>
                    <th className="px-9">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="">
                      <td onClick={handleDeleteItem(index)}>
                        <MdDelete />
                      </td>
                      <td className="px-9 ">{item.name}</td>
                      <td className="px-9 ">{item.volume}</td>
                      <td className="px-3 ">
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
                          className=" mx-auto"
                        ></input>
                      </td>
                      <td className="px-9 ">{item.quantity * item.cost}</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td colSpan={2}></td>
                    <td>Total Amount :</td>
                    <td>{totalAmount}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td colSpan={2}></td>
                    <td>Paid Amount:</td>
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
              <button
                className="mt-5 mx-60 border bg-slate-600 font-bold text-lg p-2"
                type="submit"
              >
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBill;
