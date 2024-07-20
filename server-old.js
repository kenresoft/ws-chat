const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",  // Update this with your client URL in production
        methods: ["GET", "POST"]
    }
});

// Middleware to handle socket authentication
const authenticateSocket = (socket, next) => {
    const authHeader = socket.handshake.headers.authorization;

    if (!authHeader) {
        return next(new Error('Authentication error: Token not provided'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new Error('Authentication error: Token not provided'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error: Invalid token'));
        }

        socket.user = decoded; // Attach user data to the socket object
        next();
    });
};
io.use(authenticateSocket);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email}`);

    socket.on('sendMessage', (message) => {
        console.log(`Message from ${socket.user.email}: ${message}`);
        io.emit('receiveMessage', `${socket.user.email}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.email}`);
    });
});

app.use(express.json());

// Endpoint for authentication
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'testing' && password === '123456') {
        const user = { email: username };
        console.log(user);
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        console.log(accessToken);
        res.json({
            tokens: {
                accessToken
            }
        });
    } else {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
