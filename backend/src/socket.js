const jwt = require("jsonwebtoken")
const { generateRandomKey } = require("./functions")
const { insertGroupConversation, insertPrivateConversation } = require("./controllers/socketController")

// ====== STATE ======
const onlineUsers = new Map() // userId -> Set(socketId)
const roomUsers = new Map() // roomId -> Set(userId)

module.exports = (io) => {
  // ====== AUTH ======
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const user = await jwt.verify(token, process.env.JWT_SECRET)

      socket.user = { id: user._id, email: user.email, role: user.role }
      next()
    } catch {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket) => {
    const { id, email } = socket.user

    // ====== PRIVATE (UNIQUE USERS) ======
    if (!onlineUsers.has(id)) onlineUsers.set(id, new Set())
    onlineUsers.get(id).add(socket.id)

    // send private state to all
    io.on("getPrivateState", (socket) => {
      io.emit("privateState", {
        onlineUsers: [...onlineUsers.keys()],
      })
    })

    // ====== ROOM JOIN ======
    socket.on("joinRoom", (roomId) => {
      if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set())
      roomUsers.get(roomId).add(socket.user.id)

      if (!["admin", "manager"].includes(socket.user.role)) {
        socket.emit("joinDenied", { reason: "Permission denied" })
        return
      }

      // join the room with this socket
      socket.join(roomId)

      // send room state to all sockets of all users in this room
      const socketsInRoom = [...roomUsers.get(roomId)].flatMap((userId) => [...(onlineUsers.get(userId) || [])])
      socketsInRoom.forEach((sid) => {
        io.to(sid).emit("roomState", {
          roomId,
          users: [...roomUsers.get(roomId)].length,
        })
      })
    })

    // ====== ROOM LEAVE ======
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId)
      roomUsers.get(roomId)?.delete(id)
      io.to(roomId).emit("roomState", {
        roomId,
        users: [...(roomUsers.get(roomId) || [])].length,
      })
    })

    // ====== ROOM MESSAGE ======

    socket.on("roomMessage", async (data) => {
      data.avatar = socket.user.email.slice(0, 2).toUpperCase()
      data.sender = socket.user.email
      data.id = generateRandomKey()
      data.isCurrentUser = false
      data.status = "delivered"
      io.to(data.roomId).emit("receiveMessage", data)
      await insertGroupConversation(data)
    })

    // ====== PRIVATE MESSAGE ======
    socket.on("joinUser", (userId) => {
      socket.join(userId)
    })
    socket.on("removeUser", (userId) => {
      socket.leave(userId)
    })
    socket.on("privateMessage", async (data) => {
      // const sockets = onlineUsers.get(data?.to)
      // if (!sockets) return
      data.avatar = socket.user.email.slice(0, 2).toUpperCase()
      data.id = generateRandomKey()
      data.isCurrentUser = false
      data.status = "delivered"
      io.to(data.to).emit("receiveMessage", data)
      await insertPrivateConversation(data, socket.user)
    })

    socket.on("broadcast", async (data) => {
      socket.broadcast.emit("receiveMessage", data) 
      await insertPrivateConversation(data, socket.user)
    })

    // ====== DISCONNECT ======
    socket.on("disconnect", () => {
      onlineUsers.get(id)?.delete(socket.id)
      if (onlineUsers.get(id)?.size === 0) onlineUsers.delete(id)

      roomUsers.forEach((users, roomId) => {
        if (users.delete(id)) {
          io.to(roomId).emit("roomState", {
            roomId,
            users: [...users].length,
          })
        }
      })
    })
  })
}
