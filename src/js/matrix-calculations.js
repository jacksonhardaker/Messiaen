let _currentTransformationMatrix = null;

function createMatrixIdentity() {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]];
}

function matrixMultiply(m1, m2) {

  var result = createMatrixIdentity();

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      var sum = 0;

      for (var z = 0; z < 3; z++) {
        sum += m1[x][z] * m2[z][y];
      }

      result[x][y] = sum;
    }
  }

  return result;
}

function setTransformOrigin(context, m11, m21, m12, m22, dx, dy) {

  context.setTransform(m11, m21, m12, m22, dx, dy);

  _currentTransformationMatrix = [
    [m11, m12, 0],
    [m21, m22, 0],
    [dx, dy, 1]];
}

function scale(context, aX, aY) {

  context.scale(aX, aY);

  var m = [
    [aX, 0, 0],
    [0, aY, 0],
    [0, 0, 1]];

  _currentTransformationMatrix = matrixMultiply(m, _currentTransformationMatrix);
}

function rotate(context, angle) {

  context.rotate(angle);

  var m = [
    [Math.cos(angle), Math.sin(angle), 0],
    [-Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 1]];

  _currentTransformationMatrix = matrixMultiply(m, _currentTransformationMatrix);
}

function translate(context, x, y) {

  context.translate(x, y);

  var m = [
    [1, 0, 0],
    [0, 1, 0],
    [x, y, 1]];

  _currentTransformationMatrix = matrixMultiply(m, _currentTransformationMatrix);
}

function currentTransformationMatrix() { return _currentTransformationMatrix; }

export const matrix = { rotate, translate, scale, setTransformOrigin, currentTransformationMatrix };