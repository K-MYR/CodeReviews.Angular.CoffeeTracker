import { makeStateKey } from "@angular/core";
import { GridDimensions, Hexagon } from "../interfaces/hexagon";

export const HEXAGONS_STATE_KEY = makeStateKey<Hexagon[]>('hexagons');

export const GRID_DIMENSIONS_STATE_KEY = makeStateKey<GridDimensions>('gridDimensions');
