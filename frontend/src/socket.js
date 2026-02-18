// socket.js
import { io } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

let socket = null

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token")
    if (!token) return null

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    })
  }
  return socket
}
