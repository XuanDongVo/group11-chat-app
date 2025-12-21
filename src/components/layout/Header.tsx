import { LogOut, User } from "lucide-react";
import type { HeaderProps } from "../../types/user";
import EffectPicker from "../effects/EffectPicker";
import { useState } from "react";

export default function Header({
  username,
  onLogout,
  onChangeEffect,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);

  return (
    <header className="app-header">
      <div className="app-header__left">
        <h2>Chat App</h2>
      </div>

      <div className="app-header__right">
        <div className="effect-wrapper">
          <button
            className="effect-trigger"
            onClick={() => setOpen(v => !v)}
            title="Hiệu ứng nền"
          >
            Hiệu ứng nền
          </button>

          {open && (
            <EffectPicker
              activeEffect={currentEffect}
              onSelect={(effect) => {
                setCurrentEffect(effect);
                onChangeEffect(effect);
                setOpen(false);
              }}
            />
          )}
        </div>

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
