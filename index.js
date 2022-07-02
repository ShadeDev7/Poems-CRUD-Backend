const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URI }));

app.use("/api/poems", require("./routes/poems"));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to the Database."))
    .catch(e => console.error(e));

app.listen(port, () => console.log(`Server started on port ${port}.`));
