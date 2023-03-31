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
        let vm = this;

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
        let vm = this;
        return vm.#width;
    }

    get height() {
        let vm = this;
        return vm.#height;
    }

    get depth() {
        let vm = this;
        return vm.#depth;
    }

    get x() {
        let vm = this;
        return vm.#x;
    }

    get y() {
        let vm = this;
        return vm.#y;
    }

    get z() {
        let vm = this;
        return vm.#z;
    }

    get centerX() {
        let vm = this;
        return vm.#centerX;
    }

    get centerY() {
        let vm = this;
        return vm.#centerY;
    }

    get centerZ() {
        let vm = this;
        return vm.#centerZ;
    }

    get northDoor() {
        let vm = this;
        return vm.#northDoor;
    }

    get eastDoor() {
        let vm = this;
        return vm.#eastDoor;
    }

    get southDoor() {
        let vm = this;
        return vm.#southDoor;
    }

    get westDoor() {
        let vm = this;
        return vm.#westDoor;
    }

    get top() {
        let vm = this;
        return vm.y + vm.height;
    }

    get right() {
        let vm = this;
        return vm.x + vm.width;
    }

    get bottom() {
        let vm = this;
        return vm.z + vm.depth;
    }

    inBoundsX(x) {
        let vm = this;
        if (x >= vm.x && x <= vm.right) {
            return true;
        }
        return false;
    }

    inBoundsY(y) {
        let vm = this;
        if (y >= vm.y && y <= vm.top) {
            return true;
        }
        return false;
    }

    inBoundsZ(z) {
        let vm = this;
        if (z >= vm.z && z <= vm.bottom) {
            return true;
        }
        return false;
    }

    inBounds(x, y, z) {
        let vm = this;
        return vm.inBoundsX(x) && vm.inBoundsY(y) && vm.inBoundsZ(z);
    }

    outOfBoundsWest(x) {
        let vm = this;
        if (x < vm.x) {
            return true;
        }
        return false;
    }

    outOfBoundsEast(x) {
        let vm = this;
        if (x > vm.right) {
            return true;
        }
        return false;
    }

    outOfBoundsNorth(z) {
        let vm = this;
        if (z < vm.z) { 
            return true;
        }
        return false;
    }

    outOfBoundsSouth(z) {
        let vm = this;
        if (z > vm.bottom) {
            return true;
        }
        return false;
    }

}
