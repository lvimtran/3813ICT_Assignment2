const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const DB_NAME = 'myChatDB';
// Use template literal syntax for string interpolation
const DB_URL = `mongodb://localhost/${DB_NAME}`;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("Connected to MongoDB database!");
});

// Use cors middleware and configure it if necessary
app.use(cors({
    origin: 'http://localhost:4200', // Your frontend server
    methods: ['GET', 'POST'], // Allowed methods
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const uploadRoutes = require('./routes/upload');
const groupRoutes = require('./routes/group');
const channelRoutes = require('./routes/channel');
const userRoutes = require('./routes/user')

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/user', userRoutes);  

io.on('connection', (socket) => {
    console.log('User connected');

    io.to(channelId).emit('newMessage', {
        content: 'Hello, world!',
        channelId: 'exampleChannelId',
        userId: 'exampleUserId',
        username: 'exampleUsername',
        timestamp: new Date() // If you're using timestamps
    });

    socket.on('joinChannel', (data) => { // {username, channelId}
        socket.join(data.channelId);
        io.to(data.channelId).emit('systemMessage', `${data.username} has joined the channel`);
        console.log(`User ${data.username} joined channel: ${data.channelId}`);
    });

    socket.on('leaveChannel', (data) => { // {username, channelId}
        socket.leave(data.channelId);
        io.to(data.channelId).emit('systemMessage', `${data.username} has left the channel`);
        console.log(`User ${data.username} left channel: ${data.channelId}`);
    });

    socket.on('sendMessage', (msg) => { // {channelId, content, userId, username}
        io.to(msg.channelId).emit('newMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

});

// Port should be taken from process.env.PORT first for production use
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

