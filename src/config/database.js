const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://rajesh_db_user:BHErqeAcd5qzcXfF@devtinder.ic8majr.mongodb.net/devTinder");
    
}

module.exports = connectDB;