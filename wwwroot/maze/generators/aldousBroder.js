import '../../core/array.js';
import { Generator } from './generator.js';

export class AldousBroder extends Generator {

  generate() {
    const vm = this;
    vm.maze.initialize();
    
    let cell = vm.maze.randomCell();
    let unvisited = vm.maze.cells.length - 1;
    
    while(unvisited > 0) {
      let neighbor = cell.neighbors.items.sample();
      if(neighbor.links.empty()) {
        cell.links.connect(neighbor, true, true);
        unvisited--;
      }
      cell = neighbor;
    }
    
    vm.maze.setup();
    

  }

}
