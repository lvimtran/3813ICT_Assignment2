module.exports = (io) => {
    io.on('connection', (socket) => {
      // ... [other event listeners] ...
  
      socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
      });
  
      socket.on('acceptCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
      });
    });
  };
  