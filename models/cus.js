const mongoose = require("mongoose");

const cusSchema = new mongoose.Schema({
  name: String,
  address: String,
  password: String,
  code: String,
  phone: String,
  type: String,
  sub_type: String,
});

const Cus = mongoose.model("Cus", cusSchema);

exports.Cus = Cus;
