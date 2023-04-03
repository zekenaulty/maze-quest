import { BasicRoom } from './basicRoom.js';

export class Passage extends BasicRoom {

    hallNS() {
        const vm = this;

        let x = vm.bounds.x + 6;
        let y = vm.bounds.y + 1;
        let z = vm.bounds.z + 1;
        let h = 4;
        let d = vm.bounds.depth - 2;

        vm.rect.z_to_z(x, y, z, d, h, vm.wallBlock);
        if (vm.bounds.westDoor) {
            let dfz = Math.floor(vm.bounds.centerZ - 2);
            let dwz = dfz + 1;
            vm.rect.z_to_z(x, y, dwz, 3, 3, 'air');
        }

        x += 4;
        vm.rect.z_to_z(x, y, z, d, h, vm.wallBlock);
        if (vm.bounds.eastDoor) {
            let dfz = Math.floor(vm.bounds.centerZ - 2);
            let dwz = dfz + 1;
            vm.rect.z_to_z(x, y, dwz, 3, 3, 'air');
        }
    }

    hallEW() {

        const vm = this;

        let x = vm.bounds.x + 1;
        let y = vm.bounds.y + 1;
        let z = vm.bounds.z + 6;
        let h = 4;
        let w = vm.bounds.width - 2;

        vm.rect.x_to_x(x, y, z, w, h, vm.wallBlock);
        if (vm.bounds.northDoor) {
            let dfx = Math.floor(vm.bounds.centerX - 2);
            let dwx = dfx + 1;
            vm.rect.x_to_x(dwx, y, z, 3, 3, 'air');
        }

        z += 4;
        vm.rect.x_to_x(x, y, z, w, h, vm.wallBlock);
        if (vm.bounds.southDoor) {
            let dfx = Math.floor(vm.bounds.centerX - 2);
            let dwx = dfx + 1;
            vm.rect.x_to_x(dwx, y, z, 3, 3, 'air');
        }
    }

    generate = () => {
        const vm = this;

        vm.floor();
        vm.roof();

        /* walls - this keeps things looking right, could be fixed cheaper */
        vm.wallNorth();
        vm.wallEast();
        vm.wallSouth();
        vm.wallWest();
        

        vm.rect.flat(
            vm.bounds.x + 1,
            4,
            vm.bounds.z + 1,
            vm.bounds.width - 2,
            vm.bounds.depth - 2,
            vm.wallBlock
        );

        vm.hallNS();
        vm.hallEW();



    };

}