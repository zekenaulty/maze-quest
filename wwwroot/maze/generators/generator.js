
export class Generator {

  maze;
  name = '';
  summary = ``;

  constructor(maze) {
    const vm = this;
    
    vm.maze = maze;
  }

  generate() {
    const vm = this;
  }

}


/*****   template   ***********************************

import '../../core/array.js';
import { Generator } from './generator.js';

export class Template extends Generator {

  generate() {
    vm.maze.initialize();
    
    
    
    vm.maze.setup();
    
    vm.raiseEvent('generated');

  }

}

****************/
