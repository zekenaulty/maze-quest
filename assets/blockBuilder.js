import * as THREE from 'three';

export class BlockBuilder extends EventTarget {

  #base;
  #folder = 'assets/minecraft/textures/';
  #loader;
  #textures = {};
  #materials = {};
  #standard = {};
  #instanced = {};
  #blocks = [];
  #loaded = false;
  #animate = {};

  #pack = '';
  #size = 64;
  #scale = 1;

  constructor(
    basePath = './',
    size = 64
  ) {
    super();

    THREE.Cache.enabled = true;

    let vm = this;
    vm.#base = basePath;
    vm.#loader = new THREE.TextureLoader();

    if (size == 64) {
      vm.#size = 64;
      vm.#scale = 1;
      vm.#pack = '64/';
    } else if (size == 32) {
      vm.size = 32;
      vm.#scale = 0.5;
      vm.#pack = '32/';
    } else {
      vm.size = 16;
      vm.#scale = 0.25;
      vm.#pack = '';
    }
  }

  get loaded() {
    let vm = this;

    return vm.#loaded;
  }

  get names() {
    let vm = this;
    return vm.#blocks;
  }

  get create() {
    let vm = this;
    return vm.#standard;
  }

  get createInstanced() {
    let vm = this;
    return vm.#instanced;
  }

  random() {
    let vm = this;
    return vm.names[Math.floor(Math.random() * vm.names.length)];
  }

  path(file, alt = false) {
    let vm = this;
    return `${vm.#base}${vm.#folder}${vm.#pack}${alt ? 'block_alt/' : 'block/'}${file}`;
  }

  async #loadJson(name) {
    let vm = this;
    let path = `${vm.#base}assets/${name}.json`;
    let begin = new CustomEvent('loading');
    let complete = new CustomEvent('loaded');

    begin.content_type = 'json';
    begin.name = name;
    begin.url = path;
    vm.dispatchEvent(begin);

    let r = await fetch(path);
    if (!r.ok) {
      throw new Error(`Missing ${path}`);
    }

    complete.content_type = 'json';
    complete.name = name;
    complete.url = path;

    vm[name] = await r.json();

    complete.content = vm[name];

    vm.dispatchEvent(complete);
  }


  async #loadTexture(name, file, alt = false, w = 16, h = 16) {
    let vm = this;
    let begin = new CustomEvent('loading');
    let complete = new CustomEvent('loaded');
    let path = vm.path(file, alt);

    begin._content_type = 'texture';
    begin.url = path;
    vm.dispatchEvent(begin);
    let r = vm.#loader.load(path);
    vm.#textures[name] = r;

    complete.content_type = 'texture';
    complete.url = path;
    complete.content = r;
    vm.dispatchEvent(complete);
  }

  #build(b) {
    let vm = this;
    let m;

    if (Array.isArray(b.map)) {
      vm.#materials[b.name] = [
        new THREE.MeshBasicMaterial({
          color: b.map[0].color,
          map: vm.#textures[b.map[0].name]
        }),
        new THREE.MeshBasicMaterial({
          color: b.map[1].color,
          map: vm.#textures[b.map[1].name]
        }),
        new THREE.MeshBasicMaterial({
          color: b.map[2].color,
          map: vm.#textures[b.map[2].name]
        }),
        new THREE.MeshBasicMaterial({
          color: b.map[3].color,
          map: vm.#textures[b.map[3].name]
        }),
        new THREE.MeshBasicMaterial({
          color: b.map[4].color,
          map: vm.#textures[b.map[4].name]
        }),
        new THREE.MeshBasicMaterial({
          color: b.map[5].color,
          map: vm.#textures[b.map[5].name]
        })];
    } else {
      let n = new THREE.MeshBasicMaterial({
        color: b.map.color,
        map: vm.#textures[b.map.name]
      });
      vm.#materials[b.name] = n;
      if (b.meta) {
        //console.log(b.meta);
        let offset = b.map.width / b.map.height;
        n.map.offset.set(0, 0);
        n.map.repeat.set(1, offset);
        vm.#animate[b.name] = {
          name: b.name,
          offset: offset,
          frame: 0,
          ticks: 0,
          clock: new THREE.Clock(),
          frameCount: b.map.height / b.map.width,
          frametime: b.meta.animation.frametime ? b.meta.animation.frametime : 1,
          frames: b.meta.animation.frames ? b.meta.animation.frames : []
        };
      }
    }

    let built = new CustomEvent('built');
    built.name = b.name;
    vm.dispatchEvent(built);
  }

  #block(name) {
    let vm = this;

    vm.#standard[name] = () => {
      let geometry = new THREE.BoxGeometry(1, 1, 1);
      return new THREE.Mesh(geometry, vm.#materials[name]);
    };

    vm.#instanced[name] = (count) => {
      let geometry = new THREE.BoxGeometry(1, 1, 1);
      return new THREE.InstancedMesh(geometry, vm.#materials[name], count);
    };

    vm.#blocks.push(name);
  }

  async load() {
    let vm = this;

    await vm.#loadJson('textureMaps');
    await vm.#loadJson('textureMapsAlt');

    vm.textureMaps.forEach((b) => {
      if (Array.isArray(b.map)) {
        b.map.forEach((m) => {
          vm.#loadTexture(m.name, m.file);
        });
      } else {
        vm.#loadTexture(b.map.name, b.map.file);
      }
      vm.#build(b);
      vm.#block(b.name);
    });

    vm.textureMapsAlt.forEach((b) => {
      if (Array.isArray(b.map)) {
        b.map.forEach((m) => {
          vm.#loadTexture(m.name, m.file, true);
        });
      } else {
        vm.#loadTexture(b.map.name, b.map.file, true);
      }
      vm.#build(b);
      vm.#block(b.name);
    });

  }

  fix() {
    let vm = this;
    for (let p in vm.#animate) {
      let a = vm.#animate[p];
      let t = vm.#materials[p].map;

      t.repeat.set(1, a.offset);
      t.offset.set(0, 0);
    }
  }

  animate() {
    let vm = this;
    for (let p in vm.#animate) {
      let a = vm.#animate[p];
      a.ticks++;
      if (a.ticks >= a.frametime * 2) {
        let t = vm.#materials[p].map;
        t.offset.set(0, a.offset * a.frame);
        t.needsUpdate = true;
        a.frame++;
        if (a.frame >= a.frameCount) {
          a.frame = 0;
        }
        a.ticks = 0;
      } 
    }
  }
}
