import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

import { BlockBuilder } from '../../assets/blockBuilder.js';

let camera, scene, renderer, stats;

const blocks = new BlockBuilder('../../');

await blocks.load();

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

let glowstone = blocks.create.glowstone();

scene.add(glowstone);

setTimeout(() => {
    scene.remove(glowstone);
}, 10000);
