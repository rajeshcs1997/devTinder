const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, emailId, password} = req.body;
    if (!firstName) {
        throw new Error("First name is required");
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name must be at least 4 characters long and not exceed 50 characters");
    } else if (!emailId) {
        throw new Error("Email is required");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

const validateEditProfileData = (req) => {      
    const allowedEditsFields = ["firstName", "lastName", "emailId", "age", "gender",  "photoUrl", "about", "skills"];
    const updates = req.body;
    const isEditAllowed = Object.keys(updates).every((key) => allowedEditsFields.includes(key));
    return isEditAllowed;
};


module.exports = {
    validateSignUpData, validateEditProfileData
};