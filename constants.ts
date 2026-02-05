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

// 12x12 Pixel Art - 1 = Brown, 2 = Face/Beige, 3 = Dark Brown (Eyes), 0 = Transparent
// Updated: Tail lowered (peaks at row 3 instead of 2). Eyes changed to dark brown.
export const MONKEY_SPRITE = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0], // Head Top
  [0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0], // Ears out, Forehead
  [0, 0, 0, 0, 1, 2, 3, 2, 3, 1, 0, 0], // Face, Eyes (Tail removed from here)
  [0, 0, 1, 1, 0, 2, 2, 2, 2, 0, 0, 0], // Tail tip (Lowered), Cheeks
  [0, 1, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0], // Tail curve, Chin
  [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0], // Tail mid, Neck
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0], // Tail connect, Body, Hand
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0], // Belly
  [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], // Legs
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0], // Legs
  [0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0], // Feet
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const MONKEY_COLORS: Record<number, string> = {
  1: '#8B4513', // SaddleBrown
  2: '#FFE4C4', // Bisque
  3: '#3C2A20', // Dark Coffee Brown (Softer Eyes)
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