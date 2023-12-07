require("dotenv").config();

const express = require("express");
const app = express();

// JSON body config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// morgan is a developer testing tool
const morgan = require("morgan");
app.use(morgan("dev"));

// public path directory config
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// view engine config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// MongoDB Confi
const mongoose = require("mongoose");
const mongodbURI =
  "mongodb+srv:/mongodb+srv://student9013559:YN1FQ35BsAs2j3fI@nucampworkshop.kmnhigf.mongodb.net/?retryWrites=true&w=majority";
//process.env.MONGO_URI;

const connect = mongoose.connect(mongodbURI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  // what happens if successful
  () => {
    console.log("Connected to live MongoDB server!");
  },
  // what happens if fails
  (error) => {
    console.log(error);
  }
);

const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");

app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);

module.exports = app;
