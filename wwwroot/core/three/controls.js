import * as THREE from 'three';
import { Capsule } from 'three/addons/math/Capsule.js';
import '../core/array.js';
import '../core/isMobile.js';

export class Controls extends EventTarget {

    #space;
    #camera;
    #scene;
    #player;
    #collider;

    speed = 25;
    lookSpeed = 2.5;
    keySpeed = 1.3;

    #lon = 0;
    #lat = 0;

    pointerX = 0;
    pointerY = 0;

    viewHalfX;
    viewHalfY;

    verticalMin = 1.1;
    verticalMax = 2.1;
    mouseLook = false;

    #move = {
        forward: false,
        backward: false,
        left: false,
        right: false
    };

    #look = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    #ray;

    constructor(
        camera,
        scene,
        space,
        player,
        startX,
        startZ,
        document
    ) {
        const vm = this;

        vm.#camera = camera;
        vm.#scene = scene;
        vm.#space = space;
        vm.#player = player;

        viewHalfX = document.innerWidth / 2;
        viewHalfY = document.innerHeight / 2;

        vm.#ray = new THREE.Raycaster(player.position, new THREE.Vector3(), 0.2, 1.2);

        vm.#collider = new Capsule(
            new THREE.Vector3(startX, 1, startZ),
            new THREE.Vector3(startX, 2.25, startZ),
            0.35
        );

        player.position.copy(vm.#collider.start);
        camera.position.copy(vm.#collider.end);
        vm.update();
        vm.bind(document);
    }

    get space() {
        const vm = this;
        return vm.#space;
    }

    get camera() {
        const vm = this;
        return vm.#camera;
    }

    get scene() {
        const vm = this;
        return vm.#scene;
    }

    get player() {
        const vm = this;
        return vm.#player;
    }

    get move() {
        const vm = this;
        return vm.#move;
    }

    get look() {
        const vm = this;
        return vm.#look;
    }

    rotationY(rad) {
        const matrix = new THREE.Matrix4();
        matrix.makeRotationY(rad);
        return matrix;
    }

    get forward() {
        const vm = this;
        const v = new THREE.Vector3();
        vm.camera.getWorldDirection(v);
        v.y = 0;
        v.normalize();
        return v;
    }

    get side() {
        const vm = this;
        const v = new THREE.Vector3();
        vm.camera.getWorldDirection(v);
        v.y = 0;
        v.normalize();
        v.cross(camera.up);
        return v;
    }

    get backward() {
        const vm = this;
        const v = vm.forward;
        v.applyMatrix4(vm.rotation(3.14));
        return v;
    }

    get left() {
        const vm = this;
        const v = vm.forward;
        v.applyMatrix4(vm.rotation(1.57));
        return v;
    }

    get right() {
        const vm = this;
        const v = vm.forward;
        v.applyMatrix4(vm.rotation(4.71));
        return v;
    }

    blockedRay(v) {
        const vm = this;
        vm.#ray.set(vm.player.postion, v);
        return vm.#ray.intersectObjects(vm.scene.children, true).any();
    }

    blockedSpace(v) {
        const vm = this;
        const x = Math.floor(vm.player.position.x + v.x);
        const z = Math.floor(vm.player.position.z + v.z);

        return !vm.space.isSolid(x, vm.player.position.y, z) && !vm.space.isSolid(x, vm.player.position.y + 1, z) && !vm.space.isSolid(x, vm.player.position.y + 2, z)
    }

    cameraLook(deltaTime) {
        const vm = this;
        const actualLookSpeed = deltaTime * vm.lookSpeed;
        const verticalLookRatio = Math.PI / (vm.verticalMax - vm.verticalMin);

        vm.#lon -= vm.pointerX * actualLookSpeed;
        vm.#lat -= vm.pointerY * actualLookSpeed * verticalLookRatio;
        vm.#lat = Math.max(- 85, Math.min(85, vm.#lat));

        let phi = THREE.MathUtils.degToRad(90 - vm.#lat);
        const theta = THREE.MathUtils.degToRad(vm.#lon);
        phi = THREE.MathUtils.mapLinear(phi, 0, Math.PI, vm.verticalMin, vm.verticalMax);

        const position = vm.camera.position;
        const targetPosition = new THREE.Vector3();
        targetPosition.setFromSphericalCoords(1, phi, theta).add(position);
        vm.camera.lookAt(targetPosition);
    }

    update() {
        const vm = this;
        const damping = Math.exp(-4 * deltaTime) - 1;
        let moveX = false;
        let moveZ = false;
        let x = 0;
        let z = 0;
        let cx = 0;
        let cy = 0;

        if (vm.#move.forward) {
            moveZ = !vm.#blockedSpace(vm.forward);
            z = -vm.#keySpeed;
        } else if (vm.#move.backward) {
            moveZ = !vm.#blockedSpace(vm.backward);
            z = vm.#keySpeed;
        }

        if (vm.#move.left) {
            moveX = !vm.#blockedSpace(vm.left);
            x = -vm.#keySpeed;
        } else if (vm.#move.right) {
            moveX = !vm.#blockedSpace(vm.right);
            x = vm.#keySpeed;
        }


        if (moveZ) {
            playerVelocity.add(vm.forward.multiplyScalar(-z * vm.#speed));
        }

        if (moveX) {
            playerVelocity.add(vm.side.multiplyScalar(x * vm.#speed));
        }

        playerVelocity.addScaledVector(playerVelocity, damping);
        const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
        vm.#collider.translate(deltaPosition);
        vm.camera.position.copy(vm.#collider.end);
        vm.player.position.copy(vm.#collider.start);

        if (vm.mouseLook) {
            vm.cameraLook();
        } else {
            if (vm.#look.up) {
                cy = -vm.#keySpeed / 3;
            } else if (look.down) {
                cy = vm.#keySpeed / 3;
            } else if (vm.#look.left) {
                cx = -vm.#keySpeed / 1.2;
            } else if (vm.#look.right) {
                cx = vm.#keySpeed / 1.2;
            }

            if (!vm.#look.up && !vm.#look.down) {
                cy = 0;
            }
            if (!vm.#look.left && !vm.#look.right) {
                cx = 0;
            }

            if (cx != 0) {
                vm.camera.rotation.y += -cx / 32;
            }

            if (cy != 0) {

                vm.camera.rotation.x += -cy / 32;
                if (vm.camera.rotation.x > 0.5) {
                    vm.camera.rotation.x = 0.5;
                }
                if (vm.camera.rotation.x < -0.5) {
                    vm.camera.rotation.x = -0.5;
                }
            }
        }
    }

    bind(document) {
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
                    look.left = true;
                    break;
                case 'ArrowRight':
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
                    look.left = false;
                    break;
                case 'ArrowRight':
                    look.right = false;
                    break;
            }
        });

        document.addEventListener('pointerdown', (e) => {
            if (e.button === 2) {
                vm.mouseLook = true;
            }
        });

        document.addEventListener('pointerup', (e) => {
            if (e.button === 2) {
                vm.mouseLook = false;
            }
        });

        document.addEventListener('pointermove', (e) => {
            vm.pointerX = e.pageX - vm.viewHalfX;
            vm.pointerY = e.pageY - vm.viewHalfY;
        });
    }

}
