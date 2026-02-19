import axios from "../../axiosConfig"
import axios2 from "axios"
import React, { useEffect, useRef, useState } from "react"
import { BsThreeDotsVertical, BsSearch, BsPaperclip, BsEmojiSmile } from "react-icons/bs"
import { IoSend } from "react-icons/io5"
import { FaUserCircle } from "react-icons/fa"
import { checkFileBeforeUploading, generateRandomKey, isOnline, localTime, playNotificationSound } from "../functions"
import { FiExternalLink } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"
import { IoCloseOutline } from "react-icons/io5"
import { getSocket } from "../socket"
import { useGlobal } from "../context/GlobalStete"
import toast from "react-hot-toast"
import { IoMdArrowDown } from "react-icons/io"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const Supportchat = () => {
  const token = localStorage.getItem("token")
  const [messages, setMessages] = useState([])
  const { current_user } = useGlobal()
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [inputMessage, setInputMessage] = useState("")
  const [isReloadUserList, setIsReloadUserList] = useState("")
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  const messageToast = ({ sender, text }) => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? "animate-enter" : "animate-leave"} !bg-gray-900/80  max-w-[400px] max-h-[350px] overflow-auto shadow-lg rounded-lg px-4 py-3 flex gap-3`}>
          <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">{sender?.slice(0, 2).toUpperCase()}</div>

          <div className="flex-1">
            <p className="font-semibold !text-blue-300 text-sm">{sender}</p>
            <p className="text-sm !text-white ">{text?.slice(0, 200)}...</p>
          </div>

          <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      ),
      {
        duration: 4000,
        position: "top-right",
      },
    )
    playNotificationSound()
  }
  const [chatUsers, setChatUsers] = useState([])
  const [chatSelectedUser, setChatSelectedUser] = useState(null)
  const socketRef = useRef(null)
  const selectedUserIdRef = useRef(null)
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    socketRef.current = socket
    socket.on("receiveMessage", (data) => {
      if (data.sender === current_user.email) {
        data.avatar = "ME"
        data.sender = "You"
        data.isCurrentUser = true
      }
      let chatSelectedUser = selectedUserIdRef.current
      if (chatSelectedUser && data.to !== chatSelectedUser) {
        messageToast({ sender: data.sender, text: data.content })
        return
      }
      setMessages((prev) => [...prev, data])
    })
    return () => {
      socket.off("receiveMessage")
      socket.off("connect", () => {
        console.log(socket.connected)
      })
    }
  }, [])
  const trackUserJoinRef = useRef([])
  useEffect(() => {
    const getIdFromHash = () => {
      const hash = window.location.hash
      const id = hash.split("chatid=")[1]
      if (!id) return
      setChatSelectedUser(id)
      selectedUserIdRef.current = id
      if (!trackUserJoinRef.current.includes(id)) {
        socketRef.current.emit("joinUser", id)
        trackUserJoinRef.current.push(id)
      }
    }
    getIdFromHash()
  }, [])

  useEffect(() => {
    try {
      ;(async () => {
        let result = await axios2.get(BACKEND_URL + "/api/users/chat/get-users", { headers: { Authorization: "Bearer " + token } })
        let data = []
        for (const element of result.data) {
          element.avatar = element.username?.slice(0, 2).toUpperCase() || element.email?.slice(0, 2).toUpperCase()
          if (element._id && socketRef.current && element.support_status == "pending" && !trackUserJoinRef.current.includes(element._id)) {
            trackUserJoinRef.current.push(element._id)
            socketRef.current.emit("joinUser", element._id)
          }
          data.push(element)
        }
        setChatUsers(result.data)
      })()
    } catch (error) {}
  }, [isReloadUserList])

  useEffect(() => {
    setInterval(() => {
      setIsReloadUserList(generateRandomKey())
      console.log("dd")
    }, 10 * 1e3)
  }, [])

  useEffect(() => {
    try {
      ;(async () => {
        if (!chatSelectedUser) return
        let result = await axios.get(BACKEND_URL + "/api/users/chat/get-private-conversation/" + chatSelectedUser, { headers: { Authorization: "Bearer " + token } })
        let data = []
        for (const element of result.data) {
          if (element.sender === current_user.email) {
            element.avatar = "ME"
            element.sender = "You"
            element.isCurrentUser = true
          }
          data.push(element)
        }
        setMessages(result.data)
      })()
    } catch (error) {}
  }, [chatSelectedUser])
  const fileRef = useRef("")
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!chatSelectedUser) {
      alert("Please select a user first")
      return
    }

    if (file) {
      let url = await handleFileUploading()
      const newMessage = {
        sender: current_user.email,
        to: chatSelectedUser,
        avatar: "YO",
        content: url,
        content_type: file.type,
        createdAt: new Date(),
        isCurrentUser: true,
      }
      socketRef.current.emit("privateMessage", newMessage)
      setInputMessage("")
      return
    }
    if (inputMessage.trim()) {
      const newMessage = {
        sender: current_user.email,
        to: chatSelectedUser,
        avatar: "YO",
        content: inputMessage,
        content_type: "txt",
        createdAt: new Date(),
        isCurrentUser: true,
      }
      socketRef.current.emit("privateMessage", newMessage)
      setInputMessage("")
    }
  }

  const handleChatUserChange = (id) => {
    if (!id) return
    if (chatSelectedUser !== id) {
      setMessages([])
    }
    if (!trackUserJoinRef.current.includes(id)) {
      socketRef.current.emit("joinUser", id)
      trackUserJoinRef.current.push(id)
    }
    setChatSelectedUser(id)
    selectedUserIdRef.current = id
    window.location.hash = `chatid=${id}`
  }

  const handleFileSelection = async (e) => {
    let file = e.target.files[0]
    let { status, msg } = checkFileBeforeUploading(file.size)
    if (!status) {
      return toast.error(msg)
    }
    setFile(file)
  }
  const handleFileUploading = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)

    try {
      let result = await axios.post(BACKEND_URL + "/api/users/chat/upload-in-private", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + token },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total)
          setProgress(percent)
        },
      })
      fileRef.current.value = ""
      setFile(null)
      setProgress(0)
      return result.data
    } catch (err) {
      setProgress(0)
      toast.error("Upload failed")
    }
  }
  const handleFileRemove = () => {
    setFile(null)
    setProgress(0)
    fileRef.current.value = ""
  }
  const renderMedia = (url, type) => {
    if (type.startsWith("video/")) {
      return <video className="max-h-90" src={url} controls crossOrigin="anonymous" />
    }

    // if (type.startsWith("audio/")) {
    //   return <audio src={url} controls crossOrigin="anonymous" />
    // }

    if (type.startsWith("image/")) {
      return (
        <a target="_blank" href={url}>
          <img className="max-h-90 rounded-xl" crossOrigin="anonymous" src={url} alt="" />
        </a>
      )
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <p className="p-2 bg-gray-400/15 flex items-end  flex-col px-4 py-2 rounded-xl hover:bg-gray-200/30">
          <FiExternalLink />
          Ver archivo adjunto
          <br />
          {type}
        </p>
      </a>
    )
  }

  const handleStatusChange = async (support_status) => {
    if (!chatSelectedUser) return
    if (confirm("Are you sure?")) {
      try {
        let result = await axios.post(BACKEND_URL + "/api/users/chat/change-user-supportstatus-private", { _id: chatSelectedUser, support_status }, { headers: { Authorization: "Bearer " + token } })
        if (result.data > 0) {
          toast.success(`Status changed to ${support_status}`)
          setIsReloadUserList(+new Date())
          return
        }
        toast.warn(`No Modification made`)
      } catch (error) {
        toast.error(`Update failed`)
      }
    }
  }
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar - SupportUsers List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-blue-400 mb-3">Support Team</h2>
          {/* <div className="relative">
            <BsSearch className="absolute right-3 top-4 text-gray-400" />
            <input
              onInput={handleSearchUser}
              type="text"
              placeholder="Search"
              className="w-full bg-gray-700 text-gray-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(
            chatUsers.reduce((acc, user) => {
              ;(acc[user.support_status] ??= []).push(user)
              return acc
            }, {}),
          ).map(([status, users]) => (
            <div key={status}>
              {/* status label */}
              <div className={`px-4 py-2 text-xs font-semibold uppercase ${status == "pending" ? "text-yellow-400" : status == "solved" ? "text-green-400" : "text-red-400"} bg-gray-800`}>
                {status}
              </div>

              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleChatUserChange(user._id)}
                  className={`p-4 hover:bg-gray-700 ${user._id === chatSelectedUser ? "!bg-gray-700" : ""} cursor-pointer border-b border-gray-700/50`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-semibold text-white">{user.avatar}</div>
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-800 ${isOnline(user.last_ping_timestamp) === "online" ? "bg-green-500" : "bg-yellow-500"}`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold text-gray-100">{user.username || user.email}</div>
                      <div className="text-xs text-gray-400">{user.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-semibold">ST</div>
            <div>
              <h3 className="font-bold text-lg text-gray-100">Support Team Chat</h3>
              <p className="text-sm text-gray-400">{chatUsers.length} members </p>
            </div>
          </div>
          <div className="flex gap-1 flex-col justify-center ">
            <p>Mark as</p>
            <div className="flex gap-2">
              <button onClick={(fa) => handleStatusChange("pending")} className="bg-yellow-500/50 hover:bg-yellow-500 rounded-md  px-1">
                Pending
              </button>
              <button onClick={(fa) => handleStatusChange("solved")} className="bg-green-500/50 hover:bg-green-500 rounded-md  px-1">
                Solved
              </button>
              <button onClick={(fa) => handleStatusChange("rejected")} className="bg-red-500/50 hover:bg-red-500 rounded-md  px-1">
                Rejected
              </button>
            </div>
          </div>
          <button onClick={scrollToBottom} title="Bottom" className="p-2 hover:bg-blue-500 bg-gray-500/20 rounded-lg">
            <IoMdArrowDown />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900">
          {chatSelectedUser ? (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex space-x-3 max-w-2xl ${msg.isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-semibold flex-shrink-0">{msg.avatar}</div>
                  <div className={`flex flex-col ${msg.isCurrentUser ? "items-end" : "items-start"}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-sm font-semibold ${msg.isCurrentUser ? "text-blue-400" : "text-gray-300"}`}>{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.role}</span>
                    </div>
                    {msg.content_type !== "txt" ? (
                      <div className="bg-gray-700/50 text-white rounded-tr-sm px-4 py-2 rounded-2xl max-h-100 overflow-hidden relative ">
                        {renderMedia(BACKEND_URL + `/uploads/${msg.content}`, msg.content_type)}
                      </div>
                    ) : (
                      <div className={`px-4 py-2 rounded-2xl ${msg.isCurrentUser ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-800 text-gray-100 rounded-tl-sm"}`}>
                        <p>{msg.content}</p>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 mt-1">{localTime(msg.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xl text-center text-gray-600 pb-5 border-dashed border-b-1">Select an user</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          {file ? (
            <div className="flex justify-center mb-3">
              <div className="flex  justify-between items-center pl-2 bg-gray-700 rounded-xl w-fit">
                <p>{progress > 0 ? progress + "%" : file.name} </p>
                <button onClick={handleFileRemove} className="text-2xl p-2 ml-5 cursor-pointer rounded-xl hover:text-red-500 hover:bg-red-500/20">
                  <IoCloseOutline />
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button disabled={!chatSelectedUser} type="button">
              <label disabled={!chatSelectedUser} htmlFor="file" className="cursor-pointer p-2   block hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-blue-400">
                <input disabled={!chatSelectedUser} type="file" ref={fileRef} id="file" onInput={handleFileSelection} className="hidden" />
                <BsPaperclip className="text-xl" />
              </label>
            </button>
            {/* <button disabled={!chatSelectedUser} type="button" className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-blue-400">
              <BsEmojiSmile className="text-xl" />
            </button> */}
            <input
              disabled={!chatSelectedUser || !file == true ? false : true}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button disabled={!chatSelectedUser} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-semibold">
              <IoSend className="text-xl" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Supportchat

// when to user is not active or connected then the message is not showing on chat window
