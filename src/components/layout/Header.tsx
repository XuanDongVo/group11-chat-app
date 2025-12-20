import { LogOut, User } from "lucide-react";
import type { HeaderProps } from "../../types/user";
export default function Header({ username, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <h2>Chat App</h2>
      </div>

      <div className="app-header__right">
        <div className="app-user">
          <User size={18} />
          <span>{username}</span>
        </div>

        <button className="app-logout" onClick={onLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
