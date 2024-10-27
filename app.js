const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const indexRouter = require("./routes/index");

const port = process.env.PORT;
const mongoURI = process.env.LOCAL_DB_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to ", mongoURI, " MongoDB"); 
}).catch((err) => {
    console.log(err);
});

const app = express();

app.use(cors());
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use("/api", indexRouter);

app.listen(port, "0.0.0.0", () => {
    console.log(`server running on port ${port}`);
})
