import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function initPortal() {
  const canvas = document.getElementById('hero-portal-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 10);

  // Colors based on SA-Solutions palette
  const colorGold = new THREE.Color('#D4AF37');
  const colorGoldLight = new THREE.Color('#F4D77A');
  const colorNavy = new THREE.Color('#081B2F');

  // 1. Post-processing (Bloom - Layer 5)
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.8, // radius
    0.2  // threshold
  );
  bloomPass.tintColor = colorGold;
  composer.addPass(bloomPass);

  // Central Portal Hole (Layer 9: Portal Glow & Layer 1: Energy Flow)
  const portalGroup = new THREE.Group();
  portalGroup.position.y = -3;
  scene.add(portalGroup);

  // Black hole
  const holeGeo = new THREE.CircleGeometry(2.5, 64);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: false });
  const holeMesh = new THREE.Mesh(holeGeo, holeMat);
  holeMesh.position.z = 0.1;
  portalGroup.add(holeMesh);

  // Layer 2: Magnetic Curves
  const curveMaterial = new THREE.LineBasicMaterial({
    color: colorGoldLight,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  const curves = [];
  for (let i = 0; i < 40; i++) {
    const points = [];
    const r = 2.5 + Math.random() * 2;
    const a = Math.random() * Math.PI * 2;
    for (let j = 0; j <= 50; j++) {
      const t = j / 50;
      const angle = a + t * Math.PI;
      const radius = r * Math.sin(t * Math.PI);
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius + (r*0.5), Math.sin(t*Math.PI*2) * 2));
    }
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(curveGeo, curveMaterial);
    line.userData = { speed: Math.random() * 0.02 + 0.01, phase: Math.random() * Math.PI * 2 };
    portalGroup.add(line);
    curves.push(line);
  }

  // Layer 3: Particle System (Thousands of tiny glowing particles)
  const particleCount = 4000;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particlePhases = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const r = 2.5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    particlePos[i*3] = Math.cos(theta) * r;
    particlePos[i*3+1] = Math.sin(theta) * r + 2;
    particlePos[i*3+2] = (Math.random() - 0.5) * 5;
    particlePhases[i] = Math.random() * Math.PI * 2;
  }
  
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('phase', new THREE.BufferAttribute(particlePhases, 1));
  
  // Custom shader for particles to move in gravity fields
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: colorGold }
    },
    vertexShader: `
      uniform float time;
      attribute float phase;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        
        // Swirl around center
        float angle = time * 0.2 + phase;
        float r = length(pos.xy);
        pos.x = cos(angle) * r;
        pos.y = sin(angle) * r;
        
        // Flow upwards and wrap around
        pos.y += sin(time * 0.5 + phase) * 2.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (10.0 / -mvPosition.z) * (sin(time * 2.0 + phase) * 0.5 + 0.5);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = clamp(sin(time + phase), 0.0, 1.0) * 0.8;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vAlpha;
      void main() {
        // Soft circle
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float a = (0.5 - d) * 2.0 * vAlpha;
        gl_FragColor = vec4(color, a);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const particles = new THREE.Points(particleGeo, particleMat);
  portalGroup.add(particles);

  // Layer 7: Atmospheric Fog using planes
  const fogGeo = new THREE.PlaneGeometry(30, 30);
  const fogMat = new THREE.MeshBasicMaterial({
    color: colorNavy,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const fog1 = new THREE.Mesh(fogGeo, fogMat);
  fog1.position.z = -5;
  scene.add(fog1);
  
  const fog2 = new THREE.Mesh(fogGeo, fogMat);
  fog2.position.z = 2;
  scene.add(fog2);

  // Layer 11: Parallax Depth
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Pulse bloom (Layer 5)
    bloomPass.strength = 1.5 + Math.sin(time * 0.5) * 0.5;

    // Animate Particles
    particleMat.uniforms.time.value = time;

    // Animate Curves
    curves.forEach((line) => {
      line.rotation.z += line.userData.speed;
      line.material.opacity = (Math.sin(time * 2 + line.userData.phase) * 0.5 + 0.5) * 0.6;
    });

    // Animate Fog rotation
    fog1.rotation.z = time * 0.05;
    fog2.rotation.z = -time * 0.03;

    // Parallax
    const targetX = mouseX * 0.5;
    const targetY = mouseY * 0.5 - 3;
    portalGroup.position.x += (targetX - portalGroup.position.x) * 0.05;
    portalGroup.position.y += (targetY - portalGroup.position.y) * 0.05;
    
    // Slight tilt
    portalGroup.rotation.y += (mouseX * 0.2 - portalGroup.rotation.y) * 0.05;
    portalGroup.rotation.x += (-mouseY * 0.2 - portalGroup.rotation.x) * 0.05;

    composer.render();
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });
}
