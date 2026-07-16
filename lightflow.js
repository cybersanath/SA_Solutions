import * as THREE from 'three';

let scene, camera, renderer, particles;

export function initLightflow() {
  const canvas = document.getElementById('hero-lightflow-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;
  camera.position.y = 0;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle System
  const particleCount = 15000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const colorPalette = [
    new THREE.Color('#D4AF37'), // Gold
    new THREE.Color('#F4D77A'), // Light Gold
    new THREE.Color('#14304a'), // Blue
    new THREE.Color('#ffffff')  // White
  ];

  for (let i = 0; i < particleCount; i++) {
    const y = (Math.random() - 0.5) * 120; // y from -60 to 60
    // Hourglass shape: narrower at the center
    const radiusBase = 2 + Math.pow(Math.abs(y) / 15, 2); 
    const radius = Math.random() * radiusBase * 1.5;
    const angle = Math.random() * Math.PI * 2;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  window.addEventListener('resize', onWindowResize);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (particles) {
    particles.rotation.y += 0.0015; // Slow spin
    
    // Slight vertical flow
    const positions = particles.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= 0.08; // Flow downwards
      if (positions[i] < -60) {
        positions[i] = 60; // Reset to top
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
}
