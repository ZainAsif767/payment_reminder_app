import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./components/ui/signup";
import SignInSide from "./components/ui/signin";
import Dashboard from "./components/ui/Dashboard";
import ForgotPassword from "./components/ui/ForgotPassword";

function App() {
  return (
    <div className="app">
      <main className="#">
        <div className="#">
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/signin" element={<SignInSide />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/resetpassword" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
