const express = require('express');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const setupSocket = require('./socket/socketHandler');

// Initialize socket
setupSocket(server);

// Middleware
app.use(express.json());

// Routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
