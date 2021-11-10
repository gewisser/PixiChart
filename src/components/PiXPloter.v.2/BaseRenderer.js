export default class {
  _ploter = undefined;

  toPix() {}
  toVal() {}

  map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  set ploter(val) {
    this._ploter = val;
  }

  get ploter() {
    return this._ploter;
  }

  getArea() {}

  redraw(dirty) {}
}
