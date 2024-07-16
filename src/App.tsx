import { Navigate, Route, Routes } from "react-router-dom";
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
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/signin" element={<SignInSide />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
