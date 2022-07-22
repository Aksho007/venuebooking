const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const app = express();
const Booking = require("./schema/venueSchema");
const user = require("./schema/loginSchema");
const timeSecConv = require("time-to-seconds");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const MongoURL = "mongodb://localhost:27017/booking";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.render("login", {
      success: "Please login before booking",
    });
  }
};

// Session

const store = new MongoDBStore({
  uri: MongoURL,
  collection: "users",
});

app.use(
  session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Main Login page

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

    if (isMatch) {
      req.session.isAuth = true;
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

// Venue Booking Page

app.get("/booking", isAuth, function (req, res) {
  res.render("venueBooking", { success: "" });
});

app.post("/booking", async (req, res) => {
  try {
    var TimeInSecFrom = timeSecConv(`${req.body.timeFrom}:0`);
    var TimeInSecTo = timeSecConv(`${req.body.timeTo}:0`);

    // var result = await Booking.find({
    //   $and: [{ venue: `${req.body.venue}` }, { date: `${req.body.date}` }],
    // });
    // // console.log(result);

    // var resultCount = await Booking.find({
    //   $and: [{ venue: `${req.body.venue}` }, { date: `${req.body.date}` }],
    // }).count();
    // // console.log(resultCount);

    // var newbo = await Booking.find({
    //   date: `${req.body.date}`,
    //   $and: [
    //     { TimeInSecFrom: { $gt: `${TimeInSecToR}` } },
    //     { TimeInSecTo: { $lt: `${TimeInSecFromR}` } },
    //   ],
    // });
    // console.log(newbo);

    const bookVenue = new Booking({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      venue: req.body.venue,
      timeFrom: req.body.timeFrom,
      timeTo: req.body.timeTo,
      TimeInSecFrom:TimeInSecFrom,
      TimeInSecTo: TimeInSecTo,
      date: req.body.date,
      purpose: req.body.purpose,
    });
    const venueBooked = await bookVenue.save();

    res.status(201).render("venuebooking", {
      success: "You will be informed via email about your booking.",
    });
    console.log("Booking Successful");
  } catch (error) {
    res.status(400).send(error);
    console.log("data not saved");
  }
});

// Register user page

app.get("/register", function (req, res) {
  req.session.isAuth = true;
  console.log(req.session);
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

      console.log("lol", newUser);
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

// Server running port

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = app;
