import express from "express";
import {
  addBill,
  addItemAfterBill,
  addTitile,
  alterQuantityAfterBill,
  billItems,
  deleteAfterBill,
  deptNotify,
  findCustomer,
  findthrowId,
  updateBillContent,
} from "../controller/billingController.mjs";

const router = express.Router();

//add a title
router.get("/addtitle", addTitile);

router.post("/addbill", addBill);
//product details through id
router.get("/findthrowid", findthrowId);

router.delete("/delete/:billId/:deleteitemId", deleteAfterBill);

router.post("/additemafterbill", addItemAfterBill);

router.put("/alterQuantity/:billId/:itemId", alterQuantityAfterBill);

//find Customer
router.get("/customer/search", findCustomer);

//products in bill
router.get("/findItems", billItems);

//dept collection for today
router.get("/today", deptNotify);

//update bill
router.put("/updateBill", updateBillContent);

//history

//dept details

export default router;
