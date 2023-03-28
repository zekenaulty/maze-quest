

export class View {
  #spaces;
  #width;
  #depth;
  #active;
  
  constructor(width, depth, active = 3) {
    let vm = this;
    vm.#width = width;
    vm.#height = height;
    vm.#active = active;
    vm.#spaces = new Array(width);
    for(let x = 0; x < width; x++) {
      vm.#spaces[x] = new Array(depth);
      for(let z = 0; z < depth; z++) {
        vm.#spaces[x][z] = new Space(17, 10, 17);
      }
    }
  }
  
  
}