import mongoose, { connect } from "mongoose";

const connectDB = () => {
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("mongoose is connected"));
};

export default connectDB;
