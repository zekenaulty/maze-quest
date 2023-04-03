import * as THREE from 'three';

export class Controls extends EventTarget {

    #space;
    #camera;
    #scene;
    #player;

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

    constructor(camera, scene, space, player, document) {
        const vm = this;

        vm.#camera = camera;
        vm.#scene = scene;
        vm.#space = space;
        vm.#player = player;

        viewHalfX = document.innerWidth / 2;
        viewHalfY = document.innerHeight / 2;

        vm.#ray = new THREE.Raycaster(player.position, new THREE.Vector3(), 0.2, 1.2);
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
}