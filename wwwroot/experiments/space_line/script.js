import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Space } from '../../world/space.js';
import { Line } from '../../world/shapes/line.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';

let camera, scene, renderer, stats, mesh;
const dummy = new THREE.Object3D();
const blocks = new BlockBuilder('../../');

await blocks.load();

const names = blocks.names;
const block = names[Math.floor(Math.random() * names.length)];

let space = new Space(30, 30, 30, 0, 0, 0);
let line = new Line(space);

//box
line.plot(0, 0, 0, 0, 0, 29, block);
line.plot(0, 0, 29, 29, 0, 29, block);
line.plot(29, 0, 29, 29, 0, 0, block);
line.plot(29, 0, 0, 0, 0, 0, block);

//point
line.plot(0, 0, 0, 14, 14, 14, block);
line.plot(0, 0, 29, 14, 14, 15, block);
line.plot(29, 0, 29, 15, 14, 15, block);
line.plot(29, 0, 0, 15, 14, 14, block);

const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(23, 50, 23);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  stats = new Stats();
  document.body.appendChild(stats.dom);

  let count = space.positions[block].length;
  mesh = blocks.createInstanced[block](count);
  for (let i = 0; i < count; i++) {
    let v = space.positions[block][i];
    dummy.position.set(v.x - 14.5, v.y, v.z - 14.5);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  scene.add(mesh);
}

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
}

init();
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();;
animate();
