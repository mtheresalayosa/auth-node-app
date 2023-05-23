import { get } from "config";
import { error as _error, info } from "../utils/logger";
import { findOne, create, findById } from "../models/user";
import { genSalt, hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const register = async (req, res) => {
  try {
    // Get user input
    const { firstname, lastname, email, password } = req.body;

    // Validate user input
    if (!(email && password && firstname && lastname)) {
      _error("email, password, firstname, lastname are required");
      res.status(400).send("All input are required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const checkUser = await findOne({ email });

    if (checkUser) {
      _error("User already exist.");
      return res.status(409).send("User already exist. Please Login");
    }

    //Encrypt user password
    const salt = await genSalt(10);
    const encryptedPassword = await hash(password, salt);

    // Create user in our database
    const user = await create({
      firstname,
      lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = sign({ user_id: user._id, email }, get("PrivateKey"), {
      expiresIn: "2h",
    });

    info("Registered new user..");
    // return new user
    res.header("x-auth-token", token).status(201).json(user);
  } catch (err) {
    _error(err);
    res.status(400).send(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      _error("Unable to login; email, password are required fields.");
      return res.status(400).send("All fields are required.");
    }
    const user = await findOne({ email });
    if (user && (await compare(password, user.password))) {
      const token = sign({ user_id: user._id, email }, get("PrivateKey"), {
        expiresIn: "2h",
      });
      info("User logged in successfully");
      res
        .header("x-auth-token", token)
        .status(200)
        .json({ user, message: "User logged in successfully." });
    } else {
      _error("Invalid Credentials");
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    _error(error);
    res.status(400).send(error);
  }
};

const userProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await findById(userId);

    if (user) {
      info("Get user profile..");
      res.status(200).json(user);
    } else {
      _error("User profile cannot be found.");
      res.status(404).send("User profile cannot be found.");
    }
  } catch (error) {
    _error(error);
    res.status(400).send(error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const reqdata = req.body;
    const user = await findById(userId);

    if (!user) {
      _error("User profile cannot be found.");
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

    info("Success updating user profile");
    res.status(200).json({ message: "User profile updated successfully." });
  } catch (error) {
    _error(error);
    res.status(400).send(error);
  }
};

export {
  register,
  login,
  userProfile,
  updateProfile,
};