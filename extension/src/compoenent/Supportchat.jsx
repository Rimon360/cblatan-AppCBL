import axios from "../../axiosConfig"
import { useEffect, useRef, useState } from "react"
import { BsPaperclip } from "react-icons/bs"
import { IoSend } from "react-icons/io5"
import { checkFileBeforeUploading, localTime } from "../functions.js"
import { FiExternalLink } from "react-icons/fi"
import { NavLink } from "react-router-dom"
import { IoCloseOutline } from "react-icons/io5"
import { getSocket } from "../socket.js"
import { useGlobal } from "../context/globalContext.jsx"
import toast from "react-hot-toast"
import { IoMdArrowDown } from "react-icons/io"
import { IoArrowBack } from "react-icons/io5"
import { playNotificationSound } from "../functions.js"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const Supportchat = () => {
  const token = localStorage.getItem("token")
  const [messages, setMessages] = useState([])
  const { state } = useGlobal()

  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const [chatSelectedUser, setChatSelectedUser] = useState(state._id)
  const socketRef = useRef(null)
  useEffect(() => {
    ;(async () => {
      const socket = await getSocket()
      if (!socket) return
      socketRef.current = socket
      socket.emit("joinUser", state._id)
      socket.on("receiveMessage", (data) => { 
        if (data.sender === state.email) {
          data.avatar = "ME"
          data.isCurrentUser = true
          data.sender = "You"
        } else {
          data.sender = "Customer Support"
          messageToast({ sender: data.sender, text: data.content })
        }
        setMessages((prev) => [...prev, data])
      })
      return () => {
        socket.off("receiveMessage")
        socket.off("connect", () => {
          console.log(socket.connected)
        })
      }
    })()
  }, [])
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
  useEffect(() => {
    try {
      ;(async () => {
        if (!chatSelectedUser) return
        let result = await axios.get(BACKEND_URL + "/api/users/chat/get-private-conversation/" + chatSelectedUser, { headers: { Authorization: "Bearer " + token } })
        let data = []
        for (const element of result.data) {
          if (element.sender === state.email) {
            element.avatar = "ME"
            element.sender = "You"
            element.isCurrentUser = true
          } else {
            element.sender = "Customer Support"
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
        sender: state.email,
        to: chatSelectedUser,
        avatar: "YO",
        content: url,
        content_type: file.type,
        createdAt: localTime(new Date()),
        isCurrentUser: true,
      }
      socketRef.current.emit("privateMessage", newMessage)
      setInputMessage("")
      return
    }
    if (inputMessage.trim()) {
      const newMessage = {
        sender: state.email,
        to: chatSelectedUser,
        avatar: "YO",
        content: inputMessage,
        content_type: "txt",
        createdAt: localTime(new Date()),
        isCurrentUser: true,
      }
      socketRef.current.emit("privateMessage", newMessage)
      setInputMessage("")
    }
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

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 flex  items-center justify-between">
          <NavLink to={"/"} className="text-xl mt-3 hover:bg-blue-500/20 rounded-md !text-white px-5 h-8 flex gap-2 hover:ml-[-5px] transitions items-center font-bold text-blue-400 mb-3">
            <h2>
              <IoArrowBack className="text-2xl " />
            </h2>
          </NavLink>
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
