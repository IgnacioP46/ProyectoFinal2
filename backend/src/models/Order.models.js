const { Schema, model, Types } = require("mongoose");
const orderSchema = new Schema({
  user:{type:Types.ObjectId,ref:"User",required:true},
  items:[{ vinyl:{type:Types.ObjectId,ref:"Vinyl",required:true}, qty:{type:Number,min:1,required:true}, priceAtPurchase:{type:Number,required:true} }],
  status:{type:String,enum:["created","paid","shipped","cancelled"],default:"created"},
  total:{type:Number,required:true}
},{timestamps:true});
module.exports = model("Order", orderSchema);
