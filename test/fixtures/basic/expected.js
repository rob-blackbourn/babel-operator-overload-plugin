let foo = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("+")]) return _left[Symbol.for("+")](_right);else return _left + _right;
}(x, y);