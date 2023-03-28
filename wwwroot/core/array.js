Array.prototype.sample = function() {
  let vm = this;
  if (vm.length === 1) return vm[0];
  if (vm.length === 0) return undefined;

  return vm[Math.floor(Math.random() * vm.length)];
}

Array.prototype.delete = function(item) {
  let vm = this;
  if (vm.length === 0) return;
  let idx = vm.indexOf(item);
  if (idx < 0) return;
  vm.splice(idx, 1);
}

Array.prototype.empty = function() {
  let vm = this;
  return vm.length === 0;
}

Array.prototype.any = function() {
  let vm = this;
  return vm.length > 0;
}