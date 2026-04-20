const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const authRouter = express.Router();

// create user
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const user = new User(req.body);
        const hashedPassword = await user.encryptPassword(user.password);
        user.password = hashedPassword;
        await user.save();
        res.send("User signed up successfully");
    } catch (err) {
        res.status(400).send(`Error occurred while signing up user: ${err.message}`);
    }
});

//login user
authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send("Invalid credentials");
        }
        const isPasswordMatch = await user.validatePassword(password);
        if (isPasswordMatch) {
            user.getToken().then((token) => {       
                res.cookie("token", token, );
                res.send("User logged in successfully");
            });
        } else {
            return res.status(401).send("Invalid credentials");
        }

    } catch (err) {
        res.status(500).send(`Error occurred while logging in user: ${err.message}`);
    }
});

//logout user
authRouter.post("/logout", userAuth, async (req, res) => {
    try {
        res.clearCookie("token");
        res.send("User logged out successfully");
    } catch (err) {
        res.status(500).send(`Error occurred while logging out user: ${err.message}`);
    }
});

module.exports = authRouter;