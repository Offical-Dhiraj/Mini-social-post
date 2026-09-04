const mongoose = require("mongoose");
const { setServers } = require("node:dns/promises")
const connectDB = async () => {
    try {
        setServers(["1.1.1.1","8.8.8.8"])
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb connected successfully");

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }

}

module.exports = connectDB