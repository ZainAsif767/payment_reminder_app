import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./components/ui/signup";
import SignInSide from "./components/ui/login";

function App() {
  return (
    <div className="app">
      <main className="#">
        <div className="#">
          <Routes>
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={<SignInSide />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
