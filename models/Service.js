const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
{
name:{
type:String,
required:true
},

description:{
type:String,
required:true
},

price:{
type:Number,
required:true
},

category:{
type:String,
required:true
},

image:{
type:String,
default:"https://via.placeholder.com/400x250"
},

averageRating:{
type:Number,
default:0
},

totalReviews:{
type:Number,
default:0
},

popularityScore:{
type:Number,
default:0
},

totalOrders:{
type:Number,
default:0
},

isActive:{
type:Boolean,
default:true
}

},
{timestamps:true}
);

module.exports = mongoose.model("Service",serviceSchema);