const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  password: String,
  code: String,
  phone: String,
  type: String,
  sub_type: String,
});

const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
