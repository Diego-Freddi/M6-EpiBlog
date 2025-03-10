require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


//Routes
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// Mongo
mongoose.connect(process.env.MONGODB_URL, {});

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
});


//URL
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);

// Avvio server
const PORT = process.env.PORT || 5020;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

    

