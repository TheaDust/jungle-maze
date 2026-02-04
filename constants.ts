export const GRID_SIZE = 200;
export const CELL_SIZE = 40; // Pixels per grid cell
export const VIEWPORT_PADDING = 2; // Extra cells to render outside viewport

// Colors
export const COLORS = {
  WALL_DARK: '#064e3b', // Emerald 900
  WALL_LIGHT: '#10b981', // Emerald 500 (for moss details)
  FLOOR: '#3f2e18', // Deep brown/mud
  FLOOR_HIGHLIGHT: '#5c4028',
  FOG: '#000000',
};

// 12x12 Pixel Art - 1 = Brown, 2 = Face/Beige, 0 = Transparent
// Updated to show Head + Body structure (Side Profile facing right)
export const MONKEY_SPRITE = [
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0], // Head Top
  [0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0], // Forehead / Face
  [0, 0, 0, 0, 1, 2, 2, 2, 0, 0, 0, 0], // Snout / Mouth
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], // Neck
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0], // Back / Shoulders
  [0, 0, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0], // Body / Hand reaching out
  [0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0], // Tail base / Belly
  [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], // Tail curl / Thighs
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], // Tail tip / Legs
  [0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0], // Feet
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const MONKEY_COLORS: Record<number, string> = {
  1: '#8B4513', // SaddleBrown
  2: '#FFE4C4', // Bisque
};

// 12x12
export const BANANA_SPRITE = [
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const BANANA_COLORS: Record<number, string> = {
  1: '#D4AF37', // Darker Gold Outline
  2: '#FFFF00', // Yellow
};