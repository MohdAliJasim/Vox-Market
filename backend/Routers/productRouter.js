const express = require("express");
const Model = require("../models/ProductModel");
const {verifyToken} =require('../middleware/verifyToken');

const router = express.Router();

router.post("/addProduct", verifyToken, (req, res) => {
  req.body.seller = req.user.id;
  console.log(req.body);

  new Model(req.body)
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getall",verifyToken, (req, res) => {
  Model.find({ seller: req.user.id }).then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get("/getbyid/:id",(req, res) => {
  Model.findById(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getbyname/:name", (req, res) => {
  Model.find({ name: req.params.name })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.delete("/deletebyid/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/updatebyid/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
//above are seller specific routes...
//below routes dont need the middleware and are dor public ...
// Get all products (for browsing)
router.get("/browse", (req, res) => {
  Model.find()
    .populate("seller", "name businessName ratings") // Optional: populate seller info
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("Browse Error:", err);
      res.status(500).json({ error: "Failed to fetch products" });
    });
});

module.exports = router;
