import { useState } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatPage from './components/ChatPage';
import { wsService } from './services/websocket';
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

  const handleLogout = () => {
    wsService.logout();
    setIsAuthenticated(false);
    setShowLogin(true);
    console.log('User logged out');
  };

  if (isAuthenticated) {
    return <ChatPage onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      {showLogin ? (
        <Login 
          onSwitchToRegister={() => setShowLogin(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Register 
          onSwitchToLogin={() => setShowLogin(true)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}

export default App;
