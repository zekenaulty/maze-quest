
import '../../core/array.js';
import { Generator } from './generator.js';

export class SimplePrims extends Generator {

  generate() {
    const vm = this;
    vm.maze.initialize();
    
    let startAt = vm.maze.randomCell();
    let active = new Array();
    active.push(startAt);
    
    while(active.any()) {
      let cell = active.sample();
      let availableNeighbors = cell.neighbors.unlinked();
      if(availableNeighbors.any()) {
        let neighbor = availableNeighbors.sample();
        cell.links.connect(neighbor, true, true);
        active.push(neighbor);
      } else {
        active.delete(cell);
      }
    }
    
    vm.maze.setup();
    

  }

}

