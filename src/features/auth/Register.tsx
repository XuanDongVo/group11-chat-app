import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { wsService } from '../../services/websocket';
import type { RegisterProps, ServerMessage } from '../../types';
import '../../styles/Auth.css';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import type { AppDispatch } from '../../app/store';

function Register({ onRegisterSuccess }: Omit<RegisterProps, 'onSwitchToLogin'>) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
          
          // Nếu có RE_LOGIN_CODE, lưu vào Redux (trường hợp tự động đăng nhập sau khi đăng ký)
          if (message.data?.RE_LOGIN_CODE) {
            dispatch(loginSuccess({
              username: formData.username || (typeof message.data.user === 'string' ? message.data.user : ''),
              reLoginCode: message.data.RE_LOGIN_CODE
            }));
          }
          
          onRegisterSuccess();
          navigate('/login');
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
  }, [onRegisterSuccess, navigate, dispatch, formData.username]);

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

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 5) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
    if (strength < 30) return { strength, label: 'Yếu', color: '#ef4444' };
    if (strength < 60) return { strength, label: 'Trung bình', color: '#f59e0b' };
    if (strength < 85) return { strength, label: 'Tốt', color: '#3b82f6' };
    return { strength, label: 'Rất tốt', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength();

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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h2 className="auth-title">Tạo tài khoản mới</h2>
          <p className="auth-subtitle">Tham gia cộng đồng của chúng tôi ngay hôm nay</p>
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
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Chọn tên đăng nhập"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tạo mật khẩu mạnh"
                required
                disabled={loading}
              />
            </div>
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${passwordStrength.strength}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
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
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang tạo tài khoản...
              </>
            ) : (
              <>
                Đăng Ký
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
          Đã có tài khoản?{' '}
          <button
            onClick={() => navigate('/login')}
            className="switch-button"
            disabled={loading}
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
