const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cafe').then(() =>{
    console.log('database is connected')
});
const userdata = new mongoose.Schema({
    person:String,
    date:String,
    time:String,
    name:String,
    email:String,
    phone:Number,
    subject:String,
    message:String,
    place:String,
    adults:Number,
    children:Number
});
module.exports = mongoose.model('customer data',userdata);