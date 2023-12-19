require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const passport = require("passport");
const config = require("./config");
const cookieParser = require("cookie-parser");

// Routers Config
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");
const uploadRouter = require("./routes/uploadRouter");
const favoriteRouter = require("./routes/favoriteRouter");

// MongoDB Config
const mongoose = require("mongoose");
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

var app = express();

// Passport config
app.use(passport.initialize());

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// Public folder config
app.use(express.static(path.join(__dirname, "public")));

// Debug logger Config
app.use(logger("dev"));
// Body parser config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("12345-67890-09876-54321"));

// app.all("*", (req, res, next) => {
//   if (req.secure) {
//     return next();
//   } else {
//     console.log(
//       `Redirecting to: https://${req.hostname}:${app.get("secPort")}${req.url}`
//     );
//     res.redirect(
//       301,
//       `https://${req.hostname}:${app.get("secPort")}${req.url}`
//     );
//   }
// });

// Routes Config
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favoriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
