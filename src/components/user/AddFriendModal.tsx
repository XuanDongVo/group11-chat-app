import { useState } from "react";
import { sendFriendRequest } from "../../services/friendService";
import type { AddFriendModalProps } from "../../types/user";
import "../../styles/AddFriendModal.css";

export default function AddFriendModal({
  open,
  onClose,
  currentUser,
}: AddFriendModalProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendRequest = async () => {
    if (!username.trim()) {
      setMessage("Vui lòng nhập tên người dùng");
      return;
    }

    if (username === currentUser) {
      setMessage("Bạn không thể kết bạn với chính mình");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await sendFriendRequest(currentUser, username.trim());
      setMessage("Đã gửi lời mời kết bạn thành công!");
      setTimeout(() => {
        setUsername("");
        setMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error sending friend request:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="add-friend-modal-overlay" onClick={onClose}>
      <div
        className="add-friend-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="add-friend-modal-header">
          <h3>Thêm bạn mới</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="add-friend-modal-body">
          <label htmlFor="username-input">Tên người dùng:</label>
          <input
            id="username-input"
            type="text"
            className="username-input"
            placeholder="Nhập tên người dùng..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendRequest()}
            disabled={loading}
          />
          {message && (
            <div
              className={`message ${
                message.includes("thành công") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>
        <div className="add-friend-modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button
            className="send-btn"
            onClick={handleSendRequest}
            disabled={loading || !username.trim()}
          >
            {loading ? "Đang gửi..." : "Gửi lời mời"}
          </button>
        </div>
      </div>
    </div>
  );
}
