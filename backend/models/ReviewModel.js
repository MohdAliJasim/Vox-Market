const {Schema,model,Types} = require("../connection");

const reviewSchema=new Schema({
productId:{
    type:Types.ObjectId,
    ref:"productcollections",
},
userId:{
    type:Types.ObjectId,
    ref:"users",
},
rating:{
    type:Number,
    required:true,
    min:1,
    max:5,
},
comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports=model("review",reviewSchema);