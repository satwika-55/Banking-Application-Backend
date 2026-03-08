const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect("mongodb+srv://satwika:Benstokes%4055@cluster0.9vbvg1d.mongodb.net/?appName=Cluster0")
    console.log("Connected to MongoDB");
}

module.exports = connectDB;