import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" containerStyle={{ pointerEvents: "none" }} />
      <Dashboard />
    </>
  );
}

export default App;