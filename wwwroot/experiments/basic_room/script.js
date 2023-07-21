import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { Space } from '../../world/space.js';
import { BasicRoom } from '../../world/rooms/basicRoom.js';
import { Library } from '../../world/rooms/library.js';
import { Passage } from '../../world/rooms/passage.js';
import { RoomBounds } from '../../world/rooms/roomBounds.js';
import { BlockBuilder } from '../../assets/blockBuilder.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { Joystick } from '../../res/joysticks/joystick.js';
import { Maze } from '../../maze/maze.js';
import { RecursiveBacktracker } from '../../maze/generators/recursiveBacktracker.js';
import { MazeToText } from '../../maze/renderers/mazeToText.js';
import { CanvasRectangle } from '../../maze/renderers/canvasRectangle.js';
import { CanvasRectangleScaler } from '../../maze/renderers/canvasRectangleScaler.js';
import '../../core/array.js';
import '../../core/isMobile.js';

const compass = document.querySelector('.compass');
const location = document.querySelector('.location');
const mazeCanvas = new OffscreenCanvas(256, 256);// document.querySelector('.maze-back-buffer');
const mazeContext = mazeCanvas.getContext("2d");

const compassMap = document.querySelector('.compass-map');
const mapContext = compassMap.getContext("2d");

const STEPS_PER_FRAME = 5;

let speed = 25;
let dpad = new Joystick("stick1", 64, 8);
let cpad = new Joystick("stick2", 64, 8);

let w = 17;
let h = 9;
let d = 17;
let l = 16;

const compassSize = 256;
const locationWidth = 256;

compassMap.width = '256';
compassMap.height = '256';

const scaler = new CanvasRectangleScaler(256, 256, 257);
const maze = new Maze(scaler.rows, scaler.columns);
const mazeRenderer = new CanvasRectangle(maze, scaler, mazeContext);
const toText = new MazeToText(maze);
const mazeText = document.querySelector('.maze-text');

const gen = new RecursiveBacktracker(maze);
gen.generate();

mazeText.innerText = toText.render();

let centerMap = 128;
let cellSize = scaler.size;

const lookSpeed = 2.5;
let lon = 0;
let lat = 0;
let pointerX = 0;
let pointerY = 0;

let viewHalfX = innerWidth / 2;
let viewHalfY = innerHeight / 2;

let verticalMin = 1.1;
let verticalMax = 2.1;
let mouseLook = false;

let camera, scene, renderer, stats;
const dummy = new THREE.Object3D();
const blocks = new BlockBuilder('../../');
const clock = new THREE.Clock();

const body_g = new THREE.BoxGeometry(0.5, 2.5, 0.5);
const body_m = new THREE.MeshBasicMaterial();
const body = new THREE.Mesh(body_g, body_m);

const newMap = document.createElement('canvas');
const ctx = newMap.getContext('2d');
const mapWidth = maze.columns * w * 16;
const mapHeight = maze.rows * d * 16;
newMap.width = mapWidth;
newMap.height = mapHeight;
newMap.style.width = 768 + 'px';
newMap.style.height = 768 + 'px';
newMap.style.top = '10px';
newMap.style.left = '10px';
newMap.style.position = 'fixed';
newMap.style.zIndex = '50';
newMap.style.display = 'none';
document.body.appendChild(newMap);

let roomz = [
    BasicRoom,
    Library,
    Passage
];

await blocks.load();
let space = new Space(w * maze.columns, 10, d * maze.rows, 0, 0, 0);

const rooms = () => {
    for (let row = 0; row < maze.rows; row++) {
        for (let col = 0; col < maze.columns; col++) {
            let cell = maze.cell(row, col);
            let x = col;
            let z = row;
            let rc = roomz.sample();
            cell.bounds = new RoomBounds(
                x == 0 ? 0 : x * w - x,
                0,
                z == 0 ? 0 : z * d - z,
                w,
                h,
                d,
                cell.links.linked(cell.north),
                cell.links.linked(cell.east),
                cell.links.linked(cell.south),
                cell.links.linked(cell.west)
            );
            cell.room = new rc(
                space,
                cell.bounds);
            cell.room.generate();
        }
    }
};
rooms();


