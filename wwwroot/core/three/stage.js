import * as THREE from 'three';

export class Stage extends EventTarget {

  #element;
  #scene;
  #camera;
  #renderer;

  static #loader = new THREE.TextureLoader();
  static get loader() {
    if (!Stage.#loader) {
      Stage.#loader = new THREE.TextureLoader();
    }
    return Stage.#loader;
  }

  constructor() {
    super();

    const vm = this;

    vm.#scene = new THREE.Scene();
    vm.#scene.background = new THREE.Color(0x000000);
    vm.#camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);

    vm.#renderer = new THREE.WebGLRenderer();
    vm.#renderer.setSize(
      window.innerWidth,
      window.innerHeight);

    vm.#element = vm.#renderer.domElement;
    document.body.appendChild(vm.#element);
  }

  get scene() {
    const vm = this;
    return vm.#scene;
  }

  set scene(scene) {
    const vm = this;
    if (scene) {
      vm.#scene = scene;
    }
  }

  clock() {
    const vm = this;
    return new THREE.Clock();
  }

  get loader() {
    return Stage.#loader;
  }

  get camera() {
    const vm = this;
    return vm.#camera;
  }

  get renderer() {
    const vm = this;
    return vm.#renderer;
  }

  add(o) {
    const vm = this;
    vm.#scene.add(o);
  }

  begin() {
    const vm = this;
    requestAnimationFrame((t) => {
      vm.#frameLoop(t);
    });
  }

  #frameLoop(ticks) {
    const vm = this;
    requestAnimationFrame((t) => {
      vm.#frameLoop(t);
    });

    let e = new CustomEvent('frame');
    e.ticks = ticks;
    e.stage = vm;
    vm.dispatchEvent(e);

    vm.#renderer.render(vm.#scene, vm.#camera);
  }

}
