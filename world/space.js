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

  constructor(
    w = 17,
    h = 128,
    d = 17,
    x = 0,
    y = 0,
    z = 0
  ) {
    super();

    let vm = this;

    vm.#width = w;
    vm.#height = h;
    vm.#depth = z;
    vm.#x = x;
    vm.#y = y;
    vm.z = z;

    vm.#data = new Array(w);
    for (let ix = 0; ix < w; ix++) {
      vm.#data[ix] = new Array(h);
      for (let iy = 0; iy < h; iy++) {
        vm.#data[ix][iy] = new Array(d);
        for (let iz = 0; iz < d; iz++) {
          vm.#data[ix][iy][iz] = 'air';
        }
      }
    }
  }

  get blocks() {
    let vm = this;
    return Object.keys(vm.#positions);
  }

  get positions() {
    let vm = this;
    return vm.#positions;
  }

  get rotations() {
    let vm = this;
    return vm.#rotations;
  }

  get(x, y, z) {
    let vm = this;
    if (x < vm.#data.length &&
      y < vm.#data[x].length &&
      z < vm.#data[x][y].length
    ) {
      return vm.#data[x][y][z];
    }
    return undefined;
  }

  clean(x, y, z, v) {
    let vm = this;
    let p = vm.#data[x][y][z];
    if (p != 'air' && p != v) {
      let pi = vm.#positions[p] ? vm.#positions[p].findIndex(n => n.x == x && n.y == y && n.z == z) : -1;
      if (pi > -1) {
        vm.#positions[p].splice(pi, 1);
        vm.#rotations[p].splice(pi, 1);
        if (vm.#positions[p].length == 0) {
          delete vm.#positions[p];
          delete vm.#rotations[p];
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
    let vm = this;
    if (x < vm.#data.length &&
      y < vm.#data[x].length &&
      z < vm.#data[x][y].length
    ) {
      if (v != 'air' && !vm.#positions[v]) {
        vm.#positions[v] = [];
        vm.#rotations[v] = [];
      }
      let p = vm.clean(x, y, z, v);
      if (p != v) {
        vm.#data[x][y][z] = v;
        if (v != 'air') {
          vm.#positions[v].push(new THREE.Vector3(x, y, z));
          vm.#rotations[v].push(new THREE.Vector3(rx, ry, rz));
        }
      }
    }
  }

  /*
    copyTo(space, dx = 0, dy = 0, dz = 0) {
      let vm = this;
      for (let x = 0; x < vm.#width; x++) {
        for (let y = 0; x < vm.#height; y++) {
          for (let z = 0; x < vm.#depth; z++) {
            space.set(x + dx, y + dy, z + dz, vm.#data[x][y][z]);
          }
        }
      }
    }
  */
}
