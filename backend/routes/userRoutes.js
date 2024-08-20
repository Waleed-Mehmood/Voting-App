const express = require('express');
const router = express.Router();
const User = require('./../models/user')
const {jwtAuthMiddleware,generateToken} = require('./../jwt')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try{
      const data = req.body  // Assuming the request body contains the user data 

      if (data.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount > 0) {
          return res.status(400).json({ message: 'An admin already exists. Cannot create another admin.' });
        }
      }

    // Create a new User document using the mongoose model
    const newUser = new User(data); 

    // Save the new person to the database
    const response = await newUser.save();
    console.log('Data saved');

    const payload = {
      id: response.id,
      role: response.role
    }
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is: ", token);

    res.status(200).json({response: response,token: token});

    }catch(err){
      console.log(err);
      res.status(500).json({error: "Internal Server Error"});
    }
})

//Login Route
router.post('/login',async (req,res)=>{
  try{
    // Extract IDCardNumber and password from request body
    const {IDCardNumber,password} = req.body;

    // Find the user by username
    const user = await User.findOne({IDCardNumber: IDCardNumber});

    // If user does not exist or password does not match, return error
    if( !user || !(await user.comparePassword(password))){
      return res.status(401).json({error: "Invalid username or password"})
    }

    //generate token 
    const payload = {
      id: user.id,
      role: user.role
    }

    const token = generateToken(payload);

    //return token as response
    res.json({token});
  }catch(err){
    console.log(err);
    res.status(500).json({error: "Internal Server Error"})
  }
})

router.get('/profile',jwtAuthMiddleware, async (req, res)=>{
  try{
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user});
  }catch(err){
    console.log(err);
    res.status(500).json({error: "Internal Server Error"})
  }
})

// Profile Update Route
router.put('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from the token
    const { role, ...updateData } = req.body;  // Extract role and other update data from request body

    // Check if the update is trying to set the role to 'admin'
    if (role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', _id: { $ne: userId } });
      if (adminCount > 0) {
        return res.status(409).json({ message: 'An admin already exists. Cannot update to admin role.' });
      }
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(userId, { ...updateData, role }, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


// Update Password Route
router.put('/profile/password', async (req,res)=>{
  try{
    const userId = req.user; // Extract the id from the token
    const {currentPassword,newPassword} = req.body;  //Extract current and new passwords from request body

    // find the user by userId
    const user = await User.findById(userId);

    //If password does not match then,return error.
    if(!(await user.comparePassword(currentPassword))){
      return res.status(401).json({error: "Invalid username or password"})
    }

    //Update the user's password
    user.password = newPassword;
    await user.save();

    console.log('Password updated');
    res.status(200).json({message: "Password updated"});

  }catch(err){
      console.log(err);
      res.status(500).json({error: "Internal Server Error"});
  }
})


/// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { IDCardNumber } = req.body;

  try {
    // Find the user by their ID Card Number
    const user = await User.findOne({ IDCardNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a JWT token with encrypted user ID and a timestamp
    const resetToken = jwt.sign(
      { userId: user._id, timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS, // Use environment variables
      },
    });

    // Set up email data
    const mailOptions = {
      to: user.email,
      from: 'passwordreset@votingapp.com',
      subject: 'Password Reset',
      text: `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('There was an error sending the email: ', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset link sent to your email' });
    });
  } catch (err) {
    console.error('Server error: ', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID stored in the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the token has expired
    const tokenExpiration = new Date(decoded.iat * 1000);
    if (Date.now() - tokenExpiration > 3600000) { // 1 hour in milliseconds
      return res.status(400).json({ message: 'Token has expired' });
    }

    // Update the user's password
    user.password = password; // Make sure to hash the password before saving
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Invalid or expired token: ', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;



router.get("/me", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const votedCandidate = await getVotedCandidate(user._id);
    user.votedCandidate = votedCandidate;
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


async function getVotedCandidate(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null; // Handle case where user doesn't exist
    }
    return user.votedCandidate;
  } catch (err) {
    console.error("Error fetching voted candidate:", err);
    return null; // Handle errors gracefully
  }
}


module.exports = router;