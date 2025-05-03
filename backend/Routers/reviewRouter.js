const express =require("express");
const router = express.Router();
const Model = require("../models/ReviewModel");
const {requireAuth} = require("../middleware/authMiddleware");

//remove require Auth middleware for testing .
router.post("/addreview",requireAuth,(req,res)=>{
    const {productId,rating,comment}=req.body;
    const userId = req.user.id;

    Model.findOne({productId,userId}).then((result) => {
        if(result){
            return res.status(400).json({message:"Already reviewed the product"});
        }
        const newRew=new Model({ productId, userId, rating, comment }).save();
        return res.status(200).json({message:"review add",data:newRew,});
    }).catch((err) => {
        res.status(500).json({ message: "Server error", error: err.message });
    });
});

router.get("/getall/:productId",(req,res)=>{
    Model.find({productId:req.params.productId}).populate("userId","name")
    .sort({createdAt:-1})
    .then((result) => {
        res.status(200).json({message:"success",data:result});
    }).catch((err) => {
        res.status(500).json({ message: "Server error", error: err.message });
    });
});

module.exports = router;