// socket.js
import { io } from "socket.io-client"
import { getToken } from "./funcitons"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

let socket = null

export const getSocket = async () => {
  if (!socket) {
    const token = await getToken() 
    if (!token) return null 
    socket = io(SOCKET_URL, {
      path:"/s/socket.io",
      transports: ["websocket"],
      auth: { token },
    })
  }
  return socket
}
