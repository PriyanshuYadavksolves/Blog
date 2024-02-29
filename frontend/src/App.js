import "./App.css";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Topbar from "./components/topbar/TopBar";
import Register from "./pages/signup/Register";
import SuperAdmin from "./pages/super/SuperAdmin";
import Home from "./pages/home/Home";
import Write from "./pages/write/Write";
import Single from "./pages/single/Single";
import SingleUser from "./pages/singleUser/SingleUser"

function App() {
  return (
    <BrowserRouter>
      <Topbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/super/:id" element={<SuperAdmin />} />
        <Route path="/super/user/" element={<SingleUser />} />

        <Route path="/home" element={<Home />} />
        <Route path="/write" element={<Write />} />
        <Route path="/post/:id" element={<Single />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
