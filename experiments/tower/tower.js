import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer, stats;
const tower = (() => {
  let vm = {};
  vm.point = (x, z, tx) => {
    let v = new THREE.Vector3(x, 0, z);
    vm.ring.push(v);
    if (tx && v.z > -vm.radius && v.z < vm.radius) {
      for (let n = v.x + 1; n < tx; n++) {
        v = new THREE.Vector3(n, 0, z);
        vm.fill.push(v);
      }
    }
  };
  vm.points = (x, z, ox, oz) => {
    if (ox == 0) {
      vm.point(x, z + oz);
      vm.point(x, z - oz);
      vm.point(x + oz, z);
      vm.point(x - oz, z, x + oz);
    } else if (ox == oz) {
      vm.point(x + ox, z + oz);
      vm.point(x + ox, z - oz);
      vm.point(x - ox, z + oz, x + ox);
      vm.point(x - ox, z - oz, x + ox);
    } else if (ox < oz) {
      vm.point(x + ox, z + oz);
      vm.point(x + ox, z - oz);
      vm.point(x - ox, z + oz, x + ox);
      vm.point(x - ox, z - oz, x + ox);
      vm.point(x + oz, z + ox);
      vm.point(x + oz, z - ox);
      vm.point(x - oz, z + ox, x + oz);
      vm.point(x - oz, z - ox, x + oz);
    }
  };

  vm.init = (radius = 9, height = 17) => {
    let x = 0;
    let y = 0;
    let z = 0;

    vm.x = x;
    vm.y = y;
    vm.z = z;

    vm.radius = radius;
    vm.size = radius * 2;
    vm.ring = [];
    vm.fill = [];
    vm.height = height;

    let ox = 0;
    let oz = radius;
    let p = Math.floor((3 - radius * 4) / 4);

    vm.points(x, z, ox, oz);
    while (ox < oz) {
      ox++;
      if (p < 0) {
        p += Math.floor(2 * ox + 1);
      } else {
        oz--;
        p += Math.floor(2 * (ox - oz) + 1);
      }
      vm.points(x, z, ox, oz);
    }
    vm.blockCount = vm.ring.length * height;
    
    vm.fill = vm.fill.filter((p) => {
      for(let j = 0; j < vm.ring.length; j++) {
        let v = vm.ring[j];
        if(v.equals(p)) {
          return false;
        }
      }
      return true;
    });
  };

  return vm;
})();

const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 45, 0);
  camera.lookAt(0, 0, 0);
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

const block = (x, y, z, map) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 'silver',
    map: new THREE.TextureLoader().load(map)
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  return mesh;
};

init();


tower.init(3);

let floor = new THREE.Group();
let circle = new THREE.Group();
let cross = new THREE.Group();
let fill = new THREE.Group();

cross.position.y = tower.height;
fill.position.y = 1;
circle.position.y = 1;

scene.add(floor);
scene.add(fill);
scene.add(circle);
scene.add(cross);

for (let x = 0; x <= tower.size; x++) {
  for (let z = 0; z <= tower.size; z++) {
    floor.add(
      block(
        x + -tower.radius,
        0,
        z + -tower.radius,
        '../../assets/minecraft/textures/block/furnace_top.png'));
  }
  if (x > 0 && x < tower.size) {
    if (x != tower.radius) {
      cross.add(
        block(
          0,
          0,
          x + -tower.radius,
          '../../assets/minecraft/textures/block/oak_planks.png'));
    }
    cross.add(
      block(
        x + -tower.radius,
        0,
        0,
        '../../assets/minecraft/textures/block/oak_planks.png'));
  }
}

for (let y = 0; y < tower.height; y++) {
  for (let p = 0; p < tower.ring.length; p++) {
    let v = tower.ring[p];

    circle.add(
      block(
        v.x,
        y,
        v.z,
        '../../assets/minecraft/textures/block/stone_bricks.png'));

  }
}

for (let p = 0; p < tower.fill.length; p++) {
  let v = tower.fill[p];
  fill.add(
    block(
      v.x,
      0,
      v.z,
      '../../assets/minecraft/textures/block/white_wool.png'));
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
animate();
