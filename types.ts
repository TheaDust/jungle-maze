export interface Position {
  x: number;
  y: number;
}

export interface Walls {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface Cell {
  x: number;
  y: number;
  walls: Walls;
  visited: boolean;
}

export type Grid = Cell[][];

export enum GameState {
  GENERATING,
  PLAYING,
  WON,
}
