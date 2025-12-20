import { useState, useEffect, useCallback } from 'react';
import { wsService } from '../../services/websocket';
import type { RegisterProps, ServerMessage } from '../../types';
import '../../styles/Auth.css';

function Register({ onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
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
          // Không set error ở đây, sẽ hiển thị khi user thử đăng ký
        }
      }
    };

    connectWebSocket();
  }, []);

  useEffect(() => {
    // Lắng nghe response từ server
    const messageHandler = (message: ServerMessage) => {
      if (message.event === 'REGISTER' || message.event === 'RE_LOGIN') {
        setLoading(false);
        if (message.status === 'success') {
          console.log('Đăng ký thành công:', message.data);
          onRegisterSuccess();
        } else {
          setError('Đăng ký thất bại. Vui lòng thử lại.');
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
  }, [onRegisterSuccess]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (formData.password.length < 5) {
      setError('Mật khẩu phải có ít nhất 5 ký tự');
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
      wsService.register(formData.username, formData.password);
    } catch {
      setLoading(false);
      setError('Không thể gửi yêu cầu đăng ký');
    }
  }, [formData]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng Ký</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu (tối thiểu 5 ký tự)"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>
        <p className="auth-switch">
          Đã có tài khoản?{' '}
          <button onClick={onSwitchToLogin} className="switch-button" disabled={loading}>
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
