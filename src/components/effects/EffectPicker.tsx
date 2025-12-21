import {
  Snowflake,
  Sparkles,
  Star,
  Heart,
  CloudRain,
  X,
} from "lucide-react";
import type { EffectPickerProps } from "../../types";
import '../../styles/EffectPicker.css';

export default function EffectPicker({
  onSelect,
  activeEffect,
}: EffectPickerProps) {
  return (
    <div className="effect-picker">
      <button
        className={activeEffect === "snow" ? "active" : ""}
        onClick={() => onSelect("snow")}
        title="Snow"
      >
        <Snowflake size={18} />
      </button>

      <button
        className={activeEffect === "confetti" ? "active" : ""}
        onClick={() => onSelect("confetti")}
        title="Confetti"
      >
        <Sparkles size={18} />
      </button>

      <button
        className={activeEffect === "stars" ? "active" : ""}
        onClick={() => onSelect("stars")}
        title="Stars"
      >
        <Star size={18} />
      </button>

      <button
        className={activeEffect === "hearts" ? "active" : ""}
        onClick={() => onSelect("hearts")}
        title="Hearts"
      >
        <Heart size={18} />
      </button>

      <button
        className={activeEffect === "rain" ? "active" : ""}
        onClick={() => onSelect("rain")}
        title="Rain"
      >
        <CloudRain size={18} />
      </button>

      <button
        className={activeEffect === null ? "active" : ""}
        onClick={() => onSelect(null)}
        title="Tắt hiệu ứng"
      >
        <X size={18} />
      </button>
    </div>
  );
}
