import '../../core/array.js';

export class Neighbors {

    items = new Array();
    cell;

    saveState() {
        const vm = this;
        let r = {
            row: vm.cell.row,
            column: vm.cell.column,
            items: new Array()
        };

        for (let i = 0; i < vm.items.length; i++) {
            r.items.push({
                row: vm.items[i].row,
                column: vm.items[i].column
            });
        }

        return r;
    }

    loadState(maze, state) {
        const vm = this;
        vm.cell = maze.cell(state.row, state.column);
        for (let i = 0; i < state.items.length; i++) {
            vm.items.push(maze.cell(
                state.items[i].row,
                state.items[i].column
            ));
        }
    }

    constructor(cell) {
        const vm = this;

        vm.cell = cell;
    }

    empty() {
        const vm = this;
        return vm.items.length === 0;
    }

    any() {
        const vm = this;
        return vm.items.length > 0;
    }

    unlinked() {
        const vm = this;
        let result = new Array();
        for (let i = 0; i < vm.items.length; i++) {
            if (vm.items[i].links.empty()) {
                result.push(vm.items[i]);
            }
        }
        return result;
    }

    linked() {
        const vm = this;
        let result = new Array();
        for (let i = 0; i < vm.items.length; i++) {
            if (vm.items[i].links.any()) {
                result.push(vm.items[i]);
            }
        }
        return result;
    }

    linkedTo(cell) {
        const vm = this;
        if (!cell) {
            cell = vm.cell;
        }

        let result = new Array();
        for (let i = 0; i < vm.items.length; i++) {
            if (vm.items[i].links.items.includes(cell)) {
                result.push(vm.items[i]);
            }
        }
        return result;
    }

    notLinkedTo(cell) {
        const vm = this;
        if (!cell) {
            cell = vm.cell;
        }

        let result = new Array();
        for (let i = 0; i < vm.items.length; i++) {
            if (!vm.items[i].links.items.includes(cell)) {
                result.push(vm.items[i]);
            }
        }
        return result;
    }

    deadends() {
        const vm = this;
        let result = new Array();
        for (let i = 0; i < vm.items.length; i++) {
            if (vm.items[i].links.items.length === 1) {
                result.push(vm.items[i]);
            }
        }
        return result;
    }
}
