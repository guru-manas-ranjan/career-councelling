import jwt from "jsonwebtoken";
import { MongoDBService } from "../service/MongoDBService.js";
import { JWT_KEY, TABLE_NAMES } from "../utils/config.js";
import { comparePassword, hashPassword } from "../service/BcryptService.js";
import { ObjectId } from "mongodb";

const mongoDBService = new MongoDBService();

export const  createUser = async (req, res) => {
  try {
    const isUserExist = await mongoDBService.findByUniqueValue(
      TABLE_NAMES.USERS,
      req.body.phoneNumber
    );
    if (isUserExist) {
      return res.json({
        statusCode: 404,
        message: "User Exist Already",
      });
    }
    if (!req.body.password || req.body.password.length < 8) {
      return res.json({
        statusCode: 404,
        message: "Password is atleast of 8 characters",
      });
    }
    const hashedPassword = await hashPassword(req.body.password);
    const userItem = {
      _id: new ObjectId(),
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: hashedPassword,
      role: ["student"],
      interests: req.body.interests,
      profile: {
        age: req.body.age,
        gender: req.body.gender,
        education: req.body.education,
        major: req.body.major,
        skills: req.body.skills,
        careerGoals: req.body.careerGoals,
        mentorshipPreference: {
          preferredIndustry: req.body.preferredIndustry,
          preferredSkills: req.body.preferredSkills,
          preferredLocation: req.body.preferredLocation,
        },
      },
      createdAt: new Date(),
    };
    const createUserResponse = await mongoDBService.createItem(
      TABLE_NAMES.USERS,
      userItem
    );
    const payload = {
      _id: userItem._id,
      phoneNumber: userItem.phoneNumber,
      email: userItem.email,
      role: userItem.role,
      intersts: userItem.intersts,
    };
    const token = jwt.sign(payload, JWT_KEY, { expiresIn: "8h" });
    return res.json({
      token,
      statusCode: 200,
      message: "User Created Successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    // Check if the user exists in the database
    const user = await mongoDBService.findByUniqueValue(
      TABLE_NAMES.USERS,
      phoneNumber
    );

    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    }

    // Check if the provided password matches the hashed password stored in the database
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Incorrect password" });
    }

    // Generate payload for JWT token
    const payload = {
      _id: user._id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      interests: user.interests,
    };

    // Generate JWT token with the payload
    const token = jwt.sign(payload, JWT_KEY, { expiresIn: "8h" });

    return res.json({
      token,
      statusCode: 200,
      message: "Login successful",
    });
  } catch (error) {
    return res.json({
      statusCode: 404,
      message: error.message,
    });
  }
};
