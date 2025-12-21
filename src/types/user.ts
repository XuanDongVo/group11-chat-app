import type { EffectType } from "./index";

export interface HeaderProps {
  username: string;
  onLogout: () => void;
  onChangeEffect: (effect: EffectType) => void;
}