const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const DB_NAME = 'myChatDB';
// Use template literal syntax for string interpolation
const DB_URL = `mongodb://localhost/${DB_NAME}`;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true // Fixed: Typo in the option name
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("Connected to MongoDB database!");
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const uploadRoutes = require('./routes/upload');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

io.on('connection', (socket) => {
    console.log('User connected');
    
    socket.on('joinChannel', (channelId) => {
        socket.join(channelId);
        console.log(`User joined channel: ${channelId}`);
    });
    
    socket.on('leaveChannel', (channelId) => {
        socket.leave(channelId);
        console.log(`User left channel: ${channelId}`);
    });

    socket.on('sendMessage', (msg) => {
        io.to(msg.channelId).emit('newMessage', msg);
    });
    
    // Handle client disconnecting
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Port should be taken from process.env.PORT first for production use
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
