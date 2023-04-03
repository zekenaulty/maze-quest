import '../../core/array.js';
import { Generator } from './generator.js';

export class BinaryTree extends Generator {

  generate() {
    const vm = this;
    vm.maze.initialize();
    
    vm.maze.walkGrid((r, c) => {
      let cell = vm.maze.cell(r, c);
      let choice = new Array();

      let north = vm.maze.cell(cell.row - 1, cell.column);
      if (north) {
        choice.push(north);
      }

      let east = vm.maze.cell(cell.row, cell.column + 1)
      if (east) {
        choice.push(east);
      }

      if (choice.length > 0) {
        cell.links.connect(
          choice.sample(),
          true,
          true);
      }
    });
    
    vm.maze.setup();
    

  }

}
