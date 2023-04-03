export class RoomBounds {

    #x;
    #y;
    #z;

    #width;
    #height;
    #depth;

    #centerX;
    #centerY
    #centerZ;

    #northDoor;
    #eastDoor;
    #southDoor;
    #westDoor;

    constructor(
        x,
        y,
        z,
        w,
        h,
        d,
        dn = false,
        de = false,
        ds = false,
        dw = false
    ) {
        const vm = this;

        vm.#x = x;
        vm.#y = y;
        vm.#z = z;

        vm.#width = w;
        vm.#height = h;
        vm.#depth = d;

        vm.#centerX = x + w * 0.5;
        vm.#centerY = y + h * 0.5;
        vm.#centerZ = z + d * 0.5;

        vm.#northDoor = dn;
        vm.#eastDoor = de;
        vm.#southDoor = ds;
        vm.#westDoor = dw;
    }

    get width() {
        const vm = this;
        return vm.#width;
    }

    get height() {
        const vm = this;
        return vm.#height;
    }

    get depth() {
        const vm = this;
        return vm.#depth;
    }

    get x() {
        const vm = this;
        return vm.#x;
    }

    get y() {
        const vm = this;
        return vm.#y;
    }

    get z() {
        const vm = this;
        return vm.#z;
    }

    get centerX() {
        const vm = this;
        return vm.#centerX;
    }

    get centerY() {
        const vm = this;
        return vm.#centerY;
    }

    get centerZ() {
        const vm = this;
        return vm.#centerZ;
    }

    get northDoor() {
        const vm = this;
        return vm.#northDoor;
    }

    get eastDoor() {
        const vm = this;
        return vm.#eastDoor;
    }

    get southDoor() {
        const vm = this;
        return vm.#southDoor;
    }

    get westDoor() {
        const vm = this;
        return vm.#westDoor;
    }

    get top() {
        const vm = this;
        return vm.y + vm.height;
    }

    get right() {
        const vm = this;
        return vm.x + vm.width;
    }

    get bottom() {
        const vm = this;
        return vm.z + vm.depth;
    }

    inBoundsX(x) {
        const vm = this;
        if (x >= vm.x && x <= vm.right) {
            return true;
        }
        return false;
    }

    inBoundsY(y) {
        const vm = this;
        if (y >= vm.y && y <= vm.top) {
            return true;
        }
        return false;
    }

    inBoundsZ(z) {
        const vm = this;
        if (z >= vm.z && z <= vm.bottom) {
            return true;
        }
        return false;
    }

    inBounds(x, y, z) {
        const vm = this;
        return vm.inBoundsX(x) && vm.inBoundsY(y) && vm.inBoundsZ(z);
    }

    outOfBoundsWest(x) {
        const vm = this;
        if (x < vm.x) {
            return true;
        }
        return false;
    }

    outOfBoundsEast(x) {
        const vm = this;
        if (x > vm.right) {
            return true;
        }
        return false;
    }

    outOfBoundsNorth(z) {
        const vm = this;
        if (z < vm.z) { 
            return true;
        }
        return false;
    }

    outOfBoundsSouth(z) {
        const vm = this;
        if (z > vm.bottom) {
            return true;
        }
        return false;
    }

}
