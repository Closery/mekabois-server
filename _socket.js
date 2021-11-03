const CONFIG = require('./config.json')
const io = require('socket.io')(CONFIG.PORTS.SOCKET, CONFIG.SOCKET_CONFIG)

//const roomNames = ['meka1', 'meka2', 'meka3']
const roomNames = CONFIG.ROOMS
//const privateRooms = ['MEKA_P1_Kmc7H9cRY8dH2r', 'MEKA_P2_GSgb3NukhLXLA4']
const privateRooms = CONFIG.PRIVATE_ROOMS
const users = {}
const rooms = {}

roomNames.forEach((roomName) => (rooms[roomName] = {}))
privateRooms.forEach((roomName) => (rooms[roomName] = {}))

function saveUser(user) {
	let userServer = { ...user }

	users[user.id] = userServer
	rooms[user.room][user.id] = userServer

	return userServer
}

function makeRoomList(rooms) {
	let roomList = []

	roomNames.forEach((roomName) => {
		roomList.push({
			name: roomName,
			users: Object.values(rooms[roomName]).length,
		})
	})

	return roomList
}

// Prop "socket" may change as "client" for better intelligibility.
io.on('connection', (socket) => {
	socket.on('new-user', ({ room, user }) => {
		//console.log('new-user', user);
		let roomName = Object.keys(rooms).find((roomName) => roomName === room) || roomNames[0]
		let userData = { ...user, id: socket.id, room: roomName }
		let isUserReconnect = false

		if (user.id) {
			let roomUsers = Object.values(rooms[roomName])
			let userInSameRoom = roomUsers.find((roomUser) => roomUser.id === user.id)

			if (userInSameRoom)
				io.sockets.sockets.forEach((socket) => {
					if (socket.id === userInSameRoom.id) {
						isUserReconnect = true
						users[userInSameRoom.id].kicked = true
						socket.disconnect(true)
					}
				})
		}

		socket.join(roomName)
		saveUser(userData)

		if (isUserReconnect) socket.broadcast.to(roomName).emit('user-reconnected', user)
		else socket.broadcast.to(roomName).emit('user-connected', user)

		socket.emit('room-list-update', makeRoomList(rooms))
		socket.broadcast.emit('room-list-update', makeRoomList(rooms))

		socket.emit('user-list-update', Object.values(rooms[roomName]))
		socket.broadcast.to(roomName).emit('user-list-update', Object.values(rooms[roomName]))
	})

	socket.on('user-update', (user) => {
		let roomName = users[socket.id] ? users[socket.id].room : ''
		let updatedUser = {
			...users[socket.id],
			...user,
			room: roomName,
		}

		let oldUser = { ...users[socket.id] }
		delete oldUser.id
		let newUser = { ...user }
		delete newUser.id
		socket.broadcast.to(roomName).emit('user-updated', { new: newUser, old: oldUser })

		users[socket.id] = updatedUser
		rooms[roomName][socket.id] = updatedUser

		socket.broadcast.to(roomName).emit('user-list-update', Object.values(rooms[roomName]))
	})

	socket.on('send-chat-message', (message) => {
		if (message.charAt(0) === '/') {
			const system = { name: 'Sistem', color: '#fff' }
			const styles = { bold: true }

			if (message === '/yardım') {
				socket.emit('chat-message', { user: system, message: 'Sohbet komutları gelecekte aktif olacaktır.', styles: styles })
			} else socket.emit('chat-message', { user: system, message: 'Yanlış komut girdiniz. Komutlar için: /yardım', styles: styles })
		} else socket.broadcast.to(users[socket.id].room).emit('chat-message', { user: users[socket.id], message: message, styles: {} })
	})

	socket.on('disconnect', () => {
		//console.log('user-disconnect', users[socket.id]);
		let roomName = users[socket.id] ? users[socket.id].room : ''
		if (roomName) {
			if (!users[socket.id].kicked) socket.broadcast.to(roomName).emit('user-disconnected', users[socket.id])

			delete users[socket.id]
			delete rooms[roomName][socket.id]

			socket.broadcast.emit('room-list-update', makeRoomList(rooms))
			socket.broadcast.to(roomName).emit('user-list-update', Object.values(rooms[roomName]))
		}
	})
})

console.log(`Socket is ready on port ${CONFIG.PORTS.SOCKET}!`)
