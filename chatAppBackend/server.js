const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison

const app = express();
const server = http.createServer(app);


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

app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST'],
    credentials: true 
}));

const io = socketio(server, {
    cors: {
        origin: "http://localhost:4200",  // Angular server
        methods: ["GET", "POST"]
    }
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
const groupRoutes = require('./routes/group');
const userRoutes = require('./routes/user')
const Message = require('./models/message')

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/user', userRoutes);  

let users = {}
const userCountsPerChannel = {};

const defaultAvatars = [
    'profile.jpeg', 'profile1.png', 'profile2.png', 'profile3.png', 'profile4.png', 'profile5.png', 'profile6.jpeg', 'profile7.png', 'profile8.png', 'profile9.jpeg'
]

io.on('connection', (socket) => {
    console.log('User connected');
    
    socket.on('joinChannel', ({ username, channel }) => {
      socket.join(channel);      
      io.to(channel).emit('userEvent', `${username} has joined the channel.`);
    });
    
    socket.on('sendMessage', (msg) => {
      io.to(msg.channel).emit('newMessage', { username: msg.username, text: msg.text });
    });
  
    socket.on('leaveChannel', ({ username, channel }) => {
      socket.leave(channel);
      io.to(channel).emit('userEvent', `${username} has left the channel.`);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
      let username = users[socket.id];
        socket.broadcast.emit('userLeft', `${username} has left the chat`);
        delete users[socket.id];
    });
  });

  module.exports = { app, server, io };  // named export


if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Port should be taken from process.env.PORT first for production use
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

