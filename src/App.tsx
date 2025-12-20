import { useState } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatPage from './components/ChatPage';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    console.log('User logged in successfully');
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
    console.log('User registered successfully');
  };

  if (isAuthenticated) {
    return <ChatPage />;
  }

  return (
    <div>
      <Header username="Trí Đức" onLogout={() => console.log("Logged out")} />
      <ChatPage />
    </div>
  );
}

export default App;