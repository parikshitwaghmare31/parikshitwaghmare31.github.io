
    const canvas = document.getElementById('flowerCanvas');
    const ctx = canvas.getContext('2d');
    const ambientGlow = document.getElementById('ambient-glow');

    // Color Palettes
    const PALETTES = [
      {
        id: 'cherry',
        name: 'Cherry Blossom',
        primary: '#f43f5e',
        secondary: '#fb7185',
        center: '#fef08a',
        glow: 'rgba(244, 63, 94, 0.4)',
        bgGlow: 'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.35), transparent 70%)',
        outerGrad: ['#ffccd5', '#fb7185', '#e11d48'],
        innerGrad: ['#fff1f2', '#f43f5e', '#881337']
      },
      {
        id: 'neon',
        name: 'Neon Lotus',
        primary: '#06b6d4',
        secondary: '#a855f7',
        center: '#38bdf8',
        glow: 'rgba(6, 182, 212, 0.45)',
        bgGlow: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.35), transparent 70%)',
        outerGrad: ['#c084fc', '#06b6d4', '#4338ca'],
        innerGrad: ['#67e8f9', '#a855f7', '#1e1b4b']
      },
      {
        id: 'sunflower',
        name: 'Golden Sun',
        primary: '#f59e0b',
        secondary: '#d97706',
        center: '#78350f',
        glow: 'rgba(245, 158, 11, 0.4)',
        bgGlow: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.3), transparent 70%)',
        outerGrad: ['#fef08a', '#f59e0b', '#b45309'],
        innerGrad: ['#fef9c3', '#d97706', '#451a03']
      },
      {
        id: 'celestial',
        name: 'Celestial Nebula',
        primary: '#6366f1',
        secondary: '#ec4899',
        center: '#e0e7ff',
        glow: 'rgba(99, 102, 241, 0.45)',
        bgGlow: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.35), transparent 70%)',
        outerGrad: ['#c4b5fd', '#818cf8', '#312e81'],
        innerGrad: ['#f472b6', '#4f46e5', '#1e1b4b']
      },
      {
        id: 'cosmic',
        name: 'Cosmic Violet',
        primary: '#a855f7',
        secondary: '#ec4899',
        center: '#f43f5e',
        glow: 'rgba(168, 85, 247, 0.4)',
        bgGlow: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3), transparent 70%)',
        outerGrad: ['#e9d5ff', '#c084fc', '#6b21a8'],
        innerGrad: ['#fbcfe8', '#a855f7', '#3b0764']
      }
    ];

    const state = {
      palette: PALETTES[0],
      petalsPerLayer: 12,
      layers: 5,
      spinSpeed: 1.0,
      bloomScale: 1.0,
      targetBloomScale: 1.0,
      isPulsing: true,
      tiltEnabled: true,
      sparklesEnabled: true,
      rotationAngle: 0,
      
      // 3D tilt tracking
      tiltX: 0,
      tiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      
      // Mouse dragging state
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      
      // Superbloom pulse trigger animation
      pulseImpulse: 0
    };

    let width = 0;
    let height = 0;
    let particles = [];

    class Particle {
      constructor(x, y, color, speedScale = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 2.5 + 0.8) * speedScale;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 3 + 1;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.02; // slight upward float
        this.alpha -= this.decay;
        this.size *= 0.99;
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.shadowBlur = 10;
        c.shadowColor = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const paletteGrid = document.getElementById('paletteGrid');
    PALETTES.forEach(pal => {
      const btn = document.createElement('button');
      btn.className = `p-2 rounded-xl glass-card flex items-center gap-2 hover:bg-white/10 transition-all text-left text-xs ${pal.id === state.palette.id ? 'ring-2 ring-pink-500 bg-white/10' : ''}`;
      btn.innerHTML = `
        <span class="w-3.5 h-3.5 rounded-full shadow-sm" style="background: linear-gradient(135deg, ${pal.primary}, ${pal.secondary})"></span>
        <span class="text-slate-200 truncate">${pal.name}</span>
      `;
      btn.addEventListener('click', () => {
        state.palette = pal;
        ambientGlow.style.background = pal.bgGlow;
        document.querySelectorAll('#paletteGrid button').forEach(b => b.classList.remove('ring-2', 'ring-pink-500', 'bg-white/10'));
        btn.classList.add('ring-2', 'ring-pink-500', 'bg-white/10');
      });
      paletteGrid.appendChild(btn);
    });

    // Control Inputs bindings
    const petalsInput = document.getElementById('petalsInput');
    const petalsVal = document.getElementById('petalsVal');
    petalsInput.addEventListener('input', (e) => {
      state.petalsPerLayer = parseInt(e.target.value);
      petalsVal.innerText = state.petalsPerLayer;
    });

    const layersInput = document.getElementById('layersInput');
    const layersVal = document.getElementById('layersVal');
    layersInput.addEventListener('input', (e) => {
      state.layers = parseInt(e.target.value);
      layersVal.innerText = state.layers;
    });

    const spinInput = document.getElementById('spinInput');
    const spinVal = document.getElementById('spinVal');
    spinInput.addEventListener('input', (e) => {
      state.spinSpeed = parseFloat(e.target.value);
      spinVal.innerText = state.spinSpeed.toFixed(1) + 'x';
    });

    const bloomInput = document.getElementById('bloomInput');
    const bloomVal = document.getElementById('bloomVal');
    bloomInput.addEventListener('input', (e) => {
      state.targetBloomScale = parseInt(e.target.value) / 100;
      bloomVal.innerText = e.target.value + '%';
    });

    const pulseCheck = document.getElementById('pulseCheck');
    pulseCheck.addEventListener('change', (e) => state.isPulsing = e.target.checked);

    const tiltCheck = document.getElementById('tiltCheck');
    tiltCheck.addEventListener('change', (e) => state.tiltEnabled = e.target.checked);

    const sparklesCheck = document.getElementById('sparklesCheck');
    sparklesCheck.addEventListener('change', (e) => state.sparklesEnabled = e.target.checked);

    // Reset Defaults
    document.getElementById('resetParamsBtn').addEventListener('click', () => {
      state.petalsPerLayer = 12;
      petalsInput.value = 12;
      petalsVal.innerText = "12";

      state.layers = 5;
      layersInput.value = 5;
      layersVal.innerText = "5";

      state.spinSpeed = 1.0;
      spinInput.value = "1.0";
      spinVal.innerText = "1.0x";

      state.targetBloomScale = 1.0;
      bloomInput.value = "100";
      bloomVal.innerText = "100%";

      state.isPulsing = true;
      pulseCheck.checked = true;
      state.tiltEnabled = true;
      tiltCheck.checked = true;
      state.sparklesEnabled = true;
      sparklesCheck.checked = true;
    });

    // Superbloom pulse trigger
    document.getElementById('bloomPulseBtn').addEventListener('click', () => {
      state.pulseImpulse = 0.55;
      // Spawn burst particles
      const cx = width / 2;
      const cy = height / 2;
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(cx, cy, state.palette.primary, 2.2));
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (state.tiltEnabled && !state.isDragging) {
        const nx = (e.clientX / width - 0.5) * 2;
        const ny = (e.clientY / height - 0.5) * 2;
        state.targetTiltY = nx * 0.35;
        state.targetTiltX = -ny * 0.35;
      }
      if (state.isDragging) {
        const dx = e.clientX - state.lastMouseX;
        const dy = e.clientY - state.lastMouseY;
        state.targetTiltY += dx * 0.005;
        state.targetTiltX -= dy * 0.005;
        state.lastMouseX = e.clientX;
        state.lastMouseY = e.clientY;
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#controlsDrawer, header, #tutorialModal, footer')) return;
      state.isDragging = true;
      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;

      // Spawn pollen sparkles on click
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(e.clientX, e.clientY, state.palette.secondary, 1.2));
      }
    });

    window.addEventListener('mouseup', () => {
      state.isDragging = false;
    });

    // Touch support for mobile devices
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && !e.target.closest('#controlsDrawer, header, #tutorialModal, footer')) {
        state.isDragging = true;
        state.lastMouseX = e.touches[0].clientX;
        state.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (state.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - state.lastMouseX;
        const dy = e.touches[0].clientY - state.lastMouseY;
        state.targetTiltY += dx * 0.006;
        state.targetTiltX -= dy * 0.006;
        state.lastMouseX = e.touches[0].clientX;
        state.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      state.isDragging = false;
    });

    // Toggle Drawers & Modals
    const controlsDrawer = document.getElementById('controlsDrawer');
    const toggleControlsBtn = document.getElementById('toggleControlsBtn');
    toggleControlsBtn.addEventListener('click', () => {
      controlsDrawer.classList.toggle('translate-x-[120%]');
    });

    const tutorialModal = document.getElementById('tutorialModal');
    const toggleTutorialBtn = document.getElementById('toggleTutorialBtn');
    const closeTutorialBtn = document.getElementById('closeTutorialBtn');

    function openModal() {
      tutorialModal.classList.remove('hidden');
      setTimeout(() => tutorialModal.classList.remove('opacity-0'), 10);
    }
    function closeModal() {
      tutorialModal.classList.add('opacity-0');
      setTimeout(() => tutorialModal.classList.add('hidden'), 300);
    }

    toggleTutorialBtn.addEventListener('click', openModal);
    closeTutorialBtn.addEventListener('click', closeModal);
    tutorialModal.addEventListener('click', (e) => {
      if (e.target === tutorialModal) closeModal();
    });

    // Copy Code tutorial snippet
    const copyTutorialCodeBtn = document.getElementById('copyTutorialCodeBtn');
    const copiedToast = document.getElementById('copiedToast');
    copyTutorialCodeBtn.addEventListener('click', () => {
      const codeSnippet = `
// Core Organic Petal Mathematical Drawing
function drawPetal(ctx, length, width, colorA, colorB) {
  ctx.save();
  const grad = ctx.createLinearGradient(0, 0, 0, length);
  grad.addColorStop(0, colorA);
  grad.addColorStop(0.6, colorB);
  grad.addColorStop(1, 'rgba(255,255,255,0.8)');
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-width, length * 0.45, -width * 0.8, length * 0.85, 0, length);
  ctx.bezierCurveTo(width * 0.8, length * 0.85, width, length * 0.45, 0, 0);
  
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}`.trim();

      const textarea = document.createElement('textarea');
      textarea.value = codeSnippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      copiedToast.classList.remove('opacity-0');
      setTimeout(() => copiedToast.classList.add('opacity-0'), 2500);
    });

    function drawCurvedPetal(ctx, length, width, colorStart, colorMid, colorEnd, curlOffset = 0) {
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, 0, length);
      grad.addColorStop(0, colorStart);
      grad.addColorStop(0.65, colorMid);
      grad.addColorStop(1, colorEnd);

      ctx.fillStyle = grad;
      ctx.shadowBlur = 12;
      ctx.shadowColor = colorMid;

      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Left organic curve
      ctx.bezierCurveTo(
        -width * 1.15, length * 0.35 + curlOffset,
        -width * 0.85, length * 0.85,
        0, length
      );

      // Right organic curve back to center
      ctx.bezierCurveTo(
        width * 0.85, length * 0.85,
        width * 1.15, length * 0.35 + curlOffset,
        0, 0
      );

      ctx.closePath();
      ctx.fill();

      // Delicate inner vein spine
      ctx.beginPath();
      ctx.moveTo(0, length * 0.1);
      ctx.lineTo(0, length * 0.8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    }

    function drawFlowerCenter(ctx, radius, palette, time) {
      ctx.save();
      // Glowing outer core
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.3);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, palette.center);
      coreGrad.addColorStop(0.8, palette.secondary);
      coreGrad.addColorStop(1, 'rgba(0,0,0,0.6)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Phyllotaxis / Golden Ratio stamen pollen dots
      const numSeeds = 45;
      const goldenAngle = 137.5 * (Math.PI / 180);
      for (let i = 0; i < numSeeds; i++) {
        const r = Math.sqrt(i / numSeeds) * (radius * 0.85);
        const theta = i * goldenAngle + time * 0.2;
        const sx = Math.cos(theta) * r;
        const sy = Math.sin(theta) * r;
        
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : palette.center;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    let lastTime = performance.now();

    function animate(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      const t = now * 0.001;

      // Smooth damping interpolation
      state.bloomScale += (state.targetBloomScale - state.bloomScale) * 0.08;
      state.pulseImpulse *= 0.94; // damp superbloom pulse
      
      state.tiltX += (state.targetTiltX - state.tiltX) * 0.08;
      state.tiltY += (state.targetTiltY - state.tiltY) * 0.08;

      // Update rotation
      state.rotationAngle += state.spinSpeed * deltaTime * 0.9;

      // Breathing oscillation
      const breath = state.isPulsing ? Math.sin(t * 1.8) * 0.06 : 0;
      const activeScale = Math.max(0.1, state.bloomScale + breath + state.pulseImpulse);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const basePetalLength = Math.min(width, height) * 0.26 * activeScale;
      const basePetalWidth = basePetalLength * 0.38;

      // Spawn ambient pollen floating sparkles
      if (state.sparklesEnabled && Math.random() < 0.25) {
        const spread = basePetalLength * 0.9;
        const px = centerX + (Math.random() - 0.5) * spread;
        const py = centerY + (Math.random() - 0.5) * spread;
        particles.push(new Particle(px, py, state.palette.primary, 0.6));
      }

      ctx.save();
      // Translate to screen center
      ctx.translate(centerX, centerY);

      // Simulated 3D tilt transformation matrix
      const cosX = Math.cos(state.tiltX);
      const sinY = Math.sin(state.tiltY);
      ctx.transform(1, state.tiltY * 0.45, 0, cosX, 0, 0);

      // Draw Flower Petal Rings from Outside (Layer 0) to Inside
      const totalLayers = state.layers;
      const palette = state.palette;

      for (let layer = 0; layer < totalLayers; layer++) {
        const layerRatio = layer / (totalLayers - 1 || 1); // 0 at outer, 1 at inner
        const layerLength = basePetalLength * (1 - layerRatio * 0.58);
        const layerWidth = basePetalWidth * (1 - layerRatio * 0.52);

        // Counter-rotation or phase shift per layer creates hypnotic 3D depth
        const layerSpinOffset = (layer % 2 === 0 ? 1 : -0.7) * (t * 0.15);
        const layerAngleOffset = (layer * Math.PI) / state.petalsPerLayer + layerSpinOffset;

        const petalsCount = state.petalsPerLayer;
        const angleStep = (Math.PI * 2) / petalsCount;

        // Color interpolation between outer and inner gradients
        const colStart = palette.outerGrad[0];
        const colMid = layerRatio > 0.5 ? palette.innerGrad[1] : palette.outerGrad[1];
        const colEnd = layerRatio > 0.5 ? palette.innerGrad[2] : palette.outerGrad[2];

        for (let p = 0; p < petalsCount; p++) {
          const currentPetalAngle = state.rotationAngle + layerAngleOffset + p * angleStep;
          
          ctx.save();
          ctx.rotate(currentPetalAngle);
          
          // Slight procedural petal lift & curl
          const curl = Math.sin(t * 2 + layer) * 5;
          drawCurvedPetal(ctx, layerLength, layerWidth, colStart, colMid, colEnd, curl);
          
          ctx.restore();
        }
      }

      // Draw Center Pollen Bulb
      ctx.resetTransform()
      const centerRadius = basePetalLength * 0.19;
      drawFlowerCenter(ctx, centerRadius, palette, t);
      // Render floating particles & pollen sparkles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    }

    // Start animation loop on load
    requestAnimationFrame(animate);