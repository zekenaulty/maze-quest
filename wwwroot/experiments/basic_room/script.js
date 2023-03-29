import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { Space } from '../../world/space.js';
import { BasicRoom } from '../../world/rooms/basicRoom.js';
import { RoomBounds } from '../../world/rooms/roomBounds.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { Joystick } from '../../res/joysticks/joystick.js';
import '../../core/array.js';
import '../../core/isMobile.js';

let camera, scene, renderer, stats;
const mobile = isMobile();

const dummy = new THREE.Object3D();
const blocks = new BlockBuilder('../../');
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

const STEPS_PER_FRAME = 5;

let speed = 25;

let dpad = new Joystick("stick1", 64, 8);
let cpad = new Joystick("stick2", 64, 8);

await blocks.load();

let w = 17;
let h = 9;
let d = 17;
let l = 11;
let wd = w * l;
let c = wd * 0.5;
let space = new Space(w * l, 10, d * l, 0, 0, 0);

const rooms = () => {
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
};
rooms();

const meshes = {};
const turf = new THREE.Group();
let first = true;
let last = body.position.clone();

const chunked = () => {
    if (!first && body.position.distanceTo(last) < 8) {
        return;
    }

    console.log(`${body.position.x}, ${body.position.y}, ${body.position.z}`);
    let x = Math.floor(body.position.x - 32);
    let y = Math.floor(body.position.y - 32);
    let z = Math.floor(body.position.z - 32);

    console.log(`${x}, ${y}, ${z}`);
    x = x < 0 ? 0 : x;
    y = y < 0 ? 0 : y;
    z = z < 0 ? 0 : z;

    let lx = x + 64;
    let ly = d;
    let lz = z + 64;

    let pos = {};
    console.log(`${x}, ${y}, ${z}`);
    for (let xi = x; xi < lx; xi++) {
        for (let yi = y; yi < ly; yi++) {
            for (let zi = z; zi < lz; zi++) {
                const b = space.get(xi, yi, zi);
                if (b === 'air' || b === undefined) {
                    continue;
                }
                if (pos[b] === undefined) {
                    pos[b] = [];
                }
                pos[b].push(new THREE.Vector3(xi, yi, zi));
            }
        }
    }

    for (const b in pos) {
        const count = pos[b].length;
        if (meshes[b] !== undefined) {
            console.log(`removing ${b}`);
            scene.remove(meshes[b]);
            meshes[b].dispose();
        }
        const mesh = blocks.createInstanced[b](count);
        for (let i = 0; i < count; i++) {
            let v = pos[b][i];
            let r = space.getRotation(v.x, v.y, v.z);
            dummy.position.set(v.x, v.y, v.z);
            dummy.rotation.set(r.x, r.y, r.z);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
        meshes[b] = mesh;
        scene.add(mesh);
        console.log(`added ${b} with ${count} blocks`);
    }
    first = false;
    last = body.position.clone();

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

const move = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

const look = {
    up: false,
    down: false,
    left: false,
    right: false
};

const updatePlayer = (deltaTime) => {

    let damping = Math.exp(-4 * deltaTime) - 1;
    const playerVelocity = new THREE.Vector3();
    const vf = getForwardVector();
    let y = dpad.value.y;
    let x = dpad.value.x;

    let moveY = false;
    let moveX = false;

    const keySpeed = 1.7;

    if (y < 0 || move.forward) {
        moveY = !blockedForward();
        if (y == 0) {
            y = -keySpeed;
        }
    } else if (y > 0 || move.backward) {
        moveY = !blockedBackward();
        if (y == 0) {
            y = keySpeed;
        }
    }

    if (x < 0 || move.left) {
        moveX = !blockedLeft();
        if (x == 0) {
            x = -keySpeed;
        }
    } else if (x > 0 || move.right) {
        moveX = !blockedRight();
        if (x == 0) {
            x = keySpeed;
        }
    }

    if (moveY) {
        playerVelocity.add(getForwardVector().multiplyScalar(-y * speed));
    }

    if (moveX) {
        playerVelocity.add(getSideVector().multiplyScalar(x * speed));
    }

    let cv = cpad.value;
    if (!mobile) {
        if (look.up) {
            cv.y = -keySpeed / 3;
        } else if (look.down) {
            cv.y = keySpeed / 3;
        } else if (look.left) {
            cv.x = -keySpeed / 1.2;
        } else if (look.right) {
            cv.x = keySpeed / 1.2;
        }

        if (!look.up && !look.down) { cv.y = 0; }
        if (!look.left && !look.right) { cv.x = 0; }
    }

    if (cv.x != 0) {
        camera.rotation.y += -cv.x / 32;
    }

    if (cv.y != 0) {

        camera.rotation.x += -cv.y / 32;
        if (camera.rotation.x > 0.5) {
            camera.rotation.x = 0.5;
        }
        if (camera.rotation.x < -0.5) {
            camera.rotation.x = -0.5;
        }
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

    ray.set(p, v);
    return ray.intersectObjects(scene.children, true).any();
};

const blockedBackward = () => {
    const v = getBackwardVector();
    const p = body.position.clone();

    ray.set(p, v);
    return ray.intersectObjects(scene.children, true).any();
};

const blockedLeft = () => {
    const v = getLeftVector();
    const p = body.position.clone();

    ray.set(p, v);
    return ray.intersectObjects(scene.children, true).any();
};

const blockedRight = () => {
    const v = getRightVector();
    const p = body.position.clone();

    ray.set(p, v);
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

document.addEventListener('keydown', (e) => {
    console.log(e);
    switch (e.key) {
        case 'w':
            move.forward = true;
            break;
        case 'a':
            move.left = true;
            break;
        case 's':
            move.backward = true;
            break;
        case 'd':
            move.right = true;
            break;
        case 'ArrowUp':
            look.up = true;
            break;
        case 'ArrowDown':
            look.down = true;
            break;
        case 'ArrowLeft':
            look.left = true;
            break;
        case 'ArrowRight':
            look.right = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    console.log(e);
    switch (e.key) {
        case 'w':
            move.forward = false;
            break;
        case 'a':
            move.left = false;
            break;
        case 's':
            move.backward = false;
            break;
        case 'd':
            move.right = false;
            break;
        case 'ArrowUp':
            look.up = false;
            break;
        case 'ArrowDown':
            look.down = false;
            break;
        case 'ArrowLeft':
            look.left = false;
            break;
        case 'ArrowRight':
            look.right = false;
            break;
    }
});
if (!mobile) {
    document.querySelector('#joy1').style.display = 'none';
    document.querySelector('#joy2').style.display = 'none';
}