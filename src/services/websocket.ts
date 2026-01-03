import type { ChatMessage, ServerMessage, MessageHandler } from '../types';
import { createUser } from './friendService';
const WS_URL = 'wss://chat.longapp.site/chat/chat';

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reLoginCode: string | null = null;
  private username: string | null = null;
  private hasConnectedBefore = false;
  private shouldReconnect = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Nếu đã có kết nối đang mở, không tạo mới
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('WebSocket already connected');
          resolve();
          return;
        }

        // Nếu đang kết nối, đợi kết nối hiện tại
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.log('WebSocket is connecting, waiting...');
          const checkInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              clearInterval(checkInterval);
              resolve();
            } else if (!this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
              clearInterval(checkInterval);
              reject(new Error('Connection failed'));
            }
          }, 100);
          return;
        }

        // Đóng kết nối cũ nếu có
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }

        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
          console.log('WebSocket connected to', WS_URL);
          this.reconnectAttempts = 0;
          this.hasConnectedBefore = true;
          this.shouldReconnect = true;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: ServerMessage = JSON.parse(event.data);
            console.log('Received message from server:', message);
            
            // Lưu RE_LOGIN_CODE khi đăng nhập/đăng ký thành công
            if ((message.event === 'LOGIN' || message.event === 'REGISTER' || message.event === 'RE_LOGIN') 
                && message.status === 'success' 
                && message.data?.RE_LOGIN_CODE) {
              this.reLoginCode = message.data.RE_LOGIN_CODE;
              if (this.reLoginCode) {
                localStorage.setItem('RE_LOGIN_CODE', this.reLoginCode);
              }
              if (this.username) {
                localStorage.setItem('username', this.username);
              }
            }
            
            // Gọi tất cả handlers
            this.messageHandlers.forEach(handler => handler(message));
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('Lỗi WebSocket:', error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected', event.code, event.reason);
          // Chỉ reconnect nếu đã từng kết nối thành công và shouldReconnect = true
          if (this.hasConnectedBefore && this.shouldReconnect) {
            this.handleReconnect();
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Đang thử kết nối lại... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().then(() => {
          console.log('Kết nối lại thành công');
          // Tự động re-login nếu có code
          const savedCode = localStorage.getItem('RE_LOGIN_CODE');
          const savedUsername = localStorage.getItem('username');
          
          if (savedCode && savedUsername) {
            this.reLogin(savedUsername, savedCode);
          }
        }).catch((err) => {
          console.error('Kết nối lại thất bại:', err);
        });
      }, this.reconnectDelay);
    } else {
      console.warn('Đã đạt đến số lần kết nối lại tối đa');
      this.shouldReconnect = false;
      // Clear saved data
      localStorage.removeItem('RE_LOGIN_CODE');
      localStorage.removeItem('username');
    }
  }

  send(message: ChatMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      console.log('Sent message:', message);
    } else {
      console.error('WebSocket không được kết nối');
      throw new Error('WebSocket không được kết nối');
    }
  }

  login(username: string, password: string) {
    this.username = username;
    const message: ChatMessage = {
      action: 'onchat',
      data: {
        event: 'LOGIN',
        data: {
          user: username,
          pass: password
        }
      }
    };
    this.send(message);
  }

  async register(username: string, password: string) {
    this.username = username;
    const message: ChatMessage = {
      action: 'onchat',
      data: {
        event: 'REGISTER',
        data: {
          user: username,
          pass: password
        }
      }
    };
    this.send(message);
     try {
      await createUser(username);
    } catch (e) {}
  }

  reLogin(username: string, code: string) {
    this.username = username;
    const message: ChatMessage = {
      action: 'onchat',
      data: {
        event: 'RE_LOGIN',
        data: {
          user: username,
          code: code
        }
      }
    };
    this.send(message);
  }

  logout() {
    const message: ChatMessage = {
      action: 'onchat',
      data: {
        event: 'LOGOUT',
        data: {}
      }
    };
    this.send(message);
    
    // Clear saved data
    localStorage.removeItem('RE_LOGIN_CODE');
    localStorage.removeItem('username');
    
    // Disconnect WebSocket
    this.shouldReconnect = false;
    this.disconnect();
  }

    getUserList() {
    const message: ChatMessage = {
      action: "onchat",
      data: {
        event: "GET_USER_LIST",
        data: {},
      },
    };
    this.send(message);
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  resetReconnectAttempts() {
    this.reconnectAttempts = 0;
    this.shouldReconnect = true;
  }
}

export const wsService = new WebSocketService();
