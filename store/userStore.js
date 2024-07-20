const bcrypt = require('bcrypt');
const connectDB = require('../db');

const addUser = async (email, password) => {
    const db = await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };

    await db.collection('users').insertOne(user);
    return user;
};

const findUser = async (email) => {
    const db = await connectDB();
    return await db.collection('users').findOne({ email });
};

const validateUser = async (email, password) => {
    const user = await findUser(email);
    if (!user) {
        return false;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : false;
};

module.exports = {
    addUser,
    findUser,
    validateUser
};
