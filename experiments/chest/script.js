import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

THREE.Cache.enabled = true;

let camera, scene, renderer, stats;
let loader = new THREE.TextureLoader();

let texture_path = '../../assets/minecraft/textures/64/entity/chest/normal.png';

let chest_frame_g = new THREE.BoxGeometry(1, 0.75, 1);
let chest_frame_m = [
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  })];

let chest_frame = new THREE.Mesh(
  chest_frame_g,
  chest_frame_m);

let u = 56 / 256;
let v = 40 / 256;
let v2 = 16 / 256;

//right
chest_frame_m[0].map.rotation = Math.PI;
chest_frame_m[0].map.repeat.set(u, v);
chest_frame_m[0].map.offset.set(0.875, 0.486);

//left
chest_frame_m[1].map.rotation = Math.PI;
chest_frame_m[1].map.repeat.set(u, v);
chest_frame_m[1].map.offset.set(0.4385, 0.486);

//top
chest_frame_m[2].map.rotation = Math.PI + Math.PI / 2;
chest_frame_m[2].map.repeat.set(u, u);
chest_frame_m[2].map.offset.set(0.656, 0.482);

//bottom
chest_frame_m[3].map.rotation = Math.PI + Math.PI / 2;
chest_frame_m[3].map.repeat.set(u, u);
chest_frame_m[3].map.offset.set(0.44, 0.482);

//front
chest_frame_m[4].map.rotation = Math.PI;
chest_frame_m[4].map.repeat.set(u, v);
chest_frame_m[4].map.offset.set(0.218, 0.484);

//back
chest_frame_m[5].map.rotation = Math.PI;
chest_frame_m[5].map.repeat.set(u, v);
chest_frame_m[5].map.offset.set(0.218, 0.484);

let chest_lid_g = new THREE.BoxGeometry(1, 0.25, 1);
let chest_lid_m = [
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  }),
    new THREE.MeshBasicMaterial({
    map: loader.load(texture_path)
  })];

let chest_lid = new THREE.Mesh(
  chest_lid_g,
  chest_lid_m);

//right
chest_lid_m[0].map.rotation = Math.PI;
chest_lid_m[0].map.repeat.set(u, v2);
chest_lid_m[0].map.offset.set(0.875, 0.77);

//left
chest_lid_m[1].map.rotation = Math.PI;
chest_lid_m[1].map.repeat.set(u, v2);
chest_lid_m[1].map.offset.set(0.4385, 0.77);

//top
chest_lid_m[2].map.rotation = Math.PI + Math.PI / 2;
chest_lid_m[2].map.repeat.set(u, u);
chest_lid_m[2].map.offset.set(0.654, 0.784);

//bottom
chest_lid_m[3].map.rotation = Math.PI + Math.PI / 2;
chest_lid_m[3].map.repeat.set(u, u);
chest_lid_m[3].map.offset.set(0.656, 0.482);

//front
chest_lid_m[4].map.rotation = Math.PI;
chest_lid_m[4].map.repeat.set(u, v2);
chest_lid_m[4].map.offset.set(0.65, 0.77);

//back
chest_lid_m[5].map.rotation = Math.PI;
chest_lid_m[5].map.repeat.set(u, v2);
chest_lid_m[5].map.offset.set(0.65, 0.77);

chest_lid.position.y = 0.5;
/*
chest_lid.rotation.z = 1;
chest_lid.position.x = -0.333;
chest_lid.position.y = 0.84;
*/



let chest = new THREE.Group();
chest.add(chest_frame);
chest.add(chest_lid);

const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(3, 5, 3);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  stats = new Stats();
  document.body.appendChild(stats.dom);

  scene.add(chest);

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

let btn = document.querySelector('.btn');
let iid = -1;
btn.onclick = () => {
  let l = chest_lid;
  let action = btn.innerText.toLowerCase();
  if (action == 'open') {
    btn.innerText = 'Opening';
    iid = setInterval(() => {
        if (l.rotation.z >= 1.2) {
          clearInterval(iid);
          iid = -1;
          btn.innerText = 'Close';
        }

        l.rotation.z += 0.05;
        l.position.y += 0.015;
        l.position.x -= 0.015;
      },
      11
    );
  } else if(action == 'close') {
    btn.innerText = 'Closing';
    iid = setInterval(() => {
        if (l.rotation.z <= 0.05) {
          clearInterval(iid);
          iid = -1;
          btn.innerText = 'Open';
        }

        l.rotation.z -= 0.05;
        l.position.y -= 0.015;
        l.position.x += 0.015;
      },
      11
    );
  }
};
