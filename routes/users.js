const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const { Customer } = require("../models/customer");
const { Cus } = require("../models/cus");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const json2csv = require("json2csv").parse;

const fields = [
  { label: "code", value: "code" },
  { label: "name", value: "name" },
  { label: "phone", value: "phone" },
  { label: "address", value: "address" },
  { label: "type", value: "type" },
  { label: "sub_type", value: "sub_type" },
];

// router.get('/me', auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password');
//   res.send(user);
// });

router.post('/', async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("B4c0/\/", salt);
  user.password = hash;
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

});

router.get("/compare", async (req, res) => {
  const customers = await Customer.find();
  let cus_count = 0;
  let user_count = 0;
  let duplicate_user = [];
  for (let i = 0; i < customers.length; i++) {
    let user = await User.find({ code: customers[i].code });
    console.log(user);
    if (user.length) {
      cus_count++;
      duplicate_user.push(user);
    } else {
      let cus = new Cus({
        name: customers[i].name,
        phone: customers[i].phone,
        code: customers[i].code,
        tye: customers[i].type,
        subTye: customers[i].sub_tye,
        address: customers[i].address,
        password: customers[i].password,
      });

      await cus.save();
    }
    //break;
    // return res.send(user);
  }
  console.log("duplicate count: ", cus_count);
  res.send(duplicate_user);
});

router.get("/export", async (req, res) => {
  const customers = await Cus.find();
  let custo = customers.map((r) => {
    return {
      code: r.code,
      name: r.name,
      sub_type: "Sales Executive",
      phone: r.phone,
      type: "Sales Executive",
      address: r.address,
    };
  });
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let filename = "user" + "-" + date + ".csv";
  let csvf;
  try {
    csvf = json2csv(custo, { fields });
  } catch (err) {
    return res.status(500).json({ err });
  }
  res.attachment(filename);
  res.status(200).send(csvf);
});

module.exports = router;
