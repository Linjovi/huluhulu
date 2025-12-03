import React from "react";
import { TarotCard } from "../types";
import { CARD_BACK_URL } from "../constants";

interface CardProps {
  card: TarotCard;
  isRevealed: boolean;
  onClick?: () => void;
  className?: string;
  width?: string;
}

const Card: React.FC<CardProps> = ({
  card,
  isRevealed,
  onClick,
  className = "",
  width = "w-24 md:w-32",
}) => {
  return (
    <div
      className={`relative aspect-[2/3] ${width} cursor-pointer group perspective-1000 ${className}`}
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full duration-700 transition-all card-preserve-3d ${
          isRevealed ? "rotate-y-180" : ""
        }`}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full card-backface-hidden shadow-xl rounded-lg overflow-hidden border-2 border-indigo-900/50">
          <img
            src={CARD_BACK_URL}
            alt="Card Back"
            className="w-full h-full object-cover"
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full card-backface-hidden rotate-y-180 shadow-2xl rounded-lg overflow-hidden border-2 border-yellow-600/50 bg-black">
          <img
            src={card.imageUrl}
            alt={card.name}
            className={`w-full h-full object-cover ${
              card.isReversed ? "rotate-180" : ""
            }`}
          />
          {/* Reversal indicator overlay (subtle) */}
          {card.isReversed && (
            <div className="absolute inset-0 pointer-events-none bg-red-900/10 mix-blend-overlay" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
