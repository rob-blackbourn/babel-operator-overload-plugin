let foo = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("+")]) return _left[Symbol.for("+")](_right);else return _left + _right;
}(function (_left2, _right2) {
  'babel-operator-overload-plugin disabled';

  if (_left2 !== null && _left2 !== undefined && _left2[Symbol.for("+")]) return _left2[Symbol.for("+")](_right2);else return _left2 + _right2;
}(function (_left3, _right3) {
  'babel-operator-overload-plugin disabled';

  if (_left3 !== null && _left3 !== undefined && _left3[Symbol.for("/")]) return _left3[Symbol.for("/")](_right3);else return _left3 / _right3;
}(f(function (_left4, _right4) {
  'babel-operator-overload-plugin disabled';

  if (_left4 !== null && _left4 !== undefined && _left4[Symbol.for("+")]) return _left4[Symbol.for("+")](_right4);else return _left4 + _right4;
}(a, b)), 2), function (_left5, _right5) {
  'babel-operator-overload-plugin disabled';

  if (_left5 !== null && _left5 !== undefined && _left5[Symbol.for("*")]) return _left5[Symbol.for("*")](_right5);else return _left5 * _right5;
}(w, g(function (_left6, _right6) {
  'babel-operator-overload-plugin disabled';

  if (_left6 !== null && _left6 !== undefined && _left6[Symbol.for("*")]) return _left6[Symbol.for("*")](_right6);else return _left6 * _right6;
}(x, y)))), function (_arg) {
  'babel-operator-overload-plugin disabled';

  if (_arg !== null && _arg !== undefined && _arg[Symbol.for("typeof")]) return _arg[Symbol.for("typeof")]();else return typeof _arg;
}(function (_left7, _right7) {
  'babel-operator-overload-plugin disabled';

  if (_left7 !== null && _left7 !== undefined && _left7[Symbol.for("-")]) return _left7[Symbol.for("-")](_right7);else return _left7 - _right7;
}(f, g)));