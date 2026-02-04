import { Cell, Grid } from '../types';

export const generateMaze = (width: number, height: number): Grid => {
  // 1. Initialize grid with all walls present
  const grid: Grid = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      });
    }
    grid.push(row);
  }

  // 2. Iterative Backtracking (Generates Perfect Maze)
  const stack: Cell[] = [];
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1]; // Peek
    const neighbors = getUnvisitedNeighbors(current, grid, width, height);

    if (neighbors.length > 0) {
      // Choose random neighbor
      const { neighbor, direction } = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Remove walls
      removeWalls(current, neighbor, direction);
      
      // Mark visited and push
      neighbor.visited = true;
      stack.push(neighbor);
    } else {
      // Backtrack
      stack.pop();
    }
  }

  // 3. Post-Processing: Create Braid Maze (Loops)
  // Remove ~50% of dead ends to confuse wall followers
  createLoops(grid, width, height, 0.5);

  return grid;
};

interface NeighborInfo {
  neighbor: Cell;
  direction: 'top' | 'right' | 'bottom' | 'left';
}

const getUnvisitedNeighbors = (cell: Cell, grid: Grid, width: number, height: number): NeighborInfo[] => {
  const neighbors: NeighborInfo[] = [];
  const { x, y } = cell;

  // Top
  if (y > 0 && !grid[y - 1][x].visited) {
    neighbors.push({ neighbor: grid[y - 1][x], direction: 'top' });
  }
  // Right
  if (x < width - 1 && !grid[y][x + 1].visited) {
    neighbors.push({ neighbor: grid[y][x + 1], direction: 'right' });
  }
  // Bottom
  if (y < height - 1 && !grid[y + 1][x].visited) {
    neighbors.push({ neighbor: grid[y + 1][x], direction: 'bottom' });
  }
  // Left
  if (x > 0 && !grid[y][x - 1].visited) {
    neighbors.push({ neighbor: grid[y][x - 1], direction: 'left' });
  }

  return neighbors;
};

const removeWalls = (a: Cell, b: Cell, direction: 'top' | 'right' | 'bottom' | 'left') => {
  switch (direction) {
    case 'top':
      a.walls.top = false;
      b.walls.bottom = false;
      break;
    case 'right':
      a.walls.right = false;
      b.walls.left = false;
      break;
    case 'bottom':
      a.walls.bottom = false;
      b.walls.top = false;
      break;
    case 'left':
      a.walls.left = false;
      b.walls.right = false;
      break;
  }
};

// --- Braid Maze Utilities ---

const isDeadEnd = (cell: Cell): boolean => {
  let wallCount = 0;
  if (cell.walls.top) wallCount++;
  if (cell.walls.right) wallCount++;
  if (cell.walls.bottom) wallCount++;
  if (cell.walls.left) wallCount++;
  return wallCount === 3;
};

const createLoops = (grid: Grid, width: number, height: number, removalFactor: number) => {
  const deadEnds: Cell[] = [];

  // Find all dead ends
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isDeadEnd(grid[y][x])) {
        // Exclude start and end points from being treated as dead ends to remove
        if ((x === 0 && y === 0) || (x === width - 1 && y === height - 1)) continue;
        deadEnds.push(grid[y][x]);
      }
    }
  }

  // Shuffle dead ends to remove randomly
  for (let i = deadEnds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deadEnds[i], deadEnds[j]] = [deadEnds[j], deadEnds[i]];
  }

  const removeCount = Math.floor(deadEnds.length * removalFactor);

  for (let i = 0; i < removeCount; i++) {
    const cell = deadEnds[i];
    const { x, y } = cell;
    const possibleDirections: ('top' | 'right' | 'bottom' | 'left')[] = [];

    // Check which walls exist and lead to valid neighbors (not boundaries)
    if (cell.walls.top && y > 0) possibleDirections.push('top');
    if (cell.walls.right && x < width - 1) possibleDirections.push('right');
    if (cell.walls.bottom && y < height - 1) possibleDirections.push('bottom');
    if (cell.walls.left && x > 0) possibleDirections.push('left');

    if (possibleDirections.length > 0) {
      const dir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
      
      let neighbor: Cell | null = null;
      if (dir === 'top') neighbor = grid[y - 1][x];
      else if (dir === 'right') neighbor = grid[y][x + 1];
      else if (dir === 'bottom') neighbor = grid[y + 1][x];
      else if (dir === 'left') neighbor = grid[y][x - 1];

      if (neighbor) {
        removeWalls(cell, neighbor, dir);
      }
    }
  }
};