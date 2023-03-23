import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Space } from '../../world/space.js';
import { Line } from '../../world/shapes/line.js';
import { Rectangle } from '../../world/shapes/rectangle.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';

let camera, scene, renderer, stats;
const dummy = new THREE.Object3D();
const blocks = new BlockBuilder('../../');

await blocks.load();

let space = new Space(30 * 9, 30, 30 * 9, 0, 0, 0);
let rect = new Rectangle(space);

//floor
rect.flat(0, 0, 0, 30 * 3, 30 * 3, 'glowstone');

//walls
//col 1
rect.z_to_z(0, 1, 0, 30, 7, 'stone_bricks_alt');
rect.z_to_z(30, 1, 0, 30, 7, 'stone_bricks_alt');
rect.x_to_x(0, 1, 0, 30, 7, 'stone_bricks_alt');
rect.x_to_x(0, 1, 30, 30, 7, 'stone_bricks_alt');

rect.z_to_z(0, 1, 30, 30, 7, 'stone_bricks_alt');
rect.z_to_z(30, 1, 30, 30, 7, 'stone_bricks_alt');
rect.x_to_x(0, 1, 30, 30, 7, 'stone_bricks_alt');
rect.x_to_x(0, 1, 60, 30, 7, 'stone_bricks_alt');

rect.z_to_z(0, 1, 60, 30, 7, 'stone_bricks_alt');
rect.z_to_z(30, 1, 60, 30, 7, 'stone_bricks_alt');
rect.x_to_x(0, 1, 60, 30, 7, 'stone_bricks_alt');
rect.x_to_x(0, 1, 90, 30, 7, 'stone_bricks_alt');

// col 2
rect.z_to_z(30, 1, 0, 30, 7, 'stone_bricks_alt');
rect.z_to_z(60, 1, 0, 30, 7, 'stone_bricks_alt');
rect.x_to_x(30, 1, 0, 30, 7, 'stone_bricks_alt');
rect.x_to_x(30, 1, 30, 30, 7, 'stone_bricks_alt');

rect.z_to_z(30, 1, 30, 30, 7, 'stone_bricks_alt');
rect.z_to_z(60, 1, 30, 30, 7, 'stone_bricks_alt');
rect.x_to_x(30, 1, 30, 30, 7, 'stone_bricks_alt');
rect.x_to_x(30, 1, 60, 30, 7, 'stone_bricks_alt');

rect.z_to_z(30, 1, 60, 30, 7, 'stone_bricks_alt');
rect.z_to_z(60, 1, 60, 30, 7, 'stone_bricks_alt');
rect.x_to_x(30, 1, 60, 30, 7, 'stone_bricks_alt');
rect.x_to_x(30, 1, 90, 30, 7, 'stone_bricks_alt');

// col 3
rect.z_to_z(60, 1, 0, 30, 7, 'stone_bricks_alt');
rect.z_to_z(90, 1, 0, 30, 7, 'stone_bricks_alt');
rect.x_to_x(60, 1, 0, 30, 7, 'stone_bricks_alt');
rect.x_to_x(60, 1, 30, 30, 7, 'stone_bricks_alt');

rect.z_to_z(60, 1, 30, 30, 7, 'stone_bricks_alt');
rect.z_to_z(90, 1, 30, 30, 7, 'stone_bricks_alt');
rect.x_to_x(60, 1, 30, 30, 7, 'stone_bricks_alt');
rect.x_to_x(60, 1, 60, 30, 7, 'stone_bricks_alt');

rect.z_to_z(60, 1, 60, 30, 7, 'stone_bricks_alt');
rect.z_to_z(90, 1, 60, 30, 7, 'stone_bricks_alt');
rect.x_to_x(60, 1, 60, 30, 7, 'stone_bricks_alt');
rect.x_to_x(60, 1, 90, 30, 7, 'stone_bricks_alt');

const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 50, 0);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  stats = new Stats();
  document.body.appendChild(stats.dom);

  space.blocks.forEach((b) => {
    let count = space.positions[b].length;
    let mesh = blocks.createInstanced[b](count);
    for (let i = 0; i < count; i++) {
      let v = space.positions[b][i];
      dummy.position.set(v.x - 14.5, v.y, v.z - 14.5);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    scene.add(mesh);
  });
  blocks.fix();
}

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
  blocks.animate();
}

init();
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();;
animate();
