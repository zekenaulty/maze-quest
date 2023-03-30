import { BasicRoom } from './basicRoom.js';

export class Library extends BasicRoom {

    booksNorth() {
        let vm = this;

        let x = vm.bounds.x + 1;
        let y = vm.bounds.y + 2;
        let z = vm.bounds.z + 1;
        let h = vm.bounds.height - 4;
        let w = vm.bounds.width;

        vm.rect.x_to_x(x, y, z, w, h, vm.booksBlock);
        if (vm.bounds.northDoor) {
            let dfx = Math.floor(vm.bounds.centerX - 2);
            let dwx = dfx + 1;
            vm.rect.x_to_x(dfx, y - 1, z, 5, 4, vm.doorFrameBlock);
            vm.rect.x_to_x(dwx, y - 1, z, 3, 3, 'air');
        }
    }

    booksWest() {
        let vm = this;

        let x = vm.bounds.x + 1;
        let y = vm.bounds.y + 2;
        let z = vm.bounds.z + 1;
        let h = vm.bounds.height - 4;
        let d = vm.bounds.depth;

        vm.rect.z_to_z(x, y, z, d, h, vm.booksBlock);
        if (vm.bounds.westDoor) {
            let dfz = Math.floor(vm.bounds.centerZ - 2);
            let dwz = dfz + 1;
            vm.rect.z_to_z(x, y - 1, dfz, 5, 4, vm.doorFrameBlock);
            vm.rect.z_to_z(x, y - 1, dwz, 3, 3, 'air');
        }
    }


    booksSouth() {
        let vm = this;

        let x = vm.bounds.x;
        let y = vm.bounds.y + 2;
        let z = vm.bounds.z + vm.bounds.depth - 2;
        let h = vm.bounds.height - 4;
        let w = vm.bounds.width;

        vm.rect.x_to_x(x, y, z, w, h, vm.booksBlock);
        if (vm.bounds.southDoor) {
            let dfx = Math.floor(vm.bounds.centerX - 2);
            let dwx = dfx + 1;
            vm.rect.x_to_x(dfx, y - 1, z, 5, 4, vm.doorFrameBlock);
            vm.rect.x_to_x(dwx, y - 1, z, 3, 3, 'air');
        }
    }

    booksEast() {
        let vm = this;

        let x = vm.bounds.x + vm.bounds.width - 2;
        let y = vm.bounds.y + 2;
        let z = vm.bounds.z;
        let h = vm.bounds.height - 4;
        let d = vm.bounds.depth;

        vm.rect.z_to_z(x, y, z, d, h, vm.booksBlock);
        if (vm.bounds.eastDoor) {
            let dfz = Math.floor(vm.bounds.centerZ - 2);
            let dwz = dfz + 1;
            vm.rect.z_to_z(x, y - 1, dfz, 5, 4, vm.doorFrameBlock);
            vm.rect.z_to_z(x, y - 1, dwz, 3, 3, 'air');
        }
    }



    bookPillarNE() {
        let vm = this;
        let x = vm.bounds.x + 10;
        let z = vm.bounds.z + 5;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.raftersBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.booksBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.raftersBlock
        );
    }

    bookPillarNW() {
        let vm = this;
        let x = vm.bounds.x + 5;
        let z = vm.bounds.z + 5;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.raftersBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.booksBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.raftersBlock
        );
    }

    bookWallN() {
        let vm = this;
        let x = vm.bounds.x + 5;
        let z = vm.bounds.z + 5;
        let w = vm.bounds.width - 11
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            w,
            1,
            vm.raftersBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                w,
                1,
                vm.booksBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            w,
            1,
            vm.raftersBlock
        );
    }

    bookPillarSE() {
        let vm = this;
        let x = vm.bounds.x + 10;
        let z = vm.bounds.z + 10;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.raftersBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.booksBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.raftersBlock
        );
    }

    bookPillarSW() {
        let vm = this;
        let x = vm.bounds.x + 5;
        let z = vm.bounds.z + 10;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.raftersBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.booksBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.raftersBlock
        );
    }

    bookWallS() {
        let vm = this;
        let x = vm.bounds.x + 5;
        let z = vm.bounds.z + 10;
        let w = vm.bounds.width - 11
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            w,
            1,
            vm.raftersBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                w,
                1,
                vm.booksBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            w,
            1,
            vm.raftersBlock
        );
    }

    generate = () => {
        let vm = this;

        /* floor */
        vm.floor();
        vm.floorTrim();

        /* walls */
        vm.wallNorth();
        vm.wallEast();
        vm.wallSouth();
        vm.wallWest();

        /* trim */
        vm.trim();
        vm.roofTrim();
        vm.roofCross();

        /* extras */
        vm.booksNorth();
        vm.booksWest();
        vm.booksSouth();
        vm.booksEast();

        if (vm.bounds.northDoor) {
            vm.bookPillarNW();
            vm.bookPillarNE();
        } else {
            vm.bookWallN();
        }

        if (vm.bounds.southDoor) {
            vm.bookPillarSW();
            vm.bookPillarSE();
        } else {
            vm.bookWallS();
        }

        vm.roof();
    };

}