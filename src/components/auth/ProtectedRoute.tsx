import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, loginSuccess } from '../../features/auth/authSlice';
import { wsService } from '../../services/websocket';
import type { ServerMessage } from '../../types';
import type { AppDispatch } from '../../app/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Chỉ chạy một lần khi component mount
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = async () => {
      // Kiểm tra xem có RE_LOGIN_CODE trong localStorage không
      const savedCode = localStorage.getItem('RE_LOGIN_CODE');
      const savedUsername = localStorage.getItem('username');

      // Nếu đã authenticated trong Redux, không cần re-login
      if (isAuthenticated) {
        setIsChecking(false);
        return;
      }

      // Nếu có savedCode và savedUsername, thử re-login
      if (savedCode && savedUsername) {
        try {
          // Kết nối WebSocket nếu chưa kết nối
          if (!wsService.isConnected()) {
            await wsService.connect();
          }
          
          // Đợi cho đến khi WebSocket thực sự OPEN (tối đa 3 giây)
          let retries = 0;
          while (!wsService.isConnected() && retries < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
          }
          
          if (!wsService.isConnected()) {
            throw new Error('WebSocket connection timeout');
          }

          let hasResponded = false;

          // Lắng nghe response từ RE_LOGIN
          const reLoginHandler = (message: ServerMessage) => {
            if (message.event === 'RE_LOGIN') {
              hasResponded = true;
              if (message.status === 'success' && message.data?.RE_LOGIN_CODE) {
                dispatch(loginSuccess({
                  username: savedUsername,
                  reLoginCode: message.data.RE_LOGIN_CODE
                }));
                setIsChecking(false);
                wsService.removeMessageHandler(reLoginHandler);
              } else {
                // Lưu error message để hiển thị cho user
                const errorMsg = message.mes || message.message || 'Phiên đăng nhập đã hết hạn';
                setErrorMessage(errorMsg);
                // Clear localStorage và redirect về login
                localStorage.removeItem('RE_LOGIN_CODE');
                localStorage.removeItem('username');
                localStorage.removeItem('currentRoomId');
                wsService.removeMessageHandler(reLoginHandler);
                setShouldRedirect(true);
                setIsChecking(false);
              }
            }
          };

          wsService.onMessage(reLoginHandler);

          // Gửi yêu cầu RE_LOGIN
          wsService.reLogin(savedUsername, savedCode);

          // Timeout sau 5 giây nếu không có response
          setTimeout(() => {
            if (!hasResponded) {
              localStorage.removeItem('RE_LOGIN_CODE');
              localStorage.removeItem('username');
              localStorage.removeItem('currentRoomId');
              wsService.removeMessageHandler(reLoginHandler);
              setShouldRedirect(true);
              setIsChecking(false);
            }
          }, 5000);

        } catch {
          // Lỗi khi re-login, clear data và redirect
          localStorage.removeItem('RE_LOGIN_CODE');
          localStorage.removeItem('username');
          localStorage.removeItem('currentRoomId');
          setShouldRedirect(true);
          setIsChecking(false);
        }
      } else {
        // Không có thông tin đăng nhập
        setIsChecking(false);
        setShouldRedirect(true);
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  // Đang kiểm tra authentication
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#fff',
        fontSize: '18px'
      }}>
        Đang tải...
      </div>
    );
  }

  // Nếu không authenticated, redirect về login
  if (!isAuthenticated || shouldRedirect) {
    // Lưu error message vào localStorage để Login component hiển thị
    if (errorMessage) {
      localStorage.setItem('loginError', errorMessage);
    }
    return <Navigate to="/login" replace />;
  }

  // Authenticated, hiển thị children
  return <>{children}</>;
}

export default ProtectedRoute;
