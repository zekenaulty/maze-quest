

let c1 = new OffscreenCanvas(128, 128);
let c2 = document.createElement('canvas');

c2.width = 64;
c2.height = 64;
c2.style.width = '64px';
c2.style.height = '64px';
c2.style.border = '1px solid black';

document.body.appendChild(c2);

let ctx1 = c1.getContext('2d');
let ctx2 = c2.getContext('2d');


const centerX = c1.width / 2;
const centerY = c1.height / 2;
const radius = 32;

ctx1.beginPath();
ctx1.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
ctx1.fillStyle = 'green';
ctx1.fill();
ctx1.lineWidth = 5;
ctx1.strokeStyle = '#003300';
ctx1.stroke();

ctx2.drawImage(c1, 0, 0, 128, 128, -16, -16, 32, 32);