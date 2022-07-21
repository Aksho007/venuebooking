const mongoose = require("mongoose");

const venueSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  timeFrom: {
    type: String,
    required: true,
  },
  timeTo: {
    type: String,
    required: true,
  },
  TimeInSecFrom: {
    type: Number,
    required: true,
  },
  TimeInSecTo: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
});

const Booking = new mongoose.model("booking", venueSchema);

module.exports = Booking;
