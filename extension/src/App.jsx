import { useState } from "react" 
import AppRoutes from "./routes/AppRoutes"
import { Toaster } from "react-hot-toast"
import { GlobalProvider } from "./context/globalContext"
import { disableInspect } from "./funcitons"
function App() {
  return (
    <div className="App min-w-[320px] min-h-[400px] ">
      <GlobalProvider>
        <AppRoutes />
        <Toaster position="bottom-right" reverseOrder={false} />
      </GlobalProvider>
      {disableInspect()}
    </div>
  )
}

export default App
