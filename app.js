const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const mongoURI = process.env.LOCAL_DB_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

const app = express();

app.use(cors());
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, "0.0.0.0", () => {
    console.log(`server running on port ${port}`);
})
