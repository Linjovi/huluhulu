import React from "react";
import { ChevronLeft } from "./Icons";

interface NavBarProps {
  onBack?: () => void;
  title?: string;
  showBack?: boolean;
  theme?: "light" | "dark";
}

export const NavBar: React.FC<NavBarProps> = ({
  onBack,
  title = "猫猫法官",
  showBack = false,
  theme = "light",
}) => {
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  
  return (
    <div className={`fixed top-0 w-full z-50 bg-transparent ${textColor} px-4 h-12 flex items-center justify-between`}>
      <div className="w-8 flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            className={`p-1 -ml-2 rounded-full ${theme === 'dark' ? 'active:bg-white/10' : 'active:bg-gray-100'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="font-bold text-lg tracking-wide">{title}</div>
      <div className="w-8"></div> {/* Spacer for centering */}
    </div>
  );
};
