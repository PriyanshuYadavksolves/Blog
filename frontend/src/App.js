import "./App.css";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Topbar from "./components/topbar/TopBar";
import Register from "./pages/signup/Register";
import SuperAdmin from "./pages/super/SuperAdmin";
function App() {
  return (
    <BrowserRouter>
      <Topbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/super/:id" element={<SuperAdmin />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
