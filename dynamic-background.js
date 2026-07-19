import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { initLightflow } from './lightflow.js';
import { GLB_B64 } from './logo-glb.js';

// Initialize lightflow beam
initLightflow();

// 3D LOGO BACKGROUND
const holder = document.getElementById('canvas-holder');
if (holder) {
  holder.style.background = "radial-gradient(120% 100% at 50% 20%, #14304a 0%, #0d2338 45%, #081B2F 75%, #0A0A0A 100%)";
  holder.style.opacity = '1';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0,0,6);

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  holder.appendChild(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xfff6dd, 1.8);
  dirLight.position.set(5,6,5);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0xffd98e, 0.7);
  pointLight.position.set(-6,-2,3);
  scene.add(pointLight);

  function b64ToArrayBuffer(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  const logoGroup = new THREE.Group();
  scene.add(logoGroup);

  loader.parse(b64ToArrayBuffer(GLB_B64), '', (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    model.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 2.6 / maxDim;
    model.scale.setScalar(scaleFactor);
    logoGroup.add(model);
  }, (err) => console.error('GLB load error', err));

  const mouse = { x:0, y:0 };
  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX/window.innerWidth)*2 - 1;
    mouse.y = (e.clientY/window.innerHeight)*2 - 1;
  });

  const clock = new THREE.Clock();
  
  // Shared logo target that can be animated by GSAP on specific pages
  const isMobile = window.innerWidth <= 768;
  const logoTarget = { 
    x: isMobile ? 0 : 3.2, 
    y: isMobile ? 1.0 : 1.2, 
    z: -1.6, 
    scale: isMobile ? 0.2 : 0.34 
  };
  window.dynamicLogoTarget = logoTarget;
  
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    logoGroup.rotation.y += delta * 0.15;

    const interactiveAmount = 1; 
    const targetTiltX = THREE.MathUtils.clamp(-mouse.y * 0.6, -0.6, 0.6) * interactiveAmount;
    const targetTiltZ = THREE.MathUtils.clamp(mouse.x * 0.4, -0.4, 0.4) * interactiveAmount;
    logoGroup.rotation.x = THREE.MathUtils.lerp(logoGroup.rotation.x, targetTiltX, 0.08);
    logoGroup.rotation.z = THREE.MathUtils.lerp(logoGroup.rotation.z, targetTiltZ, 0.08);

    const floatY = Math.sin(elapsedTime * 2) * 0.15 * interactiveAmount;

    const targetX = logoTarget.x + (mouse.x * 0.8 * interactiveAmount);
    const targetY = logoTarget.y - (mouse.y * 0.8 * interactiveAmount) + floatY;

    logoGroup.position.x = THREE.MathUtils.lerp(logoGroup.position.x, targetX, 0.08);
    logoGroup.position.y = THREE.MathUtils.lerp(logoGroup.position.y, targetY, 0.08);
    logoGroup.position.z = THREE.MathUtils.lerp(logoGroup.position.z, logoTarget.z, 0.08);
    logoGroup.scale.setScalar(THREE.MathUtils.lerp(logoGroup.scale.x || 1, logoTarget.scale, 0.07));

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
