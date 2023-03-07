dotenv.config();
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./config/db.js";
const app = express();

db();

app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => {
  console.log(`Server listening at Port ${process.env.PORT}`);
});
