export interface Hexagon {
  coordinates: HexagonVector,
  key: string,
  translate: string,
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

export interface GridDimensions {
  rows: number,
  columns: number
}
