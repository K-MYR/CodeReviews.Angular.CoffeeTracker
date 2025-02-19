export interface Hexagon {
  coordinates: HexagonVector,
  key: string,
  translate: string
}

export interface HexagonVector {
  x: number,
  y: number
}

export interface HexagonCubeVector {
  q: number,
  s: number,
  r: number
}

export interface HexagonVectors {
  0: HexagonVector
  1: HexagonVector,
  2: HexagonVector,
  3: HexagonVector,
  4: HexagonVector,
  5: HexagonVector,
}

export const HexagonVectors: HexagonVectors = {
  0: { x: -1, y: 1 },
  1: { x: 1, y: 1 },
  2: { x: 2, y: 0 },
  3: { x: 1, y: -1 },
  4: { x: -1, y: -1 },
  5: { x: -2, y: 0 },
}


export function addVector(coordinates: HexagonVector, vector: HexagonVector): HexagonVector  {
  return {
    x: coordinates.x + vector.x,
    y: coordinates.y * vector.y
  };
}

export function getVectorNeighbor(coordinates: HexagonVector, direction: keyof HexagonVectors): HexagonVector {
  return {
    x: coordinates.x + HexagonVectors[direction].x,
    y: coordinates.y + HexagonVectors[direction].y,
  }
}

export function scaleVector(vector: HexagonVector, factor: number): HexagonVector {
  return {
    x: vector.x * factor,
    y: vector.y * factor
  };
}

export function traverseRing(center: HexagonVector, radius: number, callback: (vector: HexagonVector) => void): void {
  var coordinates = addVector(center, scaleVector(HexagonVectors[4], radius));
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < radius; j++) {
      coordinates = getVectorNeighbor(coordinates, i as keyof HexagonVectors)
      callback(coordinates);
    }
  }
}

export function DoubledToCube(vector: HexagonVector): HexagonCubeVector {
  var q = (vector.x - vector.y) / 2;
  var r = vector.y;
  var s = -q - r;
  return {
    q: q,
    r: r,
    s: s
  };
}

export function CubeToDoubled(vector: HexagonCubeVector): HexagonVector {
  return {
    x: 2 * vector.q + vector.r,
    y: vector.r
  };
}

export function roate60Deg(vector: HexagonCubeVector): HexagonCubeVector {
  return {
    q: -vector.s,
    r: -vector.q,
    s: -vector.r
  };
}


