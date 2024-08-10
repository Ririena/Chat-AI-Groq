import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import CreateStash from "./pages/CreateStash";
import Chat from "./pages/Chat";
function App() {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<CreateStash />} />
          <Route path="chat" element={<Home />} />
          <Route path=":stashId" element={<Chat />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
