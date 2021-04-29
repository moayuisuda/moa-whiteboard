Array.prototype.remove = function(...items) {
  for (let item of items) {
    var index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
};

Array.prototype.last = function() {
  return this[this.length - 1]
};
