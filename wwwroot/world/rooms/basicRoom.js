import * as THREE from 'three';
import { Line } from '../shapes/line.js';
import { Rectangle } from '../shapes/rectangle.js';
import '../../core/array.js';

export class BasicRoom {
    space;
    bounds;
    rect;
    line;

    booksBlock = 'bookshelf';

    floorBlock = 'cobblestone_alt';
    wallBlock = 'stone_bricks_alt';
    doorFrameBlock = 'chiseled_stone_bricks_alt';
    cornerPostBlock = 'oak_log';
    raftersBlock = 'oak_planks';
    roofBlock = 'oak_planks_alt';

    constructor(space, bounds) {
        const vm = this;
        vm.space = space;
        vm.bounds = bounds;
        vm.rect = new Rectangle(space);
        vm.line = new Line(space);
    }

    wallNorth() {
        const vm = this;

        let x = vm.bounds.x;
        let y = vm.bounds.y + 1;
        let z = vm.bounds.z;
        let h = vm.bounds.height - 2;
        let w = vm.bounds.width;

        vm.rect.x_to_x(x, y, z, w, h, vm.wallBlock);
        if (vm.bounds.northDoor) {
            let dfx = Math.floor(vm.bounds.centerX - 2);
            let dwx = dfx + 1;
            vm.rect.x_to_x(dfx, y, z, 5, 4, vm.doorFrameBlock);
            vm.rect.x_to_x(dwx, y, z, 3, 3, 'air');
        }
    }

    wallWest() {
        const vm = this;

        let x = vm.bounds.x;
        let y = vm.bounds.y + 1;
        let z = vm.bounds.z;
        let h = vm.bounds.height - 2;
        let d = vm.bounds.depth;

        vm.rect.z_to_z(x, y, z, d, h, vm.wallBlock);
        if (vm.bounds.westDoor) {
            let dfz = Math.floor(vm.bounds.centerZ - 2);
            let dwz = dfz + 1;
            vm.rect.z_to_z(x, y, dfz, 5, 4, vm.doorFrameBlock);
            vm.rect.z_to_z(x, y, dwz, 3, 3, 'air');
        }
    }


    wallSouth() {
        const vm = this;

        let x = vm.bounds.x;
        let y = vm.bounds.y + 1;
        let z = vm.bounds.z + vm.bounds.depth - 1;
        let h = vm.bounds.height - 2;
        let w = vm.bounds.width;

        vm.rect.x_to_x(x, y, z, w, h, vm.wallBlock);
        if (vm.bounds.southDoor) {
            let dfx = Math.floor(vm.bounds.centerX - 2);
            let dwx = dfx + 1;
            vm.rect.x_to_x(dfx, y, z, 5, 4, vm.doorFrameBlock);
            vm.rect.x_to_x(dwx, y, z, 3, 3, 'air');
        }
    }

    wallEast() {
        const vm = this;

        let x = vm.bounds.x + vm.bounds.width - 1;
        let y = vm.bounds.y + 1;
        let z = vm.bounds.z;
        let h = vm.bounds.height - 2;
        let d = vm.bounds.depth;

        vm.rect.z_to_z(x, y, z, d, h, vm.wallBlock);
        if (vm.bounds.eastDoor) {
            let dfz = Math.floor(vm.bounds.centerZ - 2);
            let dwz = dfz + 1;
            vm.rect.z_to_z(x, y, dfz, 5, 4, vm.doorFrameBlock);
            vm.rect.z_to_z(x, y, dwz, 3, 3, 'air');
        }
    }

    floorTrim() {
        const vm = this;
        vm.rect.flatHallow(
            vm.bounds.x + 1,
            1,
            vm.bounds.z + 1,
            vm.bounds.width - 3,
            vm.bounds.depth - 3,
            vm.raftersBlock
        );
    }

    floor() {
        const vm = this;
        vm.rect.flat(
            vm.bounds.x,
            vm.bounds.y,
            vm.bounds.z,
            vm.bounds.width,
            vm.bounds.depth,
            vm.floorBlock
        );
    }

