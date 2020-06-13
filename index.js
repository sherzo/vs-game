const https = require('https'),
  fs = require('fs');

const app = require('express')();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/archive/leameen.com/privkey2.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/archive/leameen.com/cert2.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/archive/leameen.com/chain2.pem')
};

const server = https.createServer(options, app);
io = require('socket.io')(server);

const UserController = require('./controllers/UserController');
const { handlerError, getUsers, depureUsers, logger } = require('./functions');
let usersOnline = new Map();

setInterval(() => depureUsers(usersOnline), 10000);

io.on('connection', function(socket) {
  socket.on('USER/connected', user => {
    UserController.add(usersOnline, user, socket.id)
      .then(newUsersOnline => {
        usersOnline = newUsersOnline;
        io.emit('USER/online', getUsers(usersOnline));
      })
      .catch(handlerError);
  });

  socket.on('USER/disconnected', userId => {
    UserController.remove(usersOnline, userId, socket.id)
      .then(newUsersOnline => {
        usersOnline = newUsersOnline;
        io.emit('USER/online', getUsers(usersOnline));
      })
      .catch(handlerError);
  });

  socket.on('USER/updated', user => {
    logger('user', user);
    UserController.update(usersOnline, user)
      .then(newUsersOnline => {
        usersOnline = newUsersOnline;
        io.emit('USER/online', getUsers(usersOnline));
      })
      .catch(handlerError);
  });

  socket.on('GAME/request', ({ opponentId, user, game }) => {
    logger('request', { opponentId, game });
    const sockets = usersOnline.get(opponentId).sockets;
    sockets.forEach(socketUser => {
      socket.to(socketUser).emit('GAME/receive', {
        opponent: user,
        game
      });
    });
  });

  socket.on('GAME/refuse', ({ user, opponentId }) => {
    const sockets = usersOnline.get(opponentId).sockets;
    sockets.forEach(socketUser => {
      socket.to(socketUser).emit('GAME/refuse-request', user);
    });
  });

  socket.on('GAME/accept', ({ user, opponentId }) => {
    const sockets = usersOnline.get(opponentId).sockets;
    sockets.forEach(socketUser => {
      socket.to(socketUser).emit('GAME/accept-request', user);
    });
  });

  socket.on('GAME/cancel', opponentId => {
    const sockets = usersOnline.get(opponentId).sockets;
    sockets.forEach(socketUser => {
      socket.to(socketUser).emit('GAME/cancel-request');
    });
  });

  socket.on('GAME/player-step', ({ step, opponentId }) => {
    const sockets = usersOnline.get(opponentId).sockets;
    sockets.forEach(socketUser => {
      socket.to(socketUser).emit('GAME/opponent-step', step);
    });
  });

  socket.on('GAME/win', opponentId => {
    const sockets = usersOnline.get(opponentId).sockets;
    sockets.forEach(socketUser => {
      socket.to(socketUser).emit('GAME/lost');
    });
  });

  socket.on('GAME/player-render', opponentId => {
    const sockets = usersOnline.get(opponentId).sockets;
    sockets.forEach(socketUser => {
      socket.to(socketUser).emit('GAME/opponent-render');
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log('Service is running in ' + process.env.PORT);
});
