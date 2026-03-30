import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface PhaserGameProps {
  config: Phaser.Types.Core.GameConfig;
  className?: string;
  style?: React.CSSProperties;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ config, className, style }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameRef.current) {
      // Initialize the Phaser game
      const gameConfig: Phaser.Types.Core.GameConfig = {
        ...config,
        parent: gameContainerRef.current,
      };
      
      gameRef.current = new Phaser.Game(gameConfig);
    }

    return () => {
      // Cleanup when component unmounts
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [config]);

  return <div ref={gameContainerRef} className={className} style={style} />;
};

export default PhaserGame;
