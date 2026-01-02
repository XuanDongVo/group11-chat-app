import { createContext } from "react";
import type { ThemeContextType } from "../types/dark";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
