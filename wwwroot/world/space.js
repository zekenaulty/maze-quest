import * as THREE from 'three';

export class Space extends EventTarget {

    #data;

    #width;
    #height;
    #depth;

    #x;
    #y;
    #z;

    #positions = {};
    #rotations = {};

    #dummy = new THREE.Object3D();
    #lastPosition = new THREE.Vector3(0, 0, 0);
    #zero = new THREE.Vector3(0, 0, 0);
    #renderBoundery = 8;

    constructor(
        w = 17,
        h = 128,
        d = 17,
        x = 0,
        y = 0,
        z = 0
    ) {
        super();

        const vm = this;

        vm.#width = w;
        vm.#height = h;
        vm.#depth = z;
        vm.#x = x;
        vm.#y = y;
        vm.z = z;

        vm.#data = new Array(w);
        for (const ix = 0; ix < w; ix++) {
            vm.#data[ix] = new Array(h);
            for (const iy = 0; iy < h; iy++) {
                vm.#data[ix][iy] = new Array(d);
                for (const iz = 0; iz < d; iz++) {
                    vm.#data[ix][iy][iz] = 'air';
                }
            }
        }
    }

    get blocks() {
        const vm = this;
        return Object.keys(vm.#positions);
    }

    get positions() {
        const vm = this;
        return vm.#positions;
    }

    get rotations() {
        const vm = this;
        return vm.#rotations;
    }

    get(x, y, z) {
        const vm = this;
        if (x < vm.#data.length &&
            y < vm.#data[x].length &&
            z < vm.#data[x][y].length
        ) {
            return vm.#data[x][y][z];
        }
        return undefined;
    }

    clean(x, y, z, v) {
        const vm = this;
        let p = vm.#data[x][y][z];
        if (p != 'air' && p != v) {
            let pi = vm.#positions[p] ? vm.#positions[p].findIndex(n => n.x == x && n.y == y && n.z == z) : -1;
            if (pi > -1) {
                vm.#positions[p].splice(pi, 1);
                if (vm.#positions[p].length == 0) {
                    delete vm.#positions[p];
                }
            }
        }
        return p;
    }

    set(
        x,
        y,
        z,
        v = 'air',
        rx = 0,
        ry = 0,
        rz = 0
    ) {
        const vm = this;
        if (x < vm.#data.length &&
            y < vm.#data[x].length &&
            z < vm.#data[x][y].length
        ) {
            if (v != 'air' && !vm.#positions[v]) {
                vm.#positions[v] = [];
            }
            let p = vm.clean(x, y, z, v);
            if (p != v) {
                vm.#data[x][y][z] = v;
                if (v != 'air') {
                    vm.#positions[v].push(new THREE.Vector3(x, y, z));
                    vm.#rotations[`${x}_${y}_${z}`] = new THREE.Vector3(rx, ry, rz);
                }
            }
        }
    }

    getRotation(x, y, z) {
        const vm = this;
        let r = vm.#rotations[`${x}_${y}_${z}`];
        if (!r) {
            r = new THREE.Vector3(0, 0, 0);
        }
        return r;
    }

    isSolid(x, y, z) {
        const vm = this;
        const block = vm.get(x, y, z);

        return block !== undefined && block !== 'air'; //will need to use an array and includes eventually
    }

    /*
      copyTo(space, dx = 0, dy = 0, dz = 0) {
        const vm = this;
        for (let x = 0; x < vm.#width; x++) {
          for (let y = 0; x < vm.#height; y++) {
            for (let z = 0; x < vm.#depth; z++) {
              space.set(x + dx, y + dy, z + dz, vm.#data[x][y][z]);
            }
          }
        }
      }
    */

    chunked(v, meshes, scene) {
        const vm = this;

        if (!vm.#lastPosition.equals(vm.#zero) && v.distanceTo(vm.#lastPosition) < vm.#renderBoundery) {
            return;
        }

        let x = Math.floor(v.x - 32);
        let y = Math.floor(v.y - 32);
        let z = Math.floor(v.z - 32);

        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        z = z < 0 ? 0 : z;

        /*
            would like to get this constrained to a fixed radius of 32, 
            but it is twitchy when the positive x,z distance is less than 64 
        */
        const lx = x + 64;
        const ly = d;
        const lz = z + 64;

        let pos = {};
        for (const xi = x; xi < lx; xi++) {
            for (const yi = y; yi < ly; yi++) {
                for (const zi = z; zi < lz; zi++) {
                    const b = vm.get(xi, yi, zi);
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
            for (const i = 0; i < count; i++) {
                const v = pos[b][i];
                const r = vm.getRotation(v.x, v.y, v.z);
                vm.#dummy.position.set(v.x, v.y, v.z);
                vm.#dummy.rotation.set(r.x, r.y, r.z);
                vm.#dummy.updateMatrix();
                mesh.setMatrixAt(i, vm.#dummy.matrix);
            }
            meshes[b] = mesh;
            scene.add(mesh);
        }
        vm.#lastPosition = v.clone();
    }

}
