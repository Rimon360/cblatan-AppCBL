import AppRoutes from "./routes/AppRoutes";
import { Toaster, toast } from "react-hot-toast";
import { GlobalProvider } from "./context/GlobalStete";
function App() {
  return (
    <>
      <GlobalProvider>
        <Toaster position="bottom-right" />
        <AppRoutes />
      </GlobalProvider>
    </>
  );
}

export default App;
