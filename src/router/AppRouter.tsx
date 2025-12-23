import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ChatPage from "../pages/ChatPage";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
      <Route path="/register" element={<Register onRegisterSuccess={() => {}} />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
