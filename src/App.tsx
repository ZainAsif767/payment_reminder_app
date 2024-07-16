import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./components/ui/signup";
import SignInSide from "./components/ui/login";
import { Dashboard } from "@mui/icons-material";

function App() {
  return (
    <div className="app">
      <main className="#">
        <div className="#">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<SignInSide />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
