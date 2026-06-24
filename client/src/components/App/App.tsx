import Intro from "../../pages/Intro/Intro";
import Register from "../../pages/Register/Register";
import Login from "../../pages/Login/Login";
import AppLayout from "../AppLayout/AppLayout";
import { Route, Routes } from "react-router-dom";
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import "./App.css"
import Chat from "../../pages/Chat/Chat";

function App() {
  return (
    <Routes>
      <Route element={<Intro />} path="/" />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route element={<AppLayout />}>
        <Route element={<KnowledgeBase />} path="/knowledge" />
        <Route element={<Chat />} path="/chat" />
      </Route>
    </Routes>
  );
}

export default App;