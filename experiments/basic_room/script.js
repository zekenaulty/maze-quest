import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Space } from '../../world/space.js';
import { BasicRoom } from '../../world/rooms/basicRoom.js';
import { RoomBounds } from '../../world/rooms/roomBounds.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { Joystick } from '../../res/joysticks/joystick.js';
import '../../core/array.js';

let camera, scene, renderer, stats, mesh;
const dummy = new THREE.Object3D();
const blocks = new BlockBuilder('../../');
let playerVector = new THREE.Vector3();
const clock = new THREE.Clock();

const body_g = new THREE.BoxGeometry(1, 2.5, 1);
const body_m = new THREE.MeshBasicMaterial();
const body = new THREE.Mesh(body_g, body_m);

const playerCollider = new Capsule(
  new THREE.Vector3(8.5, 1, 8.5),
  new THREE.Vector3(8.5, 2.25, 8.5),
  0.35
);

body.position.copy(playerCollider.start);

const GRAVITY = 30;
const SPHERE_RADIUS = 0.2;
const STEPS_PER_FRAME = 5;

let speed = 25;

let dpad = new Joystick("stick1", 64, 8);
let cpad = new Joystick("stick2", 64, 8);

await blocks.load();

const names = blocks.names;
const block = names[Math.floor(Math.random() * names.length)];


let w = 17;
let h = 9;
let d = 17;
let l = 11;
let wd = w * l;
let c = wd * 0.5;
let space = new Space(w * l, 10, d * l, 0, 0, 0);
let room = new BasicRoom(space);

for (let x = 0; x < l; x++) {
  for (let z = 0; z < l; z++) {
    let r = new BasicRoom(
      space,
      new RoomBounds(
        x == 0 ? 0 : x * w - x,
        0,
        z == 0 ? 0 : z * d - z,
        w,
        h,
        d,
        z == 0 ? false : true,
        x == l - 1 ? false : true,
        z == l - 1 ? false : true,
        x == 0 ? false : true
      ));
    r.generate();
  }
}

const meshes = {};
const turf = new THREE.Group();
let first = true;
let last = body.position.clone();
let chunked = () => {
  if(!first && body.position.distanceTo(last) < 10) {
    return;
  }
  last = body.position.clone();
  space.blocks.forEach((b) => {
    let ro = [];
    let pos = space.positions[b].filter((p, i) => {
      if (p.x <= body.position.x + 34 && p.x >= body.position.x - 34) {
        if (p.z <= body.position.z + 34 && p.z >= body.position.z - 34) {
          ro.push(space.rotations[b][i]);
          return true;
        }
      }
      return false;
    });
    let count = pos.length;
    if(meshes[b]) {
      turf.remove(meshes[b]);
      meshes[b].dispose();
      delete meshes[b];
    }
    let mesh = blocks.createInstanced[b](count);
    for (let i = 0; i < count; i++) {
      let v = pos[i];
      let r = ro[i];
      dummy.position.set(v.x, v.y, v.z);
      dummy.rotation.set(r.x, r.y, r.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    meshes[b] = mesh;
    turf.add(mesh);
  });
  first = false;
};

const init = () => {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    25
  );
  camera.rotation.order = 'YXZ';
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 2, 22);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  stats = new Stats();
  document.body.appendChild(stats.dom);
  
  scene.add(turf);
  scene.add(body);
  
}

const animate = () => {
  requestAnimationFrame(animate);
  const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;
  updatePlayer(deltaTime);
  renderer.render(scene, camera);
  blocks.animate();
  stats.update();
}

const rmf = new THREE.Matrix4();
rmf.makeRotationY(0);
const rmb = new THREE.Matrix4();
rmb.makeRotationY(180 * Math.PI / 180);
const rml = new THREE.Matrix4();
rml.makeRotationY(90 * Math.PI / 180);
const rmr = new THREE.Matrix4();
rmr.makeRotationY((360 - 90) * Math.PI / 180);

const ray = new THREE.Raycaster(body.position, new THREE.Vector3(), 0, 1);

const updatePlayer = (deltaTime) => {

  let damping = Math.exp(-4 * deltaTime) - 1;
  const playerVelocity = new THREE.Vector3();
  const vf = getForwardVector();
  const y = dpad.value.y;
  const x = dpad.value.x;

  let moveY = false;
  let moveX = false;


  if (y < 0) {
    moveY = !blockedForward();
  } else if (y > 0) {
    moveY = !blockedBackward();
  }

  if (x < 0) {
    moveX = !blockedLeft();
  } else if (x > 0) {
    moveX = !blockedRight();
  }

  if (moveY) {
    playerVelocity.add(getForwardVector().multiplyScalar(-y * speed));
  }

  if (moveX) {
    playerVelocity.add(getSideVector().multiplyScalar(x * speed));
  }

  let cv = cpad.value;
  camera.rotation.y += -cv.x / 32;
  camera.rotation.x += -cv.y / 32;
  if (camera.rotation.x > 0.5) {
    camera.rotation.x = 0.5;
  }
  if (camera.rotation.x < -0.5) {
    camera.rotation.x = -0.5;
  }
  playerVelocity.addScaledVector(playerVelocity, damping);

  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  playerCollider.translate(deltaPosition);

  camera.position.copy(playerCollider.end);
  body.position.copy(playerCollider.start);
  
  chunked();

};

const blockedForward = () => {
  const v = getForwardVector();
  const p = body.position.clone();
  
  ray.set(p,v);
  return ray.intersectObjects(scene.children, true).any();
};

const blockedBackward = () => {
  const v = getBackwardVector();
  const p = body.position.clone();
  
  ray.set(p,v);
  return ray.intersectObjects(scene.children, true).any();
};

const blockedLeft = () => {
  const v = getLeftVector();
  const p = body.position.clone();
  
  ray.set(p,v);
  return ray.intersectObjects(scene.children, true).any();
};

const blockedRight = () => {
  const v = getRightVector();
  const p = body.position.clone();
  
  ray.set(p,v);
  return ray.intersectObjects(scene.children, true).any();
};

const getForwardVector = () => {
  const v = new THREE.Vector3();
  camera.getWorldDirection(v);
  v.y = 0;
  v.normalize();
  return v;
};

const getSideVector = () => {
  const v = new THREE.Vector3();
  camera.getWorldDirection(v);
  v.y = 0;
  v.normalize();
  v.cross(camera.up);
  return v;
};

const getBackwardVector = () => {
  const v = getForwardVector();
  v.applyMatrix4(rmb);
  return v;
};

const getLeftVector = () => {
  const v = getForwardVector();
  v.applyMatrix4(rml);
  return v;
};

const getRightVector = () => {
  const v = getLeftVector();
  v.applyMatrix4(rmr);
  return v;
};

init();
animate();