let sx = maze.start.bounds.x + 8;
let sz = maze.start.bounds.z + 8;
const playerCollider = new Capsule(
    new THREE.Vector3(sx, 1, sz),
    new THREE.Vector3(sx, 2.25, sz),
    0.35
);

body.position.copy(playerCollider.start);

const meshes = {};
const turf = new THREE.Group();
let first = true;
let last = body.position.clone();

const chunked = () => {
    if (!first && body.position.distanceTo(last) < 8) {
        return;
    }

    let x = Math.floor(body.position.x - 32);
    let y = Math.floor(body.position.y - 32);
    let z = Math.floor(body.position.z - 32);

    x = x < 0 ? 0 : x;
    y = y < 0 ? 0 : y;
    z = z < 0 ? 0 : z;

    /*
    would like to get this constrained to a fixed radius of 32, 
    but it is twitch when the positive x,z distance is less than 64 
    */
    const lx = x + 64;
    const ly = d;
    const lz = z + 64;

    let pos = {};
    for (let xi = x; xi < lx; xi++) {
        for (let yi = y; yi < ly; yi++) {
            for (let zi = z; zi < lz; zi++) {
                const b = space.get(xi, yi, zi);
                if (b === 'air' || b === undefined) {
                    continue;
                }
                if (!pos[b]) {
                    pos[b] = [];
                }
                pos[b].push(new THREE.Vector3(xi, yi, zi));
            }
        }
    }

    for (const b in pos) {
        const count = pos[b].length;
        if (meshes[b] !== undefined) {
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
    compass.style.top = `10px`;// `${window.innerHeight - compassSize - 16}px`;
    compass.style.width = `${compassSize}px`;
    compass.style.height = `${compassSize}px`;
    compassMap.style.top = `10px`;// `${window.innerHeight - compassSize - 14.5}px`;
    compassMap.style.width = `${compassSize}px`;
    compassMap.style.height = `${compassSize}px`;

    location.style.top = `0px`;// `${window.innerHeight - 19}px`;
    location.style.width = `${locationWidth}px`;

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
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.top = '16px';
    stats.domElement.style.left = '';
    stats.domElement.style.right = '16px';
    scene.add(body);

}

const mapRoomWidth = w * 16;
const mapRoomDepth = d * 16;

const animate = () => {
    requestAnimationFrame(animate);
    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;
    updatePlayer(deltaTime);
    renderer.render(scene, camera);
    blocks.animate();
    stats.update();
    mazeRenderer.draw();

    mapContext.save();
    mapContext.beginPath();
    mapContext.clearRect(0, 0, compassMap.width, compassMap.height);
    mapContext.arc(centerMap, centerMap, 76, 0, 2 * Math.PI, false);
    mapContext.clip();
    //mapContext.fillStyle = 'white';
    //mapContext.fillRect(0, 0, compassMap.width, compassMap.height);
    let sx = (body.position.x * 16) - (mapRoomWidth / 2) + 8;
    let sy = (body.position.z * 16) - (mapRoomDepth / 2) + 8;
    console.log(`${sx}, ${sy}`);
    mapContext.drawImage(
        newMap,
        sx,
        sy,
        mapRoomWidth,
        mapRoomDepth,
        0,
        0,
        256,
        256
    );

    mapContext.restore();


    mapContext.beginPath();
    mapContext.fillStyle - 'blue';
    mapContext.arc(128, 128, 8, 0, 2 * Math.PI);
    mapContext.fill();
    mapContext.closePath();

}

const rmf = new THREE.Matrix4();
rmf.makeRotationY(0);
const rmb = new THREE.Matrix4();
rmb.makeRotationY(3.141);
const rml = new THREE.Matrix4();
rml.makeRotationY(1.57);
const rmr = new THREE.Matrix4();
rmr.makeRotationY(4.71);

const ray = new THREE.Raycaster(body.position, new THREE.Vector3(), 0.2, 1.2);

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

const followPointer = (deltaTime) => {
    let actualLookSpeed = deltaTime * lookSpeed;

    let verticalLookRatio = 1;
    verticalLookRatio = Math.PI / (verticalMax - verticalMin);

    lon -= pointerX * actualLookSpeed;
    lat -= pointerY * actualLookSpeed * verticalLookRatio;
    lat = Math.max(- 85, Math.min(85, lat));

    let phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);
    phi = THREE.MathUtils.mapLinear(phi, 0, Math.PI, verticalMin, verticalMax);

    const position = camera.position;
    const targetPosition = new THREE.Vector3();
    targetPosition.setFromSphericalCoords(1, phi, theta).add(position);
    camera.lookAt(targetPosition);
};

const updatePlayer = (deltaTime) => {

    let damping = Math.exp(-4 * deltaTime) - 1;
    const playerVelocity = new THREE.Vector3();
    let y = dpad.value.y;
    let x = dpad.value.x;

    let moveY = false;
    let moveX = false;

    const keySpeed = 1.3;

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

    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    playerCollider.translate(deltaPosition);
    camera.position.copy(playerCollider.end);
    body.position.copy(playerCollider.start);

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

    if (mouseLook) {
        followPointer(deltaTime);
    }

    compass.style.transform = `rotate(${camera.rotation.y}rad)`;
    compassMap.style.transform = `rotate(${camera.rotation.y}rad)`;


    location.innerText = `x: ${Math.floor(body.position.x)}, y: ${Math.floor(body.position.y)}, z: ${Math.floor(body.position.z)}`;

    mazeText.innerText = toText.render();

    if (maze.active.bounds.outOfBoundsWest(body.position.x)) {
        maze.active = maze.active.west;
    } else if (maze.active.bounds.outOfBoundsEast(body.position.x)) {
        maze.active = maze.active.east;
    } else if (maze.active.bounds.outOfBoundsNorth(body.position.z)) {
        maze.active = maze.active.north;
    } else if (maze.active.bounds.outOfBoundsSouth(body.position.z)) {
        maze.active = maze.active.south;
    }

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
    const v = getForwardVector();
    v.applyMatrix4(rmr);
    return v;
};

init();
followPointer(new Date().getTime());
animate();

document.addEventListener('keydown', (e) => {
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
            case 'q':
            look.left = true;
            break;
        case 'ArrowRight':
            case 'e':
            look.right = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
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
            case 'q':
            look.left = false;
            break;
        case 'ArrowRight':
            case 'e':
            look.right = false;
            break;
        case 'm':
            if (newMap.style.display == '') {
                newMap.style.display = 'none';
            } else {
                newMap.style.display = '';
            }
            break;
    }
});

