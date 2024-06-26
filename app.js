import express from "express";
const app = express();
import { connectDatabase } from "./config/database.js";
import indexRouter from "./router/index.js";
import errorHandler from "./error/error.handler.js";
import fileUpload from "express-fileupload";

process.loadEnvFile(".env");
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
// router
app.use("/", indexRouter);
//static files
app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: http://localhost:${process.env.PORT}`);
});
