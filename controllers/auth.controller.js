const db = require("../models");
const config = require("../config/auth.config");
const saltRounds = 10;
const User = db.user;
const Customer = db.customer;
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signin = async (req, res) => {
  console.log(req.body);

  const msv = req.body.username;
  const pwd = req.body.password;

  try {
    const data = await User.findOne({
      where: {
        username: msv,
      },
    });

    if (!data) {
      return res.status(403).send({
        message: "Tài khoản hoặc mật khẩu không đúng.",
      });
    } else {
      console.log(data[0]);

      const hashedPassword = await bcrypt.hash(pwd, data.salt);

      if (hashedPassword !== data.password) {
        return res.status(403).send({
          message: "Tài khoản hoặc mật khẩu không đúng.",
        });
      }

      const token = jwt.sign(
        {
          User: data.username,
        },
        config.secret,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      res.status(200).send({
        accessToken: token,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.register = async (req, res) => {
  const user = {
    username: req.body.username ? req.body.username : "",
    password: req.body.password ? req.body.password : "",
    salt: "",
    status: true,
    roleId: 1
  };

  const customer = {
    full_name: req.body.full_name ? req.body.full_name : "",
    address: req.body.address ? req.body.address : "",
    phone_number: req.body.phone_number ? req.body.phone_number : "",
    email_address: req.body.email_address ? req.body.email_address : "",
    UserId: 0,
  };

  try {
    const dataUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    const dataCustomer= await Customer.findOne({
      where:{
        email_address: customer.email_address,
      }
    })
    if (dataUser != null){
      return res.send("Username đã tồn tại");
      
    }
    if (dataCustomer!=null){
      return res.send('Email đã tồn tại');
      
    }
    const salt = await bcrypt.genSalt(saltRounds);
    user.salt = salt;
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    const createdUser = await User.create(user);
    console.log(createdUser.id);
    customer.UserId = createdUser.id;
    await Customer.create(customer);

    return res.send("create user successfully");


  } catch (err) {
    // res.status(500).send({
    //   message:
    //     err.message || "Some error occurred while creating the Customer.",
    // });
    console.log(err.message)

  }
};