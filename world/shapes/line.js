export class Line {

  #space;

  constructor(space) {
    this.#space = space;
  }

  plot(x1, y1, z1, x2, y2, z2, block = 'stone_bricks_alt') {
    let space = this.#space;
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let dz = Math.abs(z2 - z1);
    let xs;
    let ys;
    let zs;
    if (x2 > x1) {
      xs = 1;
    } else {
      xs = -1;
    }

    if (y2 > y1) {
      ys = 1;
    } else {
      ys = -1;
    }

    if (z2 > z1) {
      zs = 1;
    } else {
      zs = -1;
    }

    // Driving axis is X-axis"
    if (dx >= dy && dx >= dz) {
      let p1 = 2 * dy - dx;
      let p2 = 2 * dz - dx;
      while (x1 != x2) {
        x1 += xs;

        if (p1 >= 0) {
          y1 += ys;
          p1 -= 2 * dx;
        }

        if (p2 >= 0) {
          z1 += zs;
          p2 -= 2 * dx;
        }

        p1 += 2 * dy;
        p2 += 2 * dz;

        space.set(x1, y1, z1, block);
      }

      // Driving axis is Y-axis"
    } else if (dy >= dx && dy >= dz) {
      let p1 = 2 * dx - dy;
      let p2 = 2 * dz - dy;

      while (y1 != y2) {
        y1 += ys;
        if (p1 >= 0) {
          x1 += xs;
          p1 -= 2 * dy;
        }

        if (p2 >= 0) {
          z1 += zs;
          p2 -= 2 * dy;
        }

        p1 += 2 * dx;
        p2 += 2 * dz;

        space.set(x1, y1, z1, block);
      }

      // Driving axis is Z-axis"
    } else {
      let p1 = 2 * dy - dz;
      let p2 = 2 * dx - dz;

      while (z1 != z2) {
        z1 += zs;
        if (p1 >= 0) {
          y1 += ys;
          p1 -= 2 * dz;
        }

        if (p2 >= 0) {
          x1 += xs;
          p2 -= 2 * dz;
        }

        p1 += 2 * dy;
        p2 += 2 * dx;

        space.set(x1, y1, z1, block);
      }
    }

  }

}
