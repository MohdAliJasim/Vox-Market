const express = require("express");
const router = express.Router();
const Model = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { requireAuth } = require("../middleware/authMiddleware");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "topsecret"; //change this code after every thing is working
const maxAge = 60 * 60 * 24 * 1;

const jwtSignature = (id,name,email) => {
  const payload = { id,name,email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: maxAge });
};

const hashPassword = (plainTextPassword) => {
  const saltRounds = 10; // The cost factor for hashing, a common choice is 10
  const hashedPassword = bcrypt.hash(plainTextPassword, saltRounds);
  return hashedPassword;
};

router.get("/test", (req, res) => {
  res.send("User Route working");
});

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

router.post("/addUser", async (req, res) => {
  console.log(req.body);
  const { name, email, password, phoneNumber } = req.body;
  const newPass = await hashPassword(password);

  new Model({ name, email, password: newPass, phoneNumber })
    .save()
    .then((result) => {
      const token = jwtSignature(result._id,result.name,result.email);
      // res.cookie("jwt", token, { maxAge: maxAge * 1000 });
      console.log(token);
      console.log("new Password: ", newPass);
      res.status(200).json({token: token,
        user:{ name: result.name,
          email: result.email,
          avatar: result.avatar}
       });  
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  Model.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      } else {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            const token = jwtSignature(user._id,user.name,user.email);
            // res.cookie("jwt", token, { maxAge: maxAge * 1000 });
            return res.status(200).json({
              token,
              user:{ name: user.name,
              email: user.email,
              avatar: user.avatar}
            });
          } else {
            console.log(err);
            return res.status(400).json({ message: "Login failed" });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(201).json({ message: "Logout user success" });
});

router.get("/profile", requireAuth, (req, res) => {
  const user = req.user;
  console.log(user);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  res.status(200).json(user);

  // Model.findById(userId).select('-password')
  // .then((result) => {
  //     console.log(result);
  //     res.status(200).json(result);

  // }).catch((err) => {
  //     res.status(400).json(err);
  // });
});

router.put("/profile", requireAuth, (req, res) => {
  const oldUser = req.user;
  const userId = req.user._id;
  const newUser = req.body;

  if (!newUser.email || !newUser.name) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  Model.findByIdAndUpdate(
    userId,
    {
      name,
      email,
      phoneNumber,
    },
    { new: true }
  )
    .select("-password")
    .then((result) => {
      res.status(200).json({
        message: "Profile updated successfully",
        user: result,
      });
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = router;
