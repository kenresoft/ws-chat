const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;

const connectDB = async () => {
    if (!db) {
        await client.connect();
        db = client.db(process.env.DB_NAME);
    }
    return db;
};

module.exports = connectDB;
