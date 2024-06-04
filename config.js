const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/loginDb");

connect.then(() => {
    console.log("Databse connected successsfully");
})
.catch(() => {
    console.log("Database cannot be connected")
});

//login schema
const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type: String, required: true},
    role: {type:String, default: 'user'}, // user or admin
    createdAt:{type:Date, default:Date.now},

});

//create model
const User = new mongoose.model('users', UserSchema);

module.exports = {mongoose, User};