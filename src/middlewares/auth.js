const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        const decoded = jsonwebtoken.verify(token, "dev@tinder$1997");
        const user = await User.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(401).send("Unauthorized");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).send("Error occurred while verifying user: " + err.message);
    }
};

module.exports = {
    userAuth
};  