function handlerError(err) {
  logger('error', err)
}

function getUsers(usersOnline) {
  let users = []
  usersOnline.forEach(user => {
    users.push(user.user)
  })
  return users
}

function depureUsers(usersOnline) {
  const usersToPrint = []
  usersOnline.forEach(user => {
    usersToPrint.push(user)
  })
  logger('users online', )
  console.log(usersToPrint.map(user => {
    return {
      id: user.user.id,
      user: user.user.name  + ' ' + user.user.last_name,
      email: user.user.email,
      calification: user.user.calification,
      sockets: user.sockets,
      lat: user.user.position.lat,
      lng: user.user.position.lng
    }
  }))
  console.log('\n--------------------------------------------------')
}

function logger(action, payload = '') {
  const actionSpaced = action.split('').map(letter => (letter.toUpperCase() + ' ')).join('')
  console.log('\n--------------------------------------------------')
  console.log('            ' + actionSpaced, payload)
  console.log('\n--------------------------------------------------')
}


module.exports = {
  handlerError,
  getUsers,
  depureUsers,
  logger
}