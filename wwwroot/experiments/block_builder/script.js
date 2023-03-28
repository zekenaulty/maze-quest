import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';

let camera, scene, renderer, stats;
const blocks = new BlockBuilder('../../');

blocks.addEventListener('loading', (e) => {
  //console.info('item loaded: ' + e.url);
});

blocks.addEventListener('built', (e) => {
  //console.info('block schematic built: ' + e.name);
});

const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(29, 20, 29);
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
  blocks.animate();
  //console.log(camera.position);
}

init();
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
animate();

await blocks.load();

let x = 0, y = 0, z = 0;
let g = new THREE.Group();

blocks.names.forEach((name) => {
  let b = blocks.create[name]();
  b.position.set(x, y, z);
  g.add(b);

  if (x == 16 && z == 16) {
    x = 0;
    z = 0;
    y += 4;
  } else if (x == 16) {
    x = 0;
    z += 4;
  } else {
    x += 4;
  }

});

blocks.fix();

g.position.set(-8, -y * 0.5, -8);

scene.add(g);
