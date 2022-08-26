const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN", "SELLER", "SUPPORTER", "CUSTOMER"]
  },
  permissions :{
      create:{
        type: Boolean,
        required: true,
        default:false 
      },
      update:{
        type: Boolean,
        required: true,
        default:false 
      },
      delete:{
        type: Boolean,
        required: true,
        default:false 
      },
      fetch:{
        type: Boolean,
        required: true,
        default:false 
      }
  }

});

const User = mongoose.model("User", UserSchema);

module.exports = User;