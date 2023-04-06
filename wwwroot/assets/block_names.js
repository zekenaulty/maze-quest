const names = document.querySelectorAll('code');
const info = document.querySelector('.block-count');
const blockNames = document.querySelector('.names');
const blockTextures = document.querySelector('.textures');
const blockTextureMaps = document.querySelector('.maps');
const images = document.querySelector('.images');

const blocks = [];
const texturePaths = [];
const materials = {};
const meta = {};
const blockMaps = [];
const toFix = [];
const alt = false;
const base = `./minecraft/textures/64/block${alt ? '_alt' : ''}`;
const suffix = alt ? '_alt' : '';

const right = 0;
const left = 1;
const top = 2;
const bottom = 3;
const front = 4;
const back = 5;

let n = 0

const skip = [
  'dragon_egg',
  'ladder',
  'cauldron',
  'end_portal_frame',
  'end_rod',
  'peony',
  'cobweb',
  'beacon',
  'nether_portal',
  'brewing_stand',
  'grass',
  'dandelion',
  'poppy',
  'mycelium',
  'fern',
  'allium',
  'anvil',
  'hopper',
  'torch',
  'candle'];

const skipPartials = [
  'wart',
  'nylium',
  'nether',
  'stem',
  'observer',
  'jigsaw',
  'repeating',
  'vine',
  'leaves',
  'sugar',
  'melon',
  'structure',
  'scaffold',
  'podzol',
  'dirt_path',
  'grass_block',
  'mycelium',
  'cactus',
  'daylight',
  'enchanting',
  'fletching',
  'cartography',
  'lectern',
  'sensor',
  'grindstone',
  'sprouts',
  'pickle',
  'roots',
  'lichen',
  'loom',
  'cutter',
  'anvil',
  'hanging',
  'blossom',
  'torch',
  'cake',
  'lantern',
  'kelp',
  'rod',
  'drip',
  'flower',
  'fungus',
  'egg',
  'amethyst',
  'seagrass',
  'chain',
  'plant',
  'vines',
  'coral',
  'azalea',
  'tall_',
  'sapling',
  'end_',
  'slab',
  'glass',
  'rail',
  'orchid',
  'bluet',
  'tulip',
  'dead',
  'daisy',
  'mushroom',
  'daisy',
  'bars',
  'pot',
  'pumpkin',
  'trip',
  'lily',
  'stairs',
  'fence',
  'wall',
  'rose',
  'fern',
  'lilac',
  'sunflower',
  'terracotta',
  'door'];

const ignore = (name) => {
  if (skip.includes(name) || name == '') {
    return true;
  }

  for (let i = 0; i < skipPartials.length; i++) {
    if (name.indexOf(skipPartials[i]) > -1) {
      return true;
    }
  }

  return false;
};

const addTexture = (s, name) => {
  if (!texturePaths.includes(s)) {
    texturePaths.push(s);
    let img = document.createElement('img');
    img.id = s.substring(s.lastIndexOf('/') + 1).replace('.png', '');
    img.src = '../' + s;
    img.style.width = '64px';
    img.onclick = () => {
      alert(`${name} - ${img.src}, ${img.width}x${img.height/2}`);
    };
    let i = document.createElement('div');
    i.classList.add('img');
    i.appendChild(img);
    images.appendChild(i);
  }
};

const findTexture = async (
  name,
  side = '',
  prop = 'sides') => {
  let ex = side == '' ? '' : '_' + side;
  let r = await fetch(`${base}/${name}${ex}.png`);
  if (r.ok) {
    let url = new URL(r.url).pathname.substring(1);
    addTexture(url, name);
    materials[name + suffix][prop] = texturePaths.indexOf(url);
    let rmeta = await fetch(`${base}/${name}${ex}.png.mcmeta`);
    if (rmeta.ok) {
      let json = await rmeta.json();
      meta[name + suffix] = json;
    }
  }
};

const buildTextures = async (name) => {
  if (!materials[name + suffix]) {
    return;
  }
  await findTexture(name);
  await findTexture(name, 'side');
  await findTexture(name, 'top', 'top');
  await findTexture(name, 'bottom', 'bottom');
  await findTexture(name, 'front', 'front');
  await findTexture(name, 'back', 'back');
};

