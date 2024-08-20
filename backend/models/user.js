// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// // Define the user schema
// const userSchema = new mongoose.Schema({
//     name:{
//         type: String,
//         required: true
//     },
//     age:{
//         type: Number,
//         required: true
//     },
//     email:{
//         type: String
//     },
//     mobile:{
//         type: String
//     },
//     address:{
//         type: String,
//         required: true
//     },
//     IDCardNumber:{
//         type: Number,
//         required: true,
//         unique: true
//     },
//     password:{
//         type: String,
//         required: true
//     },
//     role:{
//         type: String,
//         enum: ['voter','admin'],
//         default: 'voter'
//     },
//     isVoted:{
//         type: Boolean,
//         default: false
//     }
// })

// userSchema.pre('save', async function(next){
//     const user = this;

//     // Hash the password only if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     try{
//         // hash password generation
//         const salt = await bcrypt.genSalt(10);

//         // hash password
//         const hashedPassword = await bcrypt.hash(user.password,salt);

//         // Override the plain password with the hashed one
//         user.password = hashedPassword
//         next();
//     }catch(err){
//         return next(err);
//     }
// })

// userSchema.methods.comparePassword = async function(candidatePassword){
//     try{
//         // use bcrypt to compare the provided password with the hashed password
//         const isMatch = await bcrypt.compare(candidatePassword,this.password);
//         return isMatch;
//     }catch(err){
//         throw err;
//     }
// }

// // Create Person model
// const User = mongoose.model('User',userSchema,'User');
// module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  IDCardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
  votedCandidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    default: null,
  },
  // resetPasswordToken: String,
  // resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
  const user = this;

  // Hash the password only if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Override the plain password with the hashed one
    user.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

// Create User model
const User = mongoose.model("User", userSchema, "User");
module.exports = User;
