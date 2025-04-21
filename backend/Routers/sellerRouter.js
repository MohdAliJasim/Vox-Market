const express = require("express");
const Model = require("../models/SellerModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "topsecret";
const maxAge = 60 * 60 * 24 * 1;

const jwtSignature = (id,name,email) => {
  const payload = { id,name,email };
  return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h' });
};

router.get("/getAll", (req, res) => {
  Model.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
});

router.post("/addSeller",(req, res) => {
  console.log(req.body);
  // const { name, email, password, phoneNumber } = req.body;
  //asynchronous that why we will get promise obj
  const sellerData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password, // Ensure this is hashed
    phoneNumber: req.body.phoneNumber
  };
  new Model(sellerData)
    .save()
    //thenc is the shortcut
    .then((result) => {
      const token = jwtSignature(result._id,result.name,result.email);
      console.log(`Signup :-->${token}`);
      res.status(200).json({token: token,
        seller:{ name: result.name,
          email: result.email,
          avatar: result.avatar}
       });  
      
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/authenticate", (req, res) => {
  Model.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        //JWT to generate and verify the token and .env is used
        //payload , secretkey, expiry

        const { _id,name,email,password } = result;
        if (password === req.body.password) {
          const payload = { id:_id,name,email };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
              if (err) {
                console.log(err);
                return res.status(500).json(err);
              } else {
                console.log(`login :-->${token}`);
                console.log(payload);
                return res.status(200).json({ token: token,
                  seller:{name:result.name,
                  email:result.email,
                  avatar:result.avatar }
                });
              }
            }
          );
        }
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/test", (req, res) => {
  res.send("User Route working");
});

module.exports = router;
