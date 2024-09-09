import express from "express";
import { json, urlencoded } from "body-parser";
import userRoutes from "./routes/userRoutes";
var cors = require("cors");
var logger = require("morgan");
import dotenv from "dotenv";
import mongoose from "mongoose";
var createError = require("http-errors");
dotenv.config();
const app = express(); 

const PORT = 3002;

let corsOption = {
  origin: ["*"],
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

mongoose.connect("mongodb://localhost:27017/mydb")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


app.use(cors(corsOption));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use(express.json());

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(
  (
    err: Error,
    req: express.Request | express.RequestHandler,
    res: express.Response | any,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
