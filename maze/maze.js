import '../core/array.js';
import { SquareCell } from './cell/squareCell.js';

export class Maze {

  grid = new Array();
  cells = new Array();
  visited = new Array();

  rows = 0;
  columns = 0;
  start;
  end;
  active;
  distances;
  solution;
  
  saveState() {
    let vm = this;
    let r = {
      rows: vm.rows,
      columns: vm.columns,
      start: vm.start.gridPosition,
      end: vm.end.gridPosition,
      active: vm.active.gridPosition,
      cells: new Array(),
      visited: new Array()
    };
    
    vm.eachCell((c) => {
      r.cells.push(c.saveState());
    });
    
    vm.visited.forEach((c) => {
      r.visited.push(c.gridPosition);
    });
    
    return r;
  }
  
  loadState(state) {
    let vm = this;
    vm.resize(state.rows, state.columns);
    vm.initialize();
    
    state.cells.forEach((c) => {
      vm.cell(c.row, c.column).loadState(vm, c);
    });
    
    state.visited.forEach((c) => {
      vm.visited.push(vm.cell(c.row, c.column));
    });
    
    vm.start = vm.cell(state.start.row, state.start.column);
    vm.end = vm.cell(state.end.row, state.end.column);
    vm.active = vm.cell(state.active.row, state.active.column);
    vm.distances = vm.start.distances();
    vm.solve();
  }

  constructor(rows, columns) {
    let vm = this;
    vm.resize(rows, columns);
  }

  resize(rows, columns) {
    let vm = this;
    vm.rows = rows;
    vm.columns = columns;
  }

  initialize() {
    let vm = this;

    vm.grid = new Array();
    vm.cells = new Array();
    vm.visited = new Array();

    vm.start = undefined;
    vm.end = undefined;
    vm.active = undefined;
    vm.distances = undefined;
    vm.solution = undefined;

    let cells = vm.populate();
    vm.grid = cells.grid;
    vm.cells = cells.all;

    vm.configureCells();
  }

  populate() {
    let vm = this;
    let all = new Array();
    let grid = new Array();

    vm.walkGrid((r, c) => {
      if (grid.length - 1 < r) {
        grid.push(new Array());
      }
      let n = new SquareCell(r, c);
      grid[r].push(n);
      all.push(n);
    });

    return {
      grid: grid,
      all: all
    };
  }

  configureCells() {
    let vm = this;
    vm.eachCell((cell) => {
      cell.north = vm.cell(cell.row - 1, cell.column);
      cell.east = vm.cell(cell.row, cell.column + 1);
      cell.south = vm.cell(cell.row + 1, cell.column);
      cell.west = vm.cell(cell.row, cell.column - 1);

      if (cell.north) { cell.neighbors.items.push(cell.north); }
      if (cell.east) { cell.neighbors.items.push(cell.east); }
      if (cell.south) { cell.neighbors.items.push(cell.south); }
      if (cell.west) { cell.neighbors.items.push(cell.west); }
    });
  }

  cell(row, column) {
    let vm = this;
    if (row < 0 || column < 0 || row >= vm.rows || column >= vm.columns) {
      return undefined;
    }

    return vm.grid[row][column];
  }

  eachRow(action) {
    let vm = this;
    for (let r = 0; r < vm.rows; r++) {
      action(vm.grid[r]);
    }
  }

  eachCell(action) {
    let vm = this;
    for (let i = 0; i < vm.cells.length; i++) {
      action(vm.cells[i]);
    }
  }

  walkGrid(action) {
    let vm = this;
    for (let r = 0; r < vm.rows; r++) {
      for (let c = 0; c < vm.columns; c++) {
        action(r, c);
      }
    }
  }

  randomCell() {
    let vm = this;
    return vm.grid.sample().sample();
  }

  get size() {
    let vm = this;
    return vm.rows * vm.columns;
  }

  setup() {
    let vm = this;
    vm.braid();
    vm.start = vm.deadends.sample();
    if (!vm.start) {
      vm.start = vm.cell(0, 0);
    };
    vm.distances = vm.start.distances();
    let d = vm.distances.max();
    vm.start = d.cell;
    vm.distances = vm.start.distances();
    d = vm.distances.max();
    vm.end = d.cell;
    vm.active = vm.start;
    vm.visited.push(vm.start);
  }

  findDeadends() {
    let vm = this;
    let r = new Array();
    vm.eachCell((c) => {
      if (c.links.items.length === 1) {
        r.push(c);
      }
    });
    return r;
  }

  solve() {
    let vm = this;
    vm.solution = vm.distances.pathTo(vm.end);
  }

  move(direction) {
    let vm = this;
    let d = direction.toLowerCase();
    let c = vm.active;

    if (!c) {
      return false;
    }

    if (!c.links.linked(c[d])) {
      return false;
    }

    vm.active = c[d];
    vm.raiseEvent('moved', d, c, vm.active, vm);
    if (vm.active === vm.end) {
      //solved
    }

    return true;
  }

  braid(p = 0.3) {
    let vm = this;
    vm.deadends = vm.findDeadends();
    for (let i = 0; i < vm.deadends.length; i++) {
      let cell = vm.deadends[i];
      let r = Math.random();
      if (cell.links.items.length === 1 && r < p) {
        let neighbor = cell.neighbors.deadends().sample();
        if (!neighbor) {
          neighbor = cell.neighbors.notLinkedTo().sample();

        }
        cell.links.connect(neighbor, true, true);
      }
    }
    vm.deadends = vm.findDeadends();
  }

  clearWalls() {
    let vm = this;
    vm.eachCell((c) => {
      c.neighbors.items.forEach((n) => {
        c.links.connect(n, true, false);
      });
    });
  }
}
