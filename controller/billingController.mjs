import customerBill, { bill } from "../models/billingModel.mjs";
import { availableitems } from "../models/productModel.mjs";
import { productforbill } from "../models/billingModel.mjs";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

//get price and name through product id
const findthrowId = async (req, res) => {
  try {
    const productId = req.query.id;
    const product = await availableitems.findById(productId);

    res.status(200).json({
      Details: product,
    });
  } catch (error) {
    res.status(400).json({
      error: "Please try agian",
    });
    console.log(error);
  }
};
// get price and available quantity
const addTitile = async (req, res) => {
  try {
    const item = req.query.name;
    const volume = req.query.volume;
    const products = await availableitems.find({
      productName: item,
      volume: volume,
    });
    const quantity = req.query.quantity;
    res.status(200).json({
      productId: products[0]._id,
      quantity: products[0].quantity,
      cost: products[0].price,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "please try again",
    });
  }
};
//add Item after Bill
const addItemAfterBill = async (req, res) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.requiredQuantity;

    updateAvailableItems(productId, quantity);
    const newItem = new productforbill({
      productId: productId,
      requiredQuantity: quantity,
    });

    await newItem.save();
    res.status(200).json({
      addeditem: newItem,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "please try again" });
  }
};

//add bill
const addBill = async (req, res) => {
  try {
    const customerName = req.body.customerName;
    const items = req.body.items;
    const customerPhone = req.body.customerPhone;
    const totalAmount = req.body.totalAmount;
    const paidAmount = req.body.paidAmount;
    const balanceAmount = totalAmount - paidAmount;
    const balanceDuration = req.body.balanceDuration;

    const addedItemIds = [];
    const newItemPromises = [];

    for (const element of items) {
      const quantity = element.quantity;

      // Create a promise for updating available items
      const updatePromise = updateAvailableItems(element.productId, quantity);

      // Create a promise for creating a new productforbill item
      const newItemPromise = updatePromise.then(async () => {
        const newItem = new productforbill({
          productId: element.productId,
          requiredQuantity: quantity,
        });

        await newItem.save();
        addedItemIds.push(newItem._id.toString());
        return newItem;
      });

      newItemPromises.push(newItemPromise);
    }
    let billup;
    Promise.all(newItemPromises)

      .then((newItems) => {
        console.log(addedItemIds);
        if (balanceAmount === 0) {
          billup = new bill({
            products: addedItemIds,
            totalAmount: totalAmount,
            paidStatus: true,
            paidAmount: paidAmount,
            balanceAmount: balanceAmount,
          });
        } else {
          billup = new bill({
            products: addedItemIds,
            totalAmount: totalAmount,
            paidAmount: paidAmount,
            balanceAmount: balanceAmount,
            balanceDuration: balanceDuration,
          });
        }

        return billup.save();
      })
      .then(async (savedBill) => {
        /*bill
          .findOne({ _id: "64f731a117712927513356a1" })
          .populate({
            path: "products",
          })
          .populate("products.productId")
          .then((billings) => {
            console.log("Billings:", billings);
          })
          .catch((err) => {
            console.error(err);
          });*/

        const existcustomer = await customerBill.find({
          customerName: customerName,
          phoneNumber: customerPhone,
        });
        if (existcustomer.length > 0) {
          existcustomer[0].history.push(savedBill._id);
          await existcustomer[0].save();
        } else {
          const newCustomer = new customerBill({
            customerName: customerName,
            phoneNumber: customerPhone,
            history: [savedBill._id],
          });
          await newCustomer.save();
        }
        res.status(200).json({ message: "successfull" });
      });

    /*if (balanceAmount === 0) {
      billup = new bill({
        products: items,
        totalAmount: totalAmount,
        paidStatus: true,
        paidAmount: paidAmount,
        balanceAmount: balanceAmount,
      });
      (newBill.totalAmount = totalAmount),
        (newBill.paidStatus = true),
        (newBill.paidAmount = paidAmount),
        (newBill.balanceAmount = balanceAmount);
    } else {
      billup = new bill({
        products: items,
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        balanceAmount: balanceAmount,
        balanceDuration: balanceDuration,
      });
      (newBill.totalAmount = totalAmount),
        (newBill.paidAmount = paidAmount),
        (newBill.balanceAmount = balanceAmount),
        (newBill.balanceDuration = balanceDuration);
    }
    const savedBill = await newBill.save();
    //const soldto = await billup.save();*/

    //adding bill to customer
    /*const existcustomer = await customerBill.find({
      customerName: customerName,
      phoneNumber: customerPhone,
    });
    if (existcustomer.length > 0) {
      existcustomer[0].history.push(savedBill._id);
      await existcustomer[0].save();
    } else {
      const newCustomer = new customerBill({
        customerName: customerName,
        phoneNumber: customerPhone,
        history: [savedBill._id],
      });
      await newCustomer.save();
    }
    res.status(200).json({ message: "successfull" });*/
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "please try again" });
  }
};