    roof() {
        const vm = this;
        vm.rect.flat(
            vm.bounds.x,
            vm.bounds.height - 1,
            vm.bounds.z,
            vm.bounds.width,
            vm.bounds.depth,
            vm.roofBlock
        );
    }

    trim() {
        const vm = this;

        /* ne */
        vm.line.plot(
            vm.bounds.x + 1,
            vm.bounds.y,
            vm.bounds.z + 1,
            vm.bounds.x + 1,
            vm.bounds.y + vm.bounds.height - 2,
            vm.bounds.z + 1,
            vm.cornerPostBlock
        );

        /* nw */
        vm.line.plot(
            vm.bounds.x + vm.bounds.width - 2,
            vm.bounds.y,
            vm.bounds.z + 1,
            vm.bounds.x + vm.bounds.width - 2,
            vm.bounds.y + vm.bounds.height - 2,
            vm.bounds.z + 1,
            vm.cornerPostBlock
        );

        /* se */
        vm.line.plot(
            vm.bounds.x + 1,
            vm.bounds.y,
            vm.bounds.z + vm.bounds.depth - 2,
            vm.bounds.x + 1,
            vm.bounds.y + vm.bounds.height - 2,
            vm.bounds.z + vm.bounds.depth - 2,
            vm.cornerPostBlock
        );

        /* sw */
        vm.line.plot(
            vm.bounds.x + vm.bounds.width - 2,
            vm.bounds.y,
            vm.bounds.z + vm.bounds.depth - 2,
            vm.bounds.x + vm.bounds.width - 2,
            vm.bounds.y + vm.bounds.height - 2,
            vm.bounds.z + vm.bounds.depth - 2,
            vm.cornerPostBlock
        );


    }

    roofTrim(o = 0) {
        const vm = this;
        vm.rect.flatHallow(
            vm.bounds.x + 1 + o,
            vm.bounds.y + vm.bounds.height - 2,
            vm.bounds.z + 1 + o,
            vm.bounds.width - 3 - (o * 2),
            vm.bounds.depth - 3 - (o * 2),
            vm.raftersBlock
        );
    }

    roofCross() {
        const vm = this;
        let x = vm.bounds.x;
        let cx = Math.floor(vm.bounds.centerX);
        let y = vm.bounds.height - 2;
        let z = vm.bounds.z;
        let cz = Math.floor(vm.bounds.centerZ);
        let w = vm.bounds.width;
        let d = vm.bounds.depth;

        vm.line.plot(
            cx,
            y,
            z + 1,
            cx,
            y,
            z + d - 2,
            vm.raftersBlock
        );

        vm.line.plot(
            x + 1,
            y,
            cz,
            x + w - 2,
            y,
            cz,
            vm.raftersBlock
        );

        vm.space.set(cx, y, cz, 'glowstone');

    }

    northStuff() {
        const vm = this;
        let x = vm.bounds.x + 2;
        let y = 1;
        let z = vm.bounds.z + 1;
        let w = x + vm.bounds.width - 4;
        let dxs = Math.floor(vm.bounds.centerX - 2);
        let dxe = dxs + 4;
        for (x; x < w; x++) {
            if (!vm.bounds.northDoor || (x < dxs || x > dxe)) {
                let b = vm.decor.sample();
                let r = b == 'crafting_table' ? { x: 0, y: Math.PI, z: 0 } : { x: 0, y: 0, z: 0 };
                vm.space.set(
                    x,
                    y,
                    z,
                    b,
                    r.x,
                    r.y,
                    r.x
                );
            }
        }
    }

    westStuff() {
        const vm = this;
        let x = vm.bounds.x + 1;
        let y = 1;
        let z = vm.bounds.z + 2;
        let d = z + vm.bounds.depth - 4;
        let dzs = Math.floor(vm.bounds.centerZ - 2);
        let dze = dzs + 4;
        for (z; z < d; z++) {
            if (!vm.bounds.westDoor || (z < dzs || z > dze)) {
                let b = vm.decor.sample();
                let r = b == 'crafting_table' ? { x: 0, y: 0, z: 0 } : { x: 0, y: Math.PI, z: 0 };
                vm.space.set(
                    x,
                    y,
                    z,
                    b,
                    r.x,
                    r.y,
                    r.x
                );
            }
        }
    }

