import React, { useState, useRef, useEffect } from "react"
import { IoSend, IoCheckmarkDone, IoCheckmark, IoPlayForwardCircle } from "react-icons/io5"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiPaperclip } from "react-icons/fi"
import { generateRandomKey, localTime } from "../functions"
import { useGlobal } from "../context/GlobalStete" 
import axios from "../../axiosConfig"
import { getSocket } from "../socket"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const AdminGroupChat = () => {
  const [messages, setMessages] = useState([])
  const [activeMemebers, setActiveMemebers] = useState(0)
  const { current_user } = useGlobal()
  const token = localStorage.getItem("token")
  if (!token) return <>Not Authorized</>
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    try {
      ;(async () => {
        let result = await axios.get(BACKEND_URL + "/api/users/chat/get-group-conversation", { headers: { Authorization: "Bearer " + token } })
        let data = []
        for (const element of result.data) {
          if (element.sender === current_user.email) {
            element.avatar = "ME"
            element.isCurrentUser = true
          }
          data.push(element)
        }
        setMessages(result.data)
      })()
    } catch (error) {}
  }, [])
  const socketRef = useRef(null);
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    socketRef.current = socket
    socket.emit("joinRoom", "admin_group")
    socket.on("reconnect", () => {
      socket.emit("joinRoom", "admin_group")
    })

    socket.on("receiveMessage", (data) => {
      if (data.sender === current_user.email) {
        data.avatar = "ME"
        data.isCurrentUser = true
      }
      setMessages((prev) => [...prev, data])
    })
    socket.on("roomState", (data) => {
      setActiveMemebers(data.users)
    })

    return () => {
      socket.off('roomState');
      socket.off('receiveMessage');
      socket.off('reconnect');
      socket.off("connect", () => {
        console.log(socket.connected)
      })
    }
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim() === "") return

    const newMessage = {
      id: generateRandomKey(),
      sender: "You",
      avatar: "ME",
      roomId: "admin_group",
      content: inputMessage,
      createdAt: new Date().toISOString(),
      status: "sent",
    }
    socketRef.current.emit("roomMessage", newMessage)
    setInputMessage("")
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <IoCheckmark className="text-gray-400" />
      case "delivered":
        return <IoCheckmarkDone className="text-gray-400" />
      case "read":
        return <IoCheckmarkDone className="text-blue-400" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Admin Team Chat</h1>
          <p className="text-sm text-gray-400">{activeMemebers} members online</p>
        </div>
        <button disabled title="Not available yet" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <BsThreeDotsVertical className="text-gray-300 text-xl" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                message.isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              {message.avatar}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-md ${message.isCurrentUser ? "items-end" : "items-start"}`}>
              {!message.isCurrentUser && <span className="text-sm text-gray-400 mb-1 px-1">{message.sender}</span>}
              <div className={`rounded-2xl px-4 py-2 ${message.isCurrentUser ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-800 text-gray-100 rounded-tl-sm"}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 px-1 ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                <span className="text-xs text-gray-500">{localTime(message.createdAt)}</span>
                {message.isCurrentUser && <span className="flex items-center">{getStatusIcon(message.status)}</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button type="button" title="Not available yet" disabled className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <FiPaperclip className="text-gray-400 text-xl" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={inputMessage.trim() === ""}
            className={`p-3 rounded-lg transition-all ${inputMessage.trim() === "" ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            <IoSend className="text-xl" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminGroupChat
