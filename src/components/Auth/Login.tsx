import { useState, useEffect, useCallback } from 'react';
import { wsService } from '../../services/websocket';
import type { LoginProps, ServerMessage } from '../../types';
import './Auth.css';

function Login({ onSwitchToRegister, onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kết nối WebSocket khi component mount
    const connectWebSocket = async () => {
      if (!wsService.isConnected()) {
        try {
          await wsService.connect();
          console.log('WebSocket kết nối thành công');
        } catch (err) {
          console.error('Kết nối WebSocket thất bại:', err);
          // Không set error ở đây, sẽ hiển thị khi user thử đăng nhập
        }
      }
    };

    connectWebSocket();
  }, []);

  useEffect(() => {
    // Lắng nghe response từ server
    const messageHandler = (message: ServerMessage) => {
      if (message.event === 'LOGIN' || message.event === 'RE_LOGIN') {
        setLoading(false);
        if (message.status === 'success') {
          console.log('Đăng nhập thành công:', message.data);
          onLoginSuccess();
        } else {
          setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
      } else if (message.event === 'ERROR' || message.status === 'error') {
        setLoading(false);
        setError(message.message || 'Đã có lỗi xảy ra');
      }
    };

    wsService.onMessage(messageHandler);

    return () => {
      wsService.removeMessageHandler(messageHandler);
    };
  }, [onLoginSuccess]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!wsService.isConnected()) {
      setError('Đang kết nối đến server...');
      try {
        await wsService.connect();
      } catch {
        setError('Không thể kết nối đến server');
        return;
      }
    }

    try {
      setLoading(true);
      wsService.login(username, password);
    } catch {
      setLoading(false);
      setError('Không thể gửi yêu cầu đăng nhập');
    }
  }, [username, password]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng Nhập</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
        <p className="auth-switch">
          Chưa có tài khoản?{' '}
          <button onClick={onSwitchToRegister} className="switch-button" disabled={loading}>
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
