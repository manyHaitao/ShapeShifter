import * as paper from 'paper';

/**
 * Returns the project's CSS scale factor, representing the number of CSS pixels
 * per viewport pixel.
 */
export function getCssScaling() {
  // Given unit vectors u0 = (0, 1) and v0 = (1, 0).
  //
  // After matrix mapping, we get u1 and v1. Let Θ be the angle between u1 and v1.
  // Then the final scale we want is:
  //
  // Math.min(|u1|sin(Θ),|v1|sin(Θ)) = |u1||v1|sin(Θ) / Math.max(|u1|,|v1|)
  //
  // If Math.max(|u1|,|v1|) = 0, that means either x or y has a scale of 0.
  //
  // For the non-skew case, which is most of the cases, matrix scale is
  // computing exactly the scale on x and y axis, and take the minimal of these two.
  //
  // For the skew case, an unit square will mapped to a parallelogram,
  // and this function will return the minimal height of the 2 bases.
  const { matrix } = paper.project.activeLayer;
  const m = new paper.Matrix(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
  const u0 = new paper.Point(0, 1);
  const v0 = new paper.Point(1, 0);
  const u1 = u0.transform(m);
  const v1 = v0.transform(m);
  const sx = Math.hypot(u1.x, u1.y);
  const sy = Math.hypot(v1.x, v1.y);
  const dotProduct = u1.y * v1.x - u1.x * v1.y;
  const maxScale = Math.max(sx, sy);
  return maxScale > 0 ? Math.abs(dotProduct) / maxScale : 0;
}

/**
 * Returns the project's physical scale factor, representing the number of physical
 * pixels per viewport pixel.
 */
export function getAttrScaling() {
  return getCssScaling() * devicePixelRatio;
}