if (mobile) {
    document.querySelector('#joy1').style.display = '';
    document.querySelector('#joy2').style.display = '';
}

document.addEventListener('pointerdown', (e) => {
    if (e.button === 2) {
        mouseLook = true;
    }
});

document.addEventListener('pointerup', (e) => {
    if (e.button === 2) {
        mouseLook = false;
    }
});

document.addEventListener('pointermove', (e) => {

    pointerX = e.pageX - viewHalfX;
    pointerY = e.pageY - viewHalfY;

});


setTimeout(() => {
    for (let mx = 0; mx < space.width; mx++) {
        for (let mz = 0; mz < space.depth; mz++) {
            let my = 0;

            if (space.get(mx, my, mz) != 'air' && space.get(mx, my, mz) != undefined) {
                ctx.drawImage(
                    blocks.materials[space.get(mx, my, mz)][2].map.image,
                    0,
                    0,
                    64,
                    64,
                    mx * 16,
                    mz * 16,
                    16,
                    16
                );
                my++;
            }

            if (space.get(mx, my, mz) != 'air' && space.get(mx, my, mz) != undefined) {
                ctx.drawImage(
                    blocks.materials[space.get(mx, my, mz)][2].map.image,
                    0,
                    0,
                    64,
                    64,
                    mx * 16,
                    mz * 16,
                    16,
                    16
                );
                my++;
            }

            if (space.get(mx, my, mz) != 'air' && space.get(mx, my, mz) != undefined) {
                ctx.drawImage(
                    blocks.materials[space.get(mx, my, mz)][2].map.image,
                    0,
                    0,
                    64,
                    64,
                    mx * 16,
                    mz * 16,
                    16,
                    16
                );
                my++;
            }

            if (space.get(mx, my, mz) != 'air' && space.get(mx, my, mz) != undefined) {
                ctx.drawImage(
                    blocks.materials[space.get(mx, my, mz)][2].map.image,
                    0,
                    0,
                    64,
                    64,
                    mx * 16,
                    mz * 16,
                    16,
                    16
                );
                my++;
            }
        }
    }


}, 500);

console.log(scene);