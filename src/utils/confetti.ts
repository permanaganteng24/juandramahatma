import confetti from 'canvas-confetti';

/**
 * Celebratory Canvas-based Confetti for Opening Aqiqah Invitation
 */
export function triggerOpenEnvelopeConfetti() {
  const festiveColors = ['#0284c7', '#38bdf8', '#7dd3fc', '#f59e0b', '#fbbf24', '#ffffff', '#10b981'];

  // 1. Center Initial Festive Burst
  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.6 },
    colors: festiveColors,
    zIndex: 99999,
  });

  // 2. Star & Sparkle burst
  setTimeout(() => {
    confetti({
      particleCount: 45,
      spread: 80,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.55 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff', '#38bdf8'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
      zIndex: 99999,
    });
  }, 180);

  // 3. Dual Left and Right Cannons
  setTimeout(() => {
    // Left Cannon
    confetti({
      particleCount: 65,
      angle: 60,
      spread: 60,
      startVelocity: 55,
      origin: { x: 0.05, y: 0.75 },
      colors: festiveColors,
      zIndex: 99999,
    });

    // Right Cannon
    confetti({
      particleCount: 65,
      angle: 120,
      spread: 60,
      startVelocity: 55,
      origin: { x: 0.95, y: 0.75 },
      colors: festiveColors,
      zIndex: 99999,
    });
  }, 350);

  // 4. Continuous gentle rain / celebratory shower for 2.2 seconds
  const duration = 2200;
  const animationEnd = Date.now() + duration;

  const frameInterval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(frameInterval);
      return;
    }

    const particleCount = 20 * (timeLeft / duration);

    // Launch from both sides towards center top
    confetti({
      particleCount: Math.floor(particleCount * 0.5),
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random() * 0.6 + 0.2, // between 0.2 and 0.8
        y: Math.random() * 0.3 + 0.1, // upper viewport
      },
      colors: festiveColors,
      shapes: ['circle', 'square'],
      zIndex: 99999,
      scalar: 0.9,
    });
  }, 220);
}
