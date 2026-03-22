const express = require("express");

const app = express();



app.use("/test", (req, res) => {
    res.send("Hello, World!");
});

app.use("/hello", (req, res) => {
    res.send("Hello, hellow hellow!");
});

app.use("/", (req, res) => {
    res.send("namaste from the dashboard");
}); 
app.listen(7777, () => {
  console.log("Server is running on port 7777");
});