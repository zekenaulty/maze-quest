import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';

let camera, scene, renderer, stats;
const blocks = new BlockBuilder('../../', 64);

blocks.addEventListener('loading', (e) => {
  //console.info('item loaded: ' + e.url);
});

blocks.addEventListener('built', (e) => {
  //console.info('block schematic built: ' + e.name);
});

const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 3, 0);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  stats = new Stats();
  document.body.appendChild(stats.dom);
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

await blocks.load();

let x = 0,
  y = 0,
  z = 0;
let g = new THREE.Group();

let name = 'glowstone';
let b = blocks.create[name]();
b.position.set(x, y, z);
let frames = 512 / 16;
let offset = 16 / 512;
let frame = 0;

b.material.map.repeat.set(1, offset);
setInterval(() => {
  b.material.map.offset.set(0, offset * frame)
  if (frame < frames - 1) {
    frame++;
  } else {
    frame = 0;
  }
}, 35);

scene.add(b);

window.b = b;
