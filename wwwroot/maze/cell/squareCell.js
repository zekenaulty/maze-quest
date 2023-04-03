
import '../../core/array.js';
import { Cell } from './cell.js';

export class SquareCell extends Cell {
    north;
    east;
    south;
    west;

    constructor(row, column) {
        super(row, column);
    }

    directionOf(cell) {
        const vm = this;
        if (vm.north && vm.north.key === cell.key) {
            return 'north';
        }

        if (vm.east && vm.east.key === cell.key) {
            return 'east';
        }

        if (vm.south && vm.south.key === cell.key) {
            return 'south';
        }

        if (vm.west && vm.west.key === cell.key) {
            return 'west';
        }
    }

}
