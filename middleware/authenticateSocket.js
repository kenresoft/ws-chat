const jwt = require('jsonwebtoken');

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

module.exports = authenticateSocket;
