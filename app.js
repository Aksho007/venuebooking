const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const app = express();
const Booking = require("./schema/venueSchema");
const user = require("./schema/loginSchema");
const timeSecConv = require("time-to-seconds");
const bcrypt = require("bcryptjs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");

app.get("/", function (req, res) {
  res.render("login", { success: "" });
});

app.post("/", async (req, res) => {
  try {
    const loginEmail = req.body.loginEmail;
    const loginPassword = req.body.loginPassword;

    const loginUserEmail = await user.findOne({ loginEmail: loginEmail });
    const isMatch = await bcrypt.compare(
      loginPassword,
      loginUserEmail.loginPassword
    );

    console.log(isMatch);
    // user.findOne({ loginEmail: loginEmail }, (err, user) => {
    if (isMatch) {
      res.status(201).render("venueBooking");
    } else {
      res.render("login", {
        success: "Invalid email or password",
      });
    }
  } catch (err) {
    res.status(400).render("login", {
      success: "Invalid email or password",
    });
  }
});

app.get("/booking", function (req, res) {
  res.render("venueBooking", { success: "" });
});

app.post("/booking", async (req, res) => {
  try {
    var TimeInSecFromR = timeSecConv(`${req.body.timeFrom}:0`);
    var TimeInSecToR = timeSecConv(`${req.body.timeTo}:0`);

    var result = await Booking.find({
      $and: [{ venue: `${req.body.venue}` }, { date: `${req.body.date}` }],
    });
    // console.log(result);

    var resultCount = await Booking.find({
      $and: [{ venue: `${req.body.venue}` }, { date: `${req.body.date}` }],
    }).count();
    // console.log(resultCount);

    var newbo = await Booking.find({
      date: `${req.body.date}`,
      $and: [
        { TimeInSecFrom: { $gt: `${TimeInSecToR}` } },
        { TimeInSecTo: { $lt: `${TimeInSecFromR}` } },
      ],
    });
    console.log(newbo);

    // const bookVenue = new Booking({
    //   name: req.body.name,
    //   email: req.body.email,
    //   number: req.body.number,
    //   venue: req.body.venue,
    //   timeFrom: req.body.timeFrom,
    //   timeTo: req.body.timeTo,
    //   TimeInSecFrom:TimeInSecFrom,
    //   TimeInSecTo: TimeInSecTo,
    //   date: req.body.date,
    //   purpose: req.body.purpose,
    // });
    // const venueBooked = await bookVenue.save();

    // res.status(201).render("venuebooking", {
    //   success: "You will be informed via email about your booking.",
    // });
    console.log("Booking Successful");
  } catch (error) {
    res.status(400).send(error);
    console.log("data not saved");
  }
});

app.get("/register", function (req, res) {
  res.render("register", { success: "" });
});

app.post("/register", async (req, res) => {
  try {
    const registerPass = req.body.registerPassword;
    const confirmPass = req.body.confirmPassword;

    if (registerPass === confirmPass) {
      const registerUser = new user({
        loginEmail: req.body.registerEmail,
        loginPassword: req.body.registerPassword,
      });
      const newUser = await registerUser.save();
      res.status(201).render("register", {
        success: "User registered",
      });
    } else {
      res.render("register", {
        success: "Passwords don't match",
      });
    }
  } catch (error) {
    res.status(400);
    res.render("register", {
      success: "Email already exist",
    });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = app;
