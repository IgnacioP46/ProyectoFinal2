const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  name:{type:String,required:true}, email:{type:String,required:true,unique:true,lowercase:true},
  passwordHash:{type:String,required:true}, role:{type:String,enum:["user","admin"],default:"user"},
  address:String, phone:String
},{timestamps:true});
module.exports = model("User", userSchema);
