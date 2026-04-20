const validator = require("validator");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error("Invalid email " + v);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(v) {
            if (!validator.isStrongPassword(v)) {
                throw new Error("weak password " + v);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(male|female|other)$/i.test(v);
            },
            message: "Invalid gender"
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
        validate(v) {
            if (!validator.isURL(v)) {
                throw new Error("Invalid photo URL " + v);
            }
        }
    },
    about: {
        type: String,
        default: "this is default about"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

userSchema.methods.getToken = async function () {
    return await jsonwebtoken.sign({ _id: this._id }, "dev@tinder$1997", { expiresIn: "1d" });
}

userSchema.methods.encryptPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
const User = mongoose.model("User", userSchema);

module.exports = User;