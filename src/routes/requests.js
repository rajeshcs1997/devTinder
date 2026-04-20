const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

//send connection request
requestRouter.post("/request/send/:status/:receiver", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const receiverId = req.params.receiver;
        const status = req.params.status;

        const allowedStatuses = ['ignored', 'interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send(`Invalid status. Allowed statuses are: ${allowedStatuses.join(", ")}`);
        }

        const receiverExists = await User.findById(receiverId);
        console.log("Receiver exists:", receiverExists);
        if (!receiverExists) {
            return res.status(404).send("Receiver not found.");
        }
        
        if (receiverId.toString() === user._id.toString()) {
            return res.status(400).send("You cannot send a connection request to yourself.");
        }

        // Check if a connection request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { sender: user._id, receiver: receiverId },
                { sender: receiverId, receiver: user._id }
            ]
        });

        if (existingRequest) {
            return res.status(400).send("Connection request already exists between these users.");
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            sender: user._id,
            receiver: receiverId,
            status: status
        });

        await connectionRequest.save();
        res.send(`${user.firstName} is ${status} in ${receiverExists.firstName}`);
        
    } catch (err) {
        res.status(500).send("Error occurred while saving connection request: " + err.message);
    }
});

module.exports = requestRouter;