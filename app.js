import express from "express";
const app = express();
import { connectDatabase } from "./config/database.js";
import indexRouter from "./router/index.js";
import errorHandler from "./error/error.handler.js";
import { configDotenv } from "dotenv";

configDotenv();
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router
app.use("/", indexRouter);
app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
