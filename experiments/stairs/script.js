import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer, stats;
let loader = new THREE.TextureLoader();
let texture_path = '../../assets/minecraft/textures/64/block_alt/stone_bricks.png';
let scale = 0.333;
let offset = 0.333;
let step = 3;
const block = new THREE.BoxGeometry(scale, scale, scale);
const material = new THREE.MeshBasicMaterial({
  map: loader.load(texture_path)
});
const mesh = new THREE.Mesh(block, material);
const g = new THREE.Group();
for (let x = 0; x < step; x++) {
  for (let y = 0; y < step; y++) {
    for (let z = 0; z < step - y; z++) {
      let m = mesh.clone();
      m.position.set(x * scale + -offset, y * scale + -offset, z * scale + -offset);
      g.add(m);
    }
  }
}
const cube = new THREE.BoxGeometry(1, 1, 1);
const comp = new THREE.Mesh(cube, material);
comp.position.x = 1;

const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 5, 0);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.localClippingEnabled = true;
  document.body.appendChild(renderer.domElement);
  stats = new Stats();
  document.body.appendChild(stats.dom);

  scene.add(g);
  scene.add(comp);
}

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
}

init();
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
animate();
