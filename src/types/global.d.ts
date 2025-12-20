export {};

declare global {
  interface Window {
    __CHAT_WS__?: WebSocket;
  }
}
