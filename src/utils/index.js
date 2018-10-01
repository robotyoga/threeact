import {
  Vector3,
  Vector2,
  Raycaster,
} from 'three';

export const ORIGIN = new Vector3();
export const UP = new Vector3(0, 1, 0);
export const RIGHT = new Vector3(1, 0, 0);

export function getFirstIntersection(mouseEvent, object, camera) {
  const { clientX, clientY } = mouseEvent;

  const { innerWidth, innerHeight } = window;

  const mouseVector = new Vector2();
  mouseVector.set(
    ((clientX / innerWidth) * 2) - 1,
    -((clientY / innerHeight) * 2) + 1,
  );

  const raycaster = new Raycaster();
  raycaster.setFromCamera(mouseVector, camera);

  const intersections = raycaster.intersectObject(object);
  if (intersections.length > 0) {
    return intersections[0];
  }

  return null;
}

export function uvToWorldCoord(object, [u, v]) {
  if (!object) {
    return new Vector3();
  }
  const { width, height } = object.geometry.parameters;
  const point = new Vector3(
    (u - 0.5) * width,
    (v - 0.5) * height,
  );
  point.applyMatrix4(object.matrix);
  return point;
}

export function vec3ToScreenCoord(point, camera) {
  if (!camera || !point) {
    return { x: 0, y: 0 };
  }
  const { innerWidth, innerHeight } = window;
  const projected = new Vector3();
  projected.copy(point)
  projected.project(camera);
  const windowCoord = {
    x: ((projected.x + 1) / 2) * innerWidth,
    y: -((projected.y - 1) / 2) * innerHeight,
  };
  return windowCoord;
}

export function cornersToQuad([xa, ya], [xb, yb]) {
  const minX = Math.min(xa, xb);
  const maxX = Math.max(xa, xb);
  const minY = Math.min(ya, yb);
  const maxY = Math.max(ya, yb);
  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
  ];
}

export function random() {
  return Math.random() * 2 - 1;
}

export function randomVector() {
  return new Vector3(random(), random(), 0).normalize();
}

export function add(...vectors) {
  const result = new Vector3();
  result.addVectors(...vectors);
  return result;
}

export function cross2d(a, b) {
  return (a.x * b.y) - (a.y * b.x);
}

export function copy(v) {
  return new Vector3().copy(v);
}

export function intersection(pointA, dirA, pointB, dirB) {
  const pointDifference = copy(pointA).sub(pointB);
  const numerator = cross2d(pointDifference, dirB)
  const denominator = cross2d(dirA, dirB);
  const scalar = -(numerator / denominator)
  const scaledDirA = copy(dirA).multiplyScalar(scalar);
  const result = add(pointA, scaledDirA);
  return result;
}