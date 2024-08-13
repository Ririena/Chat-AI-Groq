import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import CreateStash from "./pages/CreateStash";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  return (
    <>
      <div className="scroll-container scrollbar-hide">
        <Routes>
          <Route path="/">
            <Route index element={<CreateStash />} />
            <Route path="chat" element={<Home />} />
            <Route path=":stashId" element={<Chat />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register/>}/>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
