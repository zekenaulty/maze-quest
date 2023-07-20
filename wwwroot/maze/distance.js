
import '../core/array.js';

export class Distance {
  root;
  distances = {};
  items = new Array();

  constructor(start) {
    const vm = this;

    vm.root = start;
    vm.distances[vm.root.key] = 0;
    vm.items.push(vm.root)

  }

  collect(cell, distance) {
    const vm = this;
    vm.distances[cell.key] = distance;
    vm.items.push(cell);
  }

  distance(cell) {
    const vm = this;
    return vm.distances[cell.key];
  }

  pathTo(cell) {
    const vm = this;
    let current = cell;
    let breadcrumbs = new Distance(vm.root);
    while (current !== vm.root) {
      for (let i = 0; i < current.links.items.length; i++) {
        let neighbor = current.links.items[i];
        if (vm.distance(neighbor) < vm.distance(current)) {
          breadcrumbs.collect(neighbor, vm.distance(neighbor));
          current = neighbor;
          break;
        }
      }
    }
    return breadcrumbs;
  }

  max() {
    const vm = this;
    let maxDistance = 0;
    let maxCell = vm.root;
    for (let i = 0; i < vm.items.length; i++) {
      let c = vm.items[i];
      let d = vm.distance(c);
      if (d > maxDistance) {
        maxCell = c;
        maxDistance = d;
      }
    }

    return {
      cell: maxCell,
      distance: maxDistance
    };
  }
}
