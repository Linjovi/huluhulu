import Phaser from 'phaser';

export class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
  }

  create() {
    // Generate a simple circular texture for particles
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('bubble', 16, 16);
    graphics.destroy();

    // Create floating bubbles in the background
    this.add.particles(0, 0, 'bubble', {
      x: { min: 0, max: this.scale.width },
      y: { min: this.scale.height, max: this.scale.height + 100 },
      lifespan: { min: 4000, max: 8000 },
      speedY: { min: -20, max: -60 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.1, end: 0.5 },
      alpha: { start: 0.4, end: 0 },
      quantity: 1,
      frequency: 300,
      blendMode: 'ADD'
    });

    // Interactive pointer effect
    const pointerEmitter = this.add.particles(0, 0, 'bubble', {
      lifespan: 800,
      speed: { min: 20, max: 80 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      emitting: false
    });

    // Listen to global pointer events since canvas pointer-events are none
    const handleMouseMove = (e: MouseEvent) => {
      pointerEmitter.setPosition(e.clientX, e.clientY);
      pointerEmitter.explode(2);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    this.events.on('destroy', () => {
      window.removeEventListener('mousemove', handleMouseMove);
    });

    // Handle resize
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    });
  }
}
