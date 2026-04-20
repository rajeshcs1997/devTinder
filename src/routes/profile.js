const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// get profile of logged in user
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.status(500).send("Error occurred while fetching user=> " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid updates! Only allowed to update: " + allowedEditsFields.join(", "));
        }
        const user = req.user;
        const updates = Object.keys(req.body);
        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        await user.save();
        res.json(
            {
                message: `${user.firstName}, your profile has been updated successfully`,
                data: user
            }
        );  
    } catch (err) {
        res.status(500).send("Error occurred while updating profile: " + err.message);
    }
});

// forgot password
profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send("Both old password and new password are required");
        }
        const isOldPasswordMatch = await user.validatePassword(oldPassword);
        if (!isOldPasswordMatch) {
            return res.status(400).send("Old password is incorrect");
        }
        const encryptedPassword = await user.encryptPassword(newPassword);
        user.password = encryptedPassword;
        await user.save();
        res.send("Password updated successfully");
    } catch (err) {
        res.status(500).send("Error occurred while processing forgot password request: " + err.message);
    }
});

module.exports = profileRouter;
