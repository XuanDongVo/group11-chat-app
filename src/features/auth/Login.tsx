import { useState, useEffect, useCallback } from 'react';
import { wsService } from '../../services/websocket';
import type { LoginProps, ServerMessage } from '../../types';
import '../../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import type { AppDispatch } from '../../app/store';

function Login({ onLoginSuccess }: Omit<LoginProps, 'onSwitchToRegister'>) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(() => {
    // Kiểm tra error từ ProtectedRoute ngay khi khởi tạo
    const savedError = localStorage.getItem('loginError');
    if (savedError) {
      localStorage.removeItem('loginError');
      return savedError;
    }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
          
          // Lưu thông tin vào Redux store
          if (message.data?.RE_LOGIN_CODE) {
            dispatch(loginSuccess({
              username: username || (typeof message.data.user === 'string' ? message.data.user : ''),
              reLoginCode: message.data.RE_LOGIN_CODE
            }));
          }
          
          onLoginSuccess();
          navigate('/chat');
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
  }, [onLoginSuccess, navigate, dispatch, username]);

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
      <div className="auth-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="auth-title">Chào mừng trở lại!</h2>
          <p className="auth-subtitle">Đăng nhập để tiếp tục trò chuyện</p>
        </div>
        
        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
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
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              <>
                Đăng Nhập
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>hoặc</span>
        </div>
        
        <p className="auth-switch">
          Chưa có tài khoản?{' '}
          <button
            onClick={() => navigate('/register')}
            className="switch-button"
            disabled={loading}
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
