import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import * as keys from "./config/key.mjs";
import product from "./routes/productRoute.mjs";
import bill from "./routes/billingRoute.mjs";

const app = express();
const database = keys.database;
const port = keys.port;

app.use(cors());

app.use(express.json());

app.use("/product", product);

app.use("/bill", bill);

mongoose.connect(database.url).then(() => {
  app.listen(port, () => {
    console.log(`Connected to db & listening on ${port}`);
  });
});
