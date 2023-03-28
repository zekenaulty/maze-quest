import { Line } from './line.js';

export class Rectangle {
  #space;
  #line;

  constructor(space) {
    let vm = this;
    vm.#space = space;
    vm.#line = new Line(space);
  }

  flat(x, y, z, w, d, block = 'stone_bticks_alt') {
    let vm = this;
    let space = vm.#space;
    let nw = x + w;
    let nd = z + d;
    for (let nx = x; nx < nw; nx++) {
      for (let nz = z; nz < nd; nz++) {
        space.set(nx, y, nz, block);
      }
    }
  }

  flatHallow(x, y, z, w, d, block) {
    let vm = this;
    vm.#line.plot(x, y, z, x + w, y, z, block);
    vm.#line.plot(x + w, y, z, x + w, y, z + d, block);
    vm.#line.plot(x + w, y, z + d, x, y, z + d, block);
    vm.#line.plot(x, y, z + d, x, y, z, block);
  }


  x_to_x(x, y, z, w, h, block = 'stone_bticks_alt') {
    let vm = this;
    let space = vm.#space;
    let nw = x + w;
    let nh = y + h;
    for (let nx = x; nx < nw; nx++) {
      for (let ny = y; ny < nh; ny++) {
        space.set(nx, ny, z, block);
      }
    }
  }

  z_to_z(x, y, z, d, h, block = 'stone_bticks_alt') {
    let vm = this;
    let space = vm.#space;
    let nd = z + d;
    let nh = y + h;
    for (let nz = z; nz < nd; nz++) {
      for (let ny = y; ny < nh; ny++) {
        space.set(x, ny, nz, block);
      }
    }
  }



}
