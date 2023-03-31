import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';

const blocks = new BlockBuilder('../../');

await blocks.load();

let camera, scene, renderer, stats;

const init = () => {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(3, 6, 3);
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
    blocks.animate();

}

init();
blocks.fix();
for (let x = 0; x < 4; x++) {
    for (let z = 0; z < 4; z++) {
        let still = blocks.create.water_still();
        let stone = blocks.create.smooth_stone();
        stone.position.set(x, 0, z);
        still.position.set(x, 1, z);

        scene.add(stone);
        scene.add(still);
    }
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
animate();
