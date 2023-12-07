const express = require("express");
const app = express();

//Morgan is a middleware function that will log information about the incoming request to the server
const morgan = require("morgan");
app.use(morgan("dev"));

//This middleware function will parse the body of the request message and then make it available to the Express application
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// MongDB config
const mongoose = require("mongoose");
const mongodbURI =
  "mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority";

const connect = mongoose.connect(mongodbURI, {
  //useNewUrlParser: true,
  //useFindAndModify: False,
  //useNewURLParser: true,
  // useUnifiedTopology: true
});
//routes
const campsiteRouter = require("./routes/campsiteRouter");
const partnerRouter = require("./routes/partnerRouter");
const promotionRouter = require("./routes/promotionRouter");

app.use("/campsites", campsiteRouter);
app.use("/partners", partnerRouter);
app.use("/promotions", promotionRouter);

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

//app.listen(port, hostname, () => {
//    console.log(`Server running at http://${hostname}:${port}/`);
//});

console.log("Everything is awesome!");
