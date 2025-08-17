import { HexagonVector, HexagonVectors, HexagonCubeVector } from "../interfaces/hexagon";

export function addVector(coordinates: HexagonVector, vector: HexagonVector): HexagonVector {
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
  let coordinates = addVector(center, scaleVector(HexagonVectors[4], radius));
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      coordinates = getVectorNeighbor(coordinates, i as keyof HexagonVectors)
      callback(coordinates);
    }
  }
}

export function doubledToCube(vector: HexagonVector): HexagonCubeVector {
  const q = (vector.x - vector.y) / 2;
  const r = vector.y;
  const s = -q - r;
  return {
    q: q,
    r: r,
    s: s
  };
}

export function cubeToDoubled(vector: HexagonCubeVector): HexagonVector {
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

export function doubledWidthDistance(a: HexagonVector, b: HexagonVector): number {
  const deltaCol = Math.abs(a.x - b.x);
  const deltaRow = Math.abs(a.y - b.y);
  return deltaRow + Math.max(0, (deltaCol - deltaRow) / 2);
}