const mergeTextures = (name) => {
  if (!materials[name + suffix]) {
    return;
  }

  let textures = [];
  if (materials[name + suffix].sides) {
    textures.push(materials[name + suffix].sides);
    textures.push(materials[name + suffix].sides);

    if (materials[name + suffix].top) {
      textures.push(materials[name + suffix].top);
    } else {
      textures.push(materials[name + suffix].sides);
    }

    if (materials[name + suffix].bottom) {
      textures.push(materials[name + suffix].bottom);
    } else if (materials[name + suffix].top) {
      textures.push(materials[name + suffix].top);
    } else {
      textures.push(materials[name + suffix].sides);
    }

    if (materials[name + suffix].front) {
      textures.push(materials[name + suffix].front);
    } else {
      textures.push(materials[name + suffix].sides);
    }

    if (materials[name + suffix].back) {
      textures.push(materials[name + suffix].back);
    } else {
      textures.push(materials[name + suffix].sides);
    }
  }

  materials[name + suffix].name = name;
  if (name.indexOf('leaves') > -1) {
    materials[name + suffix].type = 'alphaMap';
    materials[name + suffix].color = 0x00cc00;
    materials[name + suffix].opacity = 0.7;
    materials[name + suffix].transparent = true;
  } else {
    materials[name + suffix].type = 'map';
    materials[name + suffix].color = 0xc6c6c6;
    materials[name + suffix].opacity = 1.0;
    materials[name + suffix].transparent = false;
  }

  if (textures.length == 0) {
    toFix.push(name);
    delete materials[name + suffix];
  } else {
    delete materials[name + suffix].sides;
    delete materials[name + suffix].top;
    delete materials[name + suffix].bottom;
    delete materials[name + suffix].front;
    delete materials[name + suffix].back;
    materials[name + suffix].textures = textures;
  }
};

const mapMaterial = (name) => {
  if (!materials[name + suffix]) {
    return;
  }

  let map = [];
  let m = materials[name + suffix];

  for (let i = 0; i < m.textures.length; i++) {
    let b = JSON.parse(JSON.stringify(m));
    delete b.textures;
    b.isAlt = alt;
    b.file = texturePaths[m.textures[i]].substring(texturePaths[m.textures[i]].lastIndexOf('/') + 1);
    b.name = b.file.replace('.png', '');
    let img = document.getElementById(b.name);
    b.width = img.width;
    b.height = img.height;
    map.push(b);
  }
  let solid = true;
  let side = map[0];
  map.forEach((v) => {
    if (side.file != v.file) {
      solid = false;
    }
  });

  let bmap = {
    name: name + suffix,
    map: solid ? map[0] : map
  };

  if (meta[name + suffix]) {
    bmap.meta = meta[name + suffix];
  }

  blockMaps.push(bmap);
};

const load = async (name) => {
  if (!ignore(name)) {
    info.innerText = `building ${name}`;
    materials[name + suffix] = {};
    if (materials[name + suffix]) {
      await buildTextures(name);
      await mergeTextures(name);
      if (materials[name + suffix]) {
        await mapMaterial(name);
        blocks.push(name + suffix);
        n++;
      }
    }
  }
};

const patchFurnaceBlock = (name, f) => {
  let b = JSON.parse(JSON.stringify(f));
  b.name = name;
  blocks.push(name);
  b.map[front].file = name + '_front.png';
  b.map[front].name = name + '_front';
  blockMaps.push(b);
}

let clean = [];
for (let i = 0; i < names.length; i++) {
  let n = names[i].innerText.replaceAll(' ', '').toLowerCase();
  if (!clean.includes(n)) {
    clean.push(n);
  }
}

for (let i = 0; i < clean.length; i++) {
  await load(clean[i]);
}

//patches
if (!alt) {
  let f = blockMaps.find(v => v.name == 'furnace');
  let cs = blockMaps.find(v => v.name == 'cobblestone');
  let op = blockMaps.find(v => v.name == 'oak_planks');
  let ct = blockMaps.find(v => v.name == 'crafting_table');
  let p = blockMaps.find(v => v.name == 'piston');

  f.map[bottom] = cs.map;
  p.map[bottom] = cs.map;
  ct.map[bottom] = op.map;
  patchFurnaceBlock('dropper', f);
  patchFurnaceBlock('dispenser', f);
  
  let bs = blockMaps.find(v => v.name == 'bookshelf');
  let side = bs.map;
  bs.map = [];
  bs.map.push(side);
  bs.map.push(side);
  bs.map.push(op.map);
  bs.map.push(op.map);
  bs.map.push(side);
  bs.map.push(side);
} else {
  delete blockMaps.bookshelf_alt;
}

info.innerText = 'Found ' + blockMaps.length + ' blocks!';

blockTextureMaps.innerText = JSON.stringify(blockMaps);//, null, 4);
blockTextureMaps.onclick = () => {
  navigator.clipboard.writeText(blockTextureMaps.innerText);
};
