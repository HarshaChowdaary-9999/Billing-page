import React, { useEffect, useState } from "react";
import Homeheader from "../components/homeHeader";
import { Card, Typography } from "@material-tailwind/react";
import { BiEditAlt } from "react-icons/bi";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { MdOutlineDownloadDone } from "react-icons/md";

import {
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
const EditBill = () => {
  const [addProduct, setAddProduct] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [availableCustomers, setAvailableCustomer] = useState("");
  const [history, setHistory] = useState("");
  const [historyId, setHistoryId] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [viewItemsLoading, setViewItemsLoading] = useState(false);
  const [fetchedItems, setFetechedItems] = useState("");
  const [flagForSuggestion, setFlagForSuggestion] = useState(false);
  const [openBill, setOpenBill] = useState(false);
  const [currentBillId, setCurrentBillId] = useState("");

  const [billData, setBillData] = useState([]);
  const [currentBillItems, setCurrentBillItems] = useState("");
  const [updatedTotalAmount, setUpdatedTotalAmount] = useState();
  const [flagToAddItem, setFlagToAddItem] = useState(false);
  const [productName, setProductName] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedItems, setSuggestedItem] = useState("");
  const [volume, setVolume] = useState();
  const [productId, setProductId] = useState();
  const [cost, setCost] = useState();
  const [availableQuantity, setAvailableQuantity] = useState();
  const [currentLength, setCurrentLength] = useState(0);
  const [previousPaidAmount, setPreviousPaidAmount] = useState();
  const [nowPaidAmount, setNowPaidAmount] = useState();
  const [balanceDuration, setBalanceDuration] = useState();

  const TABLE_HEAD = ["S.No", "Dated", "BalanceLeft", ""];

  const handleOpenBill = (id) => {
    setCurrentBillId(id);
    setOpenBill(true);
  };
  const handleCloseBill = () => {
    setCurrentBillItems("");
    setOpenBill(false);
  };

  function removeitem(arr, value) {
    return arr.filter(function (geeks) {
      return geeks._id !== value;
    });
  }
  const handleDeleteItemAfterBill_check = (id) => {
    const temp = removeitem(currentBillItems, id);
    setCurrentBillItems(temp);
  };

  const updateBill = async (e) => {
    e.preventDefault();
    try {
      const paidAmount = Number(previousPaidAmount) + Number(nowPaidAmount);
      const addToBill = await fetch(`http://localhost:4000/bill/updateBill`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId: currentBillId,
          items: currentBillItems,
          totalAmount: updatedTotalAmount,
          paidAmount: paidAmount,
          balanceDuration: balanceDuration,
        }),
      });
      if (addToBill.ok) {
        const data = await addToBill.json();

        if (data.success) {
          setOpenBill(!openBill);
          setCurrentBillItems("");
        }
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductName = (e) => {
    setProductName(e.target.value);
    setShowSuggestion(true);
  };
  //Name sugges
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:4000/product/search?name=${productName}`
        );

        if (productResponse.ok) {
          const items = await productResponse.json();
          setSuggestedItem(items.product);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [productName]);

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
    setShowSuggestion(false);
  };

  useEffect(() => {
    console.log("checkkkkkkkkkkkk", currentBillItems);
    let total = 0;
    if (currentBillItems.length > 0) {
      currentBillItems.map((item, index) => {
        total = total + item.price * item.requiredQuantity;
      });
    }

    setUpdatedTotalAmount(total);
  }, [currentBillItems]);

  useEffect(() => {
    const productDetails = async () => {
      try {
        if (!currentBillItems) {
          const temp = billData.find((item) => item._id === currentBillId);
          console.log("before ", temp);
          setPreviousPaidAmount(temp.paidAmount);

          if (temp && temp.products) {
            console.log("check current billlllll items     jjhj");
            const updatedProducts = await Promise.all(
              temp.products.map(async (item, index) => {
                console.log("Loop id's  ", item.productId);
                const fetchdata = await fetch(
                  `http://localhost:4000/bill/findthrowid?id=${item.productId}`
                );
                const data = await fetchdata.json();
                console.log("received data", data);
                return {
                  ...item,
                  productName: data.Details.productName,
                  price: data.Details.price,
                };
              })
            );
            setCurrentBillItems(updatedProducts);
            console.log("current length", currentLength);
          } else {
            console.error(
              `No item found with _id ${currentBillId} or no 'products' property.`
            );
          }
        } else {
          const updatedProducts = await Promise.all(
            currentBillItems.map(async (item, index) => {
              console.log("Loop id's  ", item.productId);
              const fetchdata = await fetch(
                `http://localhost:4000/bill/findthrowid?id=${item.productId}`
              );
              const data = await fetchdata.json();
              console.log("received data", data);
              return {
                ...item,
                productName: data.Details.productName,
                price: data.Details.price,
              };
            })
          );
          setCurrentBillItems(updatedProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    productDetails();
  }, [currentBillId, billData, currentLength]);

  useEffect(() => {
    console.log("currentttt", currentBillItems);
  }, [currentBillItems]);

  const handleAddProductClick = () => {
    setAddProduct(!addProduct);
  };
  const handleUpdateItemClick = () => {
    setUpdateQuantity(!updateQuantity);
  };
  const handleDeleteItemClick = () => {
    setDeleteItem(!deleteItem);
  };
  const findCustomer = (e) => {
    setCustomerName(e.target.value);
    setFlagForSuggestion(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetch(
          `http://localhost:4000/bill/customer/search?name=${customerName}`
        );
        if (customersResponse.ok) {
          const data = await customersResponse.json();
          if (data.sucess === true) {
            setAvailableCustomer(data.customers);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [customerName]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = history.map(async (billId) => {
          console.log("bill idddddddddd ", billId);
          const billingData = await fetch(
            `http://localhost:4000/bill/findItems?id=${billId}`
          );
          if (billingData.ok) {
            const data = await billingData.json();
            return data;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((result) => result !== undefined);
        validResults.map((temp) => {
          setBillData((prevBillData) => [...prevBillData, temp.items]);
        });

        // This will log the updated state in the next render cycle
        console.log("billing data", validResults);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [history]);

  // ...

  /*useEffect(() => {
    // This will log the updated state after the component has re-rendered
    console.log("updated bill data", billData);
  }, [billData]);*/

  //add item to bill
  const addItemToBill = async () => {
    try {
      const addeditem = await fetch(
        "http://localhost:4000/bill/additemafterbill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
            requiredQuantity: requiredQuantity,
          }),
        }
      );
      if (addeditem.ok) {
        const data = await addeditem.json();

        console.log("added data    ", data);
        setCurrentBillItems((prevCurrent) => [...prevCurrent, data.addeditem]);
        setCurrentLength(currentLength + 1);
        setProductName("");
        setRequiredQuantity(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const customerHistory = (name, number, bills) => {
    setCustomerName(name);
    setPhoneNumber(number);
    setHistory(bills);
    setFlagForSuggestion(false);

    setBillData([]);

    console.log(customerName, phoneNumber, history);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyItemsResponse = await fetch(
          `http://localhost:4000/bill/findItems?id=${historyId}`
        );
        if (historyItemsResponse.ok) {
          const billItems = await historyItemsResponse.json();

          setFetechedItems(billItems.items);
          console.log("Items   ", fetchedItems, fetchedItems.length);
        } else {
          throw new Error("Request Failed");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [historyId]);
  const handleDisplayItems = async (history) => {
    setHistoryId(history);
    setViewItemsLoading(!viewItemsLoading);
  };

  return (
    <div>
      <Homeheader />

      <div>
        <div className=" w-1/2 mx-auto  mt-10">
          <Input
            variant="standard"
            label="Customer Name"
            onChange={findCustomer}
            className=" w-1/2 border-b-2 border-black outline-none"
            value={customerName}
          />

          {availableCustomers.length > 0 &&
            customerName.length > 0 &&
            flagForSuggestion && (
              <ul>
                {availableCustomers.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      customerHistory(
                        item.customerName,
                        item.phoneNumber,
                        item.history
                      );
                    }}
                  >
                    {item.customerName}
                    {"--"}
                    {item.phoneNumber}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
      {billData.length > 0 && customerName.length > 0 && (
        <div className=" w-1/2 mx-auto mt-10">
          <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billData.map((data, index) => (
                  <tr key={data._id} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {data.billingDate.slice(0, 10)}
                          </Typography>
                        </td>
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {data.balanceAmount}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        <BiEditAlt onClick={() => handleOpenBill(data._id)} />
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Dialog
            open={openBill}
            handler={handleOpenBill}
            className=" h-4/5 w-3/4"
          >
            <DialogHeader>
              Editing the {"  "}
              <span className=" px-3 ">{customerName}</span> Bill
            </DialogHeader>
            <DialogBody divider className=" h-3/4">
              {currentBillItems && (
                <div className=" h-full w-full overflow-scroll">
                  <table className="table table-zebra w-full min-w-max table-auto text-left">
                    {/* head */}
                    <thead>
                      <tr>
                        <th></th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBillItems.map((items, index) => (
                        <tr>
                          <th>{index + 1}</th>
                          <td>{items.productName}</td>
                          <td>
                            <input
                              type="number"
                              className=" outline-none w-7 bg-transparent "
                              onChange={(e) => {
                                const updatedQuantity = parseInt(
                                  e.target.value
                                );
                                if (
                                  !isNaN(updateQuantity) &&
                                  updateQuantity >= 0
                                ) {
                                  const updateditems = [...currentBillItems];
                                  updateditems[index].requiredQuantity =
                                    updatedQuantity;
                                  setCurrentBillItems(updateditems);
                                }
                              }}
                              value={items.requiredQuantity}
                            ></input>
                          </td>
                          <td>{items.requiredQuantity * items.price}</td>
                          <td
                            onClick={() =>
                              handleDeleteItemAfterBill_check(items._id)
                            }
                          >
                            <MdDelete />
                          </td>
                        </tr>
                      ))}

                      <tr className={flagToAddItem ? "" : "hidden"}>
                        <th></th>
                        <td className=" relative">
                          <input
                            type="text"
                            onChange={handleProductName}
                            className=" bg-transparent outline-none border-b border-black "
                            placeholder="Item Name"
                            value={productName}
                          ></input>

                          {showSuggestion &&
                            suggestedItems.length > 0 &&
                            productName.length > 0 && (
                              <ul className="">
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
                        <td>
                          <input
                            type="number"
                            onChange={(e) => {
                              setRequiredQuantity(e.target.value);
                            }}
                            placeholder="Qty"
                            className=" w-7 bg-transparent outline-none border border-black"
                          ></input>
                        </td>
                        {productName.length > 0 && requiredQuantity > 0 && (
                          <td onClick={() => addItemToBill()}>
                            <MdOutlineDownloadDone size={22} color="blue" />
                          </td>
                        )}
                      </tr>
                      <tr>
                        <th></th>
                        <td></td>
                        <td>totalAmount</td>
                        <td className=" border-t-2 border-black">
                          {updatedTotalAmount}
                        </td>
                      </tr>
                      {updatedTotalAmount - previousPaidAmount > 0 && (
                        <tr>
                          <th></th>
                          <td></td>
                          <td>you need to pay</td>
                          <td>{updatedTotalAmount - previousPaidAmount}</td>
                        </tr>
                      )}

                      <tr>
                        <th></th>
                        <td></td>
                        <td>paid amount</td>
                        <td>
                          <input
                            type="number"
                            className=" w-14 outline-none border-b border-black bg-transparent"
                            onChange={(e) => setNowPaidAmount(e.target.value)}
                            placeholder={previousPaidAmount}
                          ></input>
                        </td>
                      </tr>
                      {Number(previousPaidAmount) + Number(nowPaidAmount) <
                        updatedTotalAmount && (
                        <tr>
                          <th></th>
                          <td></td>
                          <td>balanceDuration</td>
                          <td>
                            <input
                              type="date"
                              onChange={(e) =>
                                setBalanceDuration(e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={handleCloseBill}
                className="mr-1 my-0"
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={updateBill}
                className=" mr-1"
              >
                <span>Confirm</span>
              </Button>
              <Button
                variant="gradient"
                color="black"
                className=" w-fit"
                onClick={() => {
                  setFlagToAddItem(!flagToAddItem);
                }}
              >
                <span>Add</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      )}
    </div>
  );
};
export default EditBill;
