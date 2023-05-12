const config = require('config');
const User = require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    try {
    // Get user input
    const { firstname, lastname, email, password } = req.body;

    // Validate user input
    if (!(email && password && firstname && lastname)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    // Create user in our database
    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      config.get('PrivateKey'),
      {
        expiresIn: "2h",
      }
    );

    // return new user
    res.header('x-auth-token', token).status(201).json(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.post('/login', async (req, res)=>{
    try {
        const { email, password } = req.body;
        
        if(!(email && password)){
            return res.status(400).send("All fields are required.");
        }
        const user = await User.findOne({ email });
        if( user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                { user_id: user._id, email },
                config.get('PrivateKey'),
                {
                  expiresIn: "2h",
                }
              );
    
            res.header('x-auth-token', token).status(200).json({user, message: "User logged in successfully."});
        }else{
            res.status(400).send("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

//return user info
userRouter.get("/profile/:userId", auth, async(req, res)=>{
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if(user){
      res.status(200).json(user);
    }else{
      res.status(404).send("User profile cannot be found.");
    }

  } catch (error) {
    res.status(400).send(error);
  }  
});

userRouter.put('/profile/:userId', auth, async(req, res) =>{
  try {
    const { userId } = req.params;
    const reqdata = req.body;
    const user = await User.findById(userId);

    if(!user){
      console.log(user)
      res.status(404).send("User profile cannot be found.");
    }
    
    //isolate old data
    const oldData = user;
    
    //change to new data if not null else retain old
    user.firstname = reqdata.firstname ?? oldData.firstname;
    user.lastname = reqdata.lastname ?? oldData.lastname;
    user.faves = reqdata.faves ?? oldData.faves;
    user.email = reqdata.email ?? oldData.email;
    
    await user.save();

    res.status(200).json({message: "User profile updated successfully."});

  } catch (error) {
    res.status(400).send(error);
  }  
});


module.exports = userRouter;
 
