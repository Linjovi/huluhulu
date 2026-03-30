import Phaser from 'phaser';

export class TarotScene extends Phaser.Scene {
  private magicalEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super('TarotScene');
  }

  create() {
    // Generate a star/sparkle texture
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('sparkle', 8, 8);
    graphics.destroy();

    // Background ambient particles (slow moving stars)
    this.add.particles(0, 0, 'sparkle', {
      x: { min: 0, max: this.scale.width },
      y: { min: 0, max: this.scale.height },
      lifespan: { min: 3000, max: 6000 },
      speedY: { min: -10, max: -30 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.1, end: 0.3 },
      alpha: { start: 0, end: 0.8, ease: 'Sine.easeInOut', yoyo: true },
      quantity: 2,
      frequency: 200,
      blendMode: 'ADD'
    });

    // Magical emitter that follows pointer or reacts to events
    this.magicalEmitter = this.add.particles(0, 0, 'sparkle', {
      lifespan: 1000,
      speed: { min: 50, max: 150 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      emitting: false
    });

    const handleMouseMove = (e: MouseEvent) => {
      this.magicalEmitter.setPosition(e.clientX, e.clientY);
      this.magicalEmitter.explode(1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    });

    // Generate a fog texture for transitions
    const fogGraphics = this.add.graphics();
    fogGraphics.fillStyle(0x8a2be2, 0.2); // BlueViolet color for magical fog
    fogGraphics.fillCircle(32, 32, 32);
    fogGraphics.generateTexture('fog', 64, 64);
    fogGraphics.destroy();

    const fogEmitter = this.add.particles(0, 0, 'fog', {
      emitZone: {
        source: new Phaser.Geom.Rectangle(0, 0, this.scale.width, this.scale.height),
        type: 'random',
        quantity: 80
      },
      lifespan: 1500,
      speed: { min: 10, max: 80 },
      scale: { start: 4, end: 20 },
      alpha: { start: 0.8, end: 0 },
      blendMode: 'SCREEN',
      emitting: false
    });

    // Listen to custom events from React
    const handleTarotDraw = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y } = customEvent.detail;
      this.magicalEmitter.setPosition(x, y);
      this.magicalEmitter.explode(30);
    };

    const handleStageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const stage = customEvent.detail?.stage;

      // Skip fog effect when entering cutting stage (between shuffling and cutting)
      if (stage === 'cutting') {
        return;
      }

      // Update bounds in case window resized
      fogEmitter.setEmitZone({
        source: new Phaser.Geom.Rectangle(0, 0, this.scale.width, this.scale.height),
        type: 'random',
        quantity: 60
      });
      fogEmitter.explode(60);
    };

    window.addEventListener('tarot-draw', handleTarotDraw);
    window.addEventListener('tarot-stage-change', handleStageChange);

    this.events.on('destroy', () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('tarot-draw', handleTarotDraw);
      window.removeEventListener('tarot-stage-change', handleStageChange);
    });
  }
}