    southStuff() {
        const vm = this;
        let x = vm.bounds.x + 2;
        let y = 1;
        let z = vm.bounds.z + vm.bounds.depth - 2;
        let w = x + vm.bounds.width - 4;
        let dxs = Math.floor(vm.bounds.centerX - 2);
        let dxe = dxs + 4
        for (x; x < w; x++) {
            if (!vm.bounds.southDoor || (x < dxs || x > dxe)) {
                let b = vm.decor.sample();
                let r = b == 'crafting_table' ? { x: 0, y: 0, z: 0 } : { x: 0, y: Math.PI / 2, z: 0 };
                vm.space.set(
                    x,
                    y,
                    z,
                    b,
                    r.x,
                    r.y,
                    r.z
                );
            }
        }
    }

    eastStuff() {
        const vm = this;
        let x = vm.bounds.x + vm.bounds.width - 2;
        let y = 1;
        let z = vm.bounds.z + 2;
        let d = z + vm.bounds.depth - 3;
        let dzs = Math.floor(vm.bounds.centerZ - 2);
        let dze = dzs + 4;
        for (z; z < d; z++) {
            if (!vm.bounds.eastDoor || (z < dzs || z > dze)) {
                let b = vm.decor.sample();
                let r = b == 'crafting_table' ? { x: 0, y: 0, z: 0 } : { x: 0, y: Math.PI, z: 0 };
                vm.space.set(
                    x,
                    y,
                    z,
                    b,
                    r.x,
                    r.y,
                    r.x
                );
            }
        }
    }

    decor = [
        //'furnace',
        'crafting_table',
        //'blast_furnace',
        //'smithing_table',
        //'smoker',
        //'dispenser',
        'barrel',
        'composter',
        //'dispenser',
        //'dropper',
        //'oak_planks',
    ];

    pillarNE(random = false) {
        let wr = Math.floor(Math.random() * 10);
        if (wr < 5 && random) {
            return;
        }
        const vm = this;
        let x = vm.bounds.x + 10;
        let z = vm.bounds.z + 5;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.doorFrameBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.wallBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.doorFrameBlock
        );
    }

    pillarNW(random = false) {
        let wr = Math.floor(Math.random() * 10);
        if (wr < 5 && random) {
            return;
        }
        const vm = this;
        let x = vm.bounds.x + 5;
        let z = vm.bounds.z + 5;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.doorFrameBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.wallBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.doorFrameBlock
        );
    }

    pillarSE(random = false) {
        let wr = Math.floor(Math.random() * 10);
        if (wr < 5 && random) {
            return;
        }
        const vm = this;
        let x = vm.bounds.x + 10;
        let z = vm.bounds.z + vm.bounds.depth - 7;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.doorFrameBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.wallBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.doorFrameBlock
        );
    }

    pillarSW(random = false) {
        let wr = Math.floor(Math.random() * 10);
        if (wr < 5 && random) {
            return;
        }
        const vm = this;
        let x = vm.bounds.x + 5;
        let z = vm.bounds.z + vm.bounds.depth - 7;
        vm.rect.flatHallow(
            x,
            vm.bounds.y + 1,
            z,
            1,
            1,
            vm.doorFrameBlock
        );

        let ly = vm.bounds.height - 2;
        for (let y = vm.bounds.y + 2; y < ly; y++) {
            vm.rect.flatHallow(
                x,
                y,
                z,
                1,
                1,
                vm.wallBlock
            );
        }

        vm.rect.flatHallow(
            x,
            ly,
            z,
            1,
            1,
            vm.doorFrameBlock
        );
    }

    generate = () => {
        const vm = this;

        /* floor */
        vm.floor();
        //vm.floorTrim();

        /* walls */
        vm.wallNorth();
        vm.wallEast();
        vm.wallSouth();
        vm.wallWest();

        vm.pillarNW();
        vm.pillarNE();
        vm.pillarSW();
        vm.pillarSE();

        /* trim 
        vm.trim();
        */
        vm.roofTrim();
        vm.roofCross();

        /* extras 
        vm.northStuff();
        vm.southStuff();
        vm.eastStuff();
        vm.westStuff();
        */

        vm.roof();
    };
}
