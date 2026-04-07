const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kaundalanuj45_db_user:U32GSPTcSW2Ho5xR@cluster0.dqm4pyx.mongodb.net/cafe').then(() =>{
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