import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer, stats;

let mesh;
const amount = 75;
const count = Math.pow(amount, 3);
const dummy = new THREE.Object3D();

const init = () => {

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(amount * 0.9, amount * 0.9, amount * 0.9);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  let geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.computeVertexNormals();

  const material = new THREE.MeshBasicMaterial({
    color: 'silver',
    map: new THREE.TextureLoader().load('../../assets/minecraft/textures/block/stone_bricks.png')
  });

  mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  scene.add(mesh);
  //mesh.scale.set(0.1,0.1,0.1);

  const gui = new GUI();
  gui.add(mesh, 'count', 0, count);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener('resize', onWindowResize);

}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
const animate = () => {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

let once = false;

const render = () => {
  if (mesh) {
    const time = Date.now() * 0.001;
    mesh.rotation.x = Math.sin(time / 4);
    mesh.rotation.y = Math.sin(time / 2);
    let i = 0;
    const offset = (amount - 1) / 2;
    if (!once) {
      for (let x = 0; x < amount; x++) {
        for (let y = 0; y < amount; y++) {
          for (let z = 0; z < amount; z++) {
            dummy.position.set(offset - x, offset - y, offset - z);
            //dummy.rotation.y = (Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time));
            //dummy.rotation.z = dummy.rotation.y * 2;
            dummy.updateMatrix();
            mesh.setMatrixAt(i++, dummy.matrix);
          }
        }
      }
      once = true;
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }
  renderer.render(scene, camera);
}

init();
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
animate();