//update bill content

const updateBillContent = async (req, res) => {
  try {
    const billId = req.body.billId;
    const items = req.body.items;
    const totalAmount = req.body.totalAmount;
    const paidAmount = req.body.paidAmount;
    const balanceAmount = totalAmount - paidAmount;
    const balanceDuration = req.body.balanceDuration;

    const addedItemIds = [];
    const newItemPromises = [];

    for (const element of items) {
      const quantity = element.requiredQuantity;

      // Create a promise for updating available items
      const updatePromise = updateAvailableItems(element.productId, quantity);

      // Create a promise for creating a new productforbill item
      const newItemPromise = updatePromise.then(async () => {
        const newItem = await productforbill.updateOne(
          { _id: element._id },
          { productId: element.productId, requiredQuantity: quantity }
        );

        addedItemIds.push(element._id.toString());
        return newItem;
      });

      newItemPromises.push(newItemPromise);
    }
    let billup;

    Promise.all(newItemPromises).then(async (newItems) => {
      if (balanceAmount === 0) {
        await bill.updateOne(
          { _id: billId },
          {
            products: addedItemIds,
            totalAmount: totalAmount,
            paidStatus: true,
            paidAmount: paidAmount,
            balanceAmount: balanceAmount,
          }
        );
      } else {
        await bill.updateOne(
          { _id: billId },
          {
            products: addedItemIds,
            totalAmount: totalAmount,
            paidAmount: paidAmount,
            paidStatus: false,
            balanceAmount: balanceAmount,
            balanceDuration: balanceDuration,
          }
        );
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "please try again" });
  }
};

//delete a product from bill

const deleteAfterBill = async (req, res) => {
  try {
    const deleteitemId = req.params.deleteitemId;
    const billId = req.params.billId;
    const productIdToUpdate = await productforbill.findById(
      {
        _id: deleteitemId,
      },
      { _id: 0 }
    );
    await availableitems.updateOne(
      { _id: productIdToUpdate.productId },
      { $inc: { quantity: productIdToUpdate.requiredQuantity } }
    );
    const productPrice = await availableitems.findById(
      { _id: productIdToUpdate.productId },
      { _id: 0, price: 1 }
    );

    const returnedAmount =
      productIdToUpdate.requiredQuantity * productPrice.price;

    await bill.updateOne(
      { _id: billId },
      {
        $pull: { products: deleteitemId },
        $inc: { totalAmount: -returnedAmount, balanceAmount: -returnedAmount },
      }
    );

    res.status(200).json({ message: "successfull" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "please try again ..." });
  }
};

//alter the require quantity after bill
const alterQuantityAfterBill = async (req, res) => {
  const billId = req.params.billId;
  const productItemId = req.params.itemId;
  const quantity = req.body.quantity;
  const availableItemToUpdate = await productforbill.findById(
    { _id: productItemId },
    { _id: 0 }
  );
  const priceOfItem = await availableitems.findOne(
    { _id: availableItemToUpdate.productId },
    { _id: 0, price: 1 }
  );
  console.log(quantity, availableItemToUpdate);
  try {
    if (quantity > availableItemToUpdate.requiredQuantity) {
      const newlyAddedQuantity =
        quantity - availableItemToUpdate.requiredQuantity;
      const updatedAmount = priceOfItem.price * newlyAddedQuantity;
      console.log("amount  ", updatedAmount, newlyAddedQuantity);

      await productforbill.updateOne(
        { _id: productItemId },
        { $inc: { requiredQuantity: newlyAddedQuantity } }
      );
      await bill.updateOne(
        { _id: billId },
        { $inc: { totalAmount: updatedAmount, balanceAmount: updatedAmount } }
      );
      await availableitems.updateOne(
        { _id: availableItemToUpdate.productId },
        { $inc: { quantity: -newlyAddedQuantity } }
      );
      res.status(200).json({ message: "successfully added" });
    } else {
      const returnedQuantity =
        availableItemToUpdate.requiredQuantity - quantity;
      const updatedAmount = priceOfItem.price * returnedQuantity;

      await productforbill.updateOne(
        {
          _id: productItemId,
        },
        { $inc: { requiredQuantity: -returnedQuantity } }
      );
      await bill.updateOne(
        { _id: billId },
        { $inc: { totalAmount: -updatedAmount, balanceAmount: -updatedAmount } }
      );
      await availableitems.updateOne(
        { _id: availableItemToUpdate.productId },
        { $inc: { quantity: returnedQuantity } }
      );

      res.status(200).json({ message: "successfully done" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "please try again" });
  }
};

//add item after bill
/*
const addItemAfterBill = async (req, res) => {
  try {
    const billId = req.params.billId;
    const itemDetails = req.body.item;

    const check = await bill
      .findOne({
        _id: billId,
      })
      .populate("products");
    const alreadyInBill = check.products.find(
      (product) => product.productId.toString() === itemDetails.productId
    );

    if (check && alreadyInBill) {
      alreadyInBill.requiredQuantity =
        alreadyInBill.requiredQuantity + itemDetails.quantity;
      await alreadyInBill.save();
      await availableitems.updateOne(
        { _id: itemDetails.productId },
        { $inc: { quantity: -itemDetails.quantity } }
      );

      const productPrice = await availableitems.findById(
        { _id: itemDetails.productId },
        { _id: 0, price: 1 }
      );
      const updatebalance = itemDetails.quantity * productPrice.price;
      await bill.updateOne(
        { _id: billId },
        { $inc: { totalAmount: updatebalance, balanceAmount: updatebalance } }
      );

      res.status(200).json({ message: "successfully added" });
    } else {
      const newItem = new productforbill({
        productId: itemDetails.productId,
        requiredQuantity: itemDetails.quantity,
      });
      await newItem.save();
      await availableitems.updateOne(
        { _id: itemDetails.productId },
        { $inc: { quantity: -itemDetails.quantity } }
      );

      const productPrice = await availableitems.findById(
        { _id: itemDetails.productId },
        { _id: 0, price: 1 }
      );
      const updatebalance = itemDetails.quantity * productPrice.price;
      await bill.updateOne(
        { _id: billId },
        { $inc: { totalAmount: updatebalance, balanceAmount: updatebalance } }
      );

      await bill.updateOne(
        { _id: billId },
        { $push: { products: newItem._id } }
      );
      res.status(200).json({ message: "successfully added" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "please try again" });
  }
};*/

//find customer
const findCustomer = async (req, res) => {
  try {
    const name = req.query.name;
    const customerName = await customerBill.find({});

    const searchRegex = new RegExp(name, "i");
    const names = customerName.filter((name) =>
      searchRegex.test(name.customerName)
    );

    res.status(200).json({
      sucess: true,
      customers: names,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

// API to display bill items

const billItems = async (req, res) => {
  try {
    const billId = req.query.id;
    const ItemsInBill = await bill.findById(billId).populate("products");
    console.log(ItemsInBill);
    res.status(200).json({
      sucess: true,
      items: ItemsInBill,
    });
  } catch (error) {
    res.status(400).json({ error: "Please try again" });
  }
};

//Dept collection for the day
const deptNotify = async (req, res) => {
  try {
    let currentDate = new Date().toJSON().slice(0, 10);
    currentDate = currentDate + "T00:00:00.000Z";
    const usersWithDept = await bill.find({
      paidStatus: false,
      balanceDuration: currentDate,
    });

    const userDetails = [];

    for (const bill of usersWithDept) {
      const nameandphone = await customerBill.findOne(
        { history: bill._id },
        { customerName: 1, phoneNumber: 1 }
      );
      const Details = {
        userName: nameandphone.customerName,
        phoneNumber: nameandphone.phoneNumber,
        balanceAmount: bill.balanceAmount,
        purchasedDate: bill.billingDate,
        billId: bill._id,
        customerId: nameandphone._id,
      };
      userDetails.push(Details);
    }

    res.status(200).json({ users: userDetails }); // Send response after all operations are complete
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Please try again" });
  }
};

// to update items quantity
const updateAvailableItems = async (productId, quantity) => {
  try {
    await availableitems.updateOne(
      { _id: productId },
      { $inc: { quantity: -quantity } }
    );
  } catch (error) {
    throw error; // Handle any potential errors during the update
  }
};

export {
  addTitile,
  addBill,
  deleteAfterBill,
  addItemAfterBill,
  alterQuantityAfterBill,
  findCustomer,
  billItems,
  deptNotify,
  findthrowId,
  updateBillContent,
};
