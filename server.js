dotenv.config();
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";

const app = express();

connectDB();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server listening at Port ${process.env.PORT}`);
});
