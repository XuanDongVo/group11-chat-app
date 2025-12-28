import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUsername, logout } from '../features/auth/authSlice';
import { wsService } from '../services/websocket';
import type { ServerMessage } from '../types';
import type { AppDispatch } from '../app/store';

const INACTIVITY_TIMEOUT = 15000; // 15 giây

export function useAutoReLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const username = useSelector(selectUsername);
  const timeoutRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    // Khởi tạo lastActivityRef
    lastActivityRef.current = Date.now();
    isActiveRef.current = true;
    
    // Chỉ hoạt động khi đã authenticated
    if (!isAuthenticated || !username) {
      return;
    }

    // Lắng nghe response từ server
    const reLoginResponseHandler = (message: ServerMessage) => {
      if (message.event === 'RE_LOGIN') {
        if (message.status === 'error') {
          // RE_LOGIN thất bại - code đã hết hạn
          console.warn('Auto re-login failed:', message.mes || message.message);
          
          // Dừng auto re-login
          isActiveRef.current = false;
          
          // Clear timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          
          // Clear localStorage và logout
          localStorage.removeItem('RE_LOGIN_CODE');
          localStorage.removeItem('username');
          localStorage.removeItem('currentRoomId');
          
          // Dispatch logout
          dispatch(logout());
          
          // Lưu error message để hiển thị ở login page
          localStorage.setItem('loginError', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (message.status === 'success' && message.data?.RE_LOGIN_CODE) {
          // RE_LOGIN thành công - cập nhật code mới
          localStorage.setItem('RE_LOGIN_CODE', message.data.RE_LOGIN_CODE);
        }
      }
    };

    wsService.onMessage(reLoginResponseHandler);

    const performReLogin = () => {
      if (!isActiveRef.current) return;
      
      const reLoginCode = localStorage.getItem('RE_LOGIN_CODE');
      if (reLoginCode && username) {
        wsService.reLogin(username, reLoginCode);
      }
    };

    const resetTimer = () => {
      if (!isActiveRef.current) return;
      
      // Xóa timeout cũ
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Cập nhật thời gian hoạt động cuối
      lastActivityRef.current = Date.now();

      // Tạo timeout mới
      timeoutRef.current = setTimeout(() => {
        if (!isActiveRef.current) return;
        
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        
        // Chỉ re-login nếu thực sự không có hoạt động
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
          performReLogin();
        }
      }, INACTIVITY_TIMEOUT) as unknown as number;
    };

    // Danh sách các event để theo dõi hoạt động
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle để tránh gọi quá nhiều lần
    let throttleTimeout: number | null = null;
    const throttledResetTimer = () => {
      if (!throttleTimeout) {
        resetTimer();
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
        }, 1000); // Chỉ reset timer tối đa 1 lần/giây
      }
    };

    // Thêm event listeners
    events.forEach(event => {
      document.addEventListener(event, throttledResetTimer);
    });

    // Khởi động timer lần đầu
    resetTimer();

    // Cleanup
    return () => {
      isActiveRef.current = false;
      wsService.removeMessageHandler(reLoginResponseHandler);
      events.forEach(event => {
        document.removeEventListener(event, throttledResetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [isAuthenticated, username, dispatch]);
}
