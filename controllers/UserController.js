const { logger } = require('../functions');

function add(usersOnline, user, socketId) {
  return new Promise((resolve, reject) => {
    if(usersOnline.has(user.id)) {
      const oldUser = usersOnline.get(user.id)
      oldUser.sockets.add(socketId)
      resolve(usersOnline)
      return
    } 

    const sockets = new Set()
    sockets.add(socketId)
    usersOnline.set(user.id,  {
      sockets,
      user
    });
    logger('new user', {
      userId: user.id,
      name: user.name,
      last_name: user.last_name
    })
    resolve(usersOnline)
  })
}

function update(usersOnline, newUser) {
  return new Promise((resolve, reject) => {
    if(!usersOnline.has(newUser.id)) {
      reject('El usuario no existe')
      return
    }

    const user = usersOnline.get(newUser.id)
    user.user = newUser
    usersOnline.set(newUser.id, user)
    resolve(usersOnline)
  })
}

function remove(usersOnline, userId, socketId) {
  return new Promise((resolve, reject) => {
    if(usersOnline.has(userId)) {
      const user = usersOnline.get(userId)
      const { name, last_name } = user.user
      user.sockets.delete(socketId)
      logger('socket removida', {
        socketId,
        userId,
        name,
        last_name
      })
      if(user.sockets.size === 0) {
        usersOnline.delete(userId)
        logger('usuario desconectado', {
          userId,
          name,
          last_name,
        })
      }
      resolve(usersOnline)
    } else {
      reject('El usuario no existe')
    }
  })
}

module.exports = {
  add,
  update,
  remove
}