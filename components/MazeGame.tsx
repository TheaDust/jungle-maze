import React, { useEffect, useRef, useState, useCallback } from 'react';
import { generateMaze } from '../utils/mazeGenerator';
import { GRID_SIZE, CELL_SIZE, COLORS, MONKEY_SPRITE, MONKEY_COLORS, BANANA_SPRITE, BANANA_COLORS, VIEWPORT_PADDING } from '../constants';
import { Grid, GameState, Position } from '../types';

// Pre-rendering sprites to offscreen canvases for performance
const createPixelSprite = (spriteMap: number[][], colorMap: Record<number, string>) => {
  const canvas = document.createElement('canvas');
  const size = spriteMap.length;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const colorKey = spriteMap[y][x];
      if (colorKey !== 0) {
        ctx.fillStyle = colorMap[colorKey];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return canvas;
};

const monkeyCanvas = createPixelSprite(MONKEY_SPRITE, MONKEY_COLORS);
const bananaCanvas = createPixelSprite(BANANA_SPRITE, BANANA_COLORS);

const MazeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game State
  const [grid, setGrid] = useState<Grid | null>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [gameState, setGameState] = useState<GameState>(GameState.GENERATING);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Input State
  const keysPressed = useRef<Set<string>>(new Set());
  const lastMoveTime = useRef<number>(0);
  const MOVE_DELAY = 60; // ms between moves when holding key
  const VISUAL_POS_LERP = 0.3; // Speed of visual catchup (0-1)

  // Visual State (for smooth rendering)
  const visualPos = useRef<Position>({ x: 0, y: 0 });

  // Initialize Game
  useEffect(() => {
    const initGame = async () => {
      // Use setTimeout to allow UI to render "Generating..." state
      setTimeout(() => {
        const newGrid = generateMaze(GRID_SIZE, GRID_SIZE);
        setGrid(newGrid);
        setPlayerPos({ x: 0, y: 0 });
        visualPos.current = { x: 0, y: 0 };
        setGameState(GameState.PLAYING);
        setStartTime(Date.now());
      }, 100);
    };

    initGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState === GameState.PLAYING) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  // Input Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        keysPressed.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Movement Logic
  const attemptMove = useCallback((dx: number, dy: number) => {
    if (!grid) return;
    
    setPlayerPos(prev => {
      const currentCell = grid[prev.y][prev.x];
      
      // Check walls
      if (dx === 0 && dy === -1 && currentCell.walls.top) return prev;
      if (dx === 1 && dy === 0 && currentCell.walls.right) return prev;
      if (dx === 0 && dy === 1 && currentCell.walls.bottom) return prev;
      if (dx === -1 && dy === 0 && currentCell.walls.left) return prev;

      const newX = prev.x + dx;
      const newY = prev.y + dy;

      // Check bounds (redundant if walls are correct, but safe)
      if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) return prev;

      // Check Win Condition
      if (newX === GRID_SIZE - 1 && newY === GRID_SIZE - 1) {
        setGameState(GameState.WON);
      }

      return { x: newX, y: newY };
    });
  }, [grid]);

  // Game Loop (Input & Rendering)
  useEffect(() => {
    let animationFrameId: number;

    const loop = (time: number) => {
      if (gameState === GameState.PLAYING && grid) {
        // 1. Handle Continuous Input
        if (time - lastMoveTime.current > MOVE_DELAY) {
          let dx = 0;
          let dy = 0;
          const keys = keysPressed.current;

          if (keys.has('ArrowUp') || keys.has('w')) dy = -1;
          else if (keys.has('ArrowDown') || keys.has('s')) dy = 1;
          else if (keys.has('ArrowLeft') || keys.has('a')) dx = -1;
          else if (keys.has('ArrowRight') || keys.has('d')) dx = 1;

          if (dx !== 0 || dy !== 0) {
            attemptMove(dx, dy);
            lastMoveTime.current = time;
          }
        }

        // 2. Smooth Visual Interpolation
        // Simple Lerp
        visualPos.current.x += (playerPos.x - visualPos.current.x) * VISUAL_POS_LERP;
        visualPos.current.y += (playerPos.y - visualPos.current.y) * VISUAL_POS_LERP;
      }
      
      // 3. Render
      renderCanvas();
      
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, grid, playerPos, attemptMove]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !grid) return;

    // Responsive Canvas Size
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    }

    const { width, height } = canvas;
    const vX = visualPos.current.x;
    const vY = visualPos.current.y;

    // Clear background
    ctx.fillStyle = COLORS.WALL_DARK;
    ctx.fillRect(0, 0, width, height);

    // Calculate Viewport
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Offset to center the player
    // visualPos is in Grid Units. 
    // Pixel offset = -visualPos * CELL_SIZE
    const offsetX = centerX - vX * CELL_SIZE - (CELL_SIZE / 2);
    const offsetY = centerY - vY * CELL_SIZE - (CELL_SIZE / 2);

    // Determine visible grid range
    const colsVisible = Math.ceil(width / CELL_SIZE) + VIEWPORT_PADDING * 2;
    const rowsVisible = Math.ceil(height / CELL_SIZE) + VIEWPORT_PADDING * 2;

    const startX = Math.floor(vX - colsVisible / 2);
    const endX = Math.floor(vX + colsVisible / 2);
    const startY = Math.floor(vY - rowsVisible / 2);
    const endY = Math.floor(vY + rowsVisible / 2);

    // Draw Floor & Walls
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        if (y < 0 || y >= GRID_SIZE || x < 0 || x >= GRID_SIZE) continue;

        const px = Math.floor(x * CELL_SIZE + offsetX);
        const py = Math.floor(y * CELL_SIZE + offsetY);
        const cell = grid[y][x];

        // Floor
        ctx.fillStyle = COLORS.FLOOR;
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        
        // Floor Texture/Detail (Simple Noise)
        if ((x + y) % 3 === 0) {
            ctx.fillStyle = COLORS.FLOOR_HIGHLIGHT;
            ctx.fillRect(px + 10, py + 10, 4, 4);
        }

        // Walls
        ctx.fillStyle = COLORS.WALL_DARK;
        const wallThickness = 4;

        if (cell.walls.top) ctx.fillRect(px, py, CELL_SIZE, wallThickness);
        if (cell.walls.bottom) ctx.fillRect(px, py + CELL_SIZE - wallThickness, CELL_SIZE, wallThickness);
        if (cell.walls.left) ctx.fillRect(px, py, wallThickness, CELL_SIZE);
        if (cell.walls.right) ctx.fillRect(px + CELL_SIZE - wallThickness, py, wallThickness, CELL_SIZE);

        // Corner fill for aesthetic continuity of walls
        ctx.fillStyle = COLORS.WALL_DARK;
        ctx.fillRect(px, py, wallThickness, wallThickness);
        ctx.fillRect(px + CELL_SIZE - wallThickness, py, wallThickness, wallThickness);
        ctx.fillRect(px, py + CELL_SIZE - wallThickness, wallThickness, wallThickness);
        ctx.fillRect(px + CELL_SIZE - wallThickness, py + CELL_SIZE - wallThickness, wallThickness, wallThickness);

        // Moss/Vine details
        ctx.fillStyle = COLORS.WALL_LIGHT;
        if (cell.walls.top && x % 2 === 0) ctx.fillRect(px + 8, py, 4, wallThickness);
        if (cell.walls.left && y % 3 === 0) ctx.fillRect(px, py + 12, wallThickness, 6);
      }
    }

    // Draw Goal (Banana)
    const goalX = GRID_SIZE - 1;
    const goalY = GRID_SIZE - 1;
    // Basic Frustum culling for goal
    if (goalX >= startX && goalX <= endX && goalY >= startY && goalY <= endY) {
        const px = Math.floor(goalX * CELL_SIZE + offsetX + CELL_SIZE * 0.25);
        const py = Math.floor(goalY * CELL_SIZE + offsetY + CELL_SIZE * 0.25);
        // Draw sprite scaled
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(bananaCanvas, px, py, CELL_SIZE/2, CELL_SIZE/2);
        
        // Shine effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'yellow';
        ctx.beginPath();
        ctx.arc(px + CELL_SIZE/4, py + CELL_SIZE/4, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.fill();
        ctx.shadowBlur = 0;
    }


    // Draw Player (Monkey)
    // Interpolated pixel position
    const pPx = Math.floor(vX * CELL_SIZE + offsetX + CELL_SIZE * 0.2);
    const pPy = Math.floor(vY * CELL_SIZE + offsetY + CELL_SIZE * 0.2);
    
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(monkeyCanvas, pPx, pPy, CELL_SIZE * 0.6, CELL_SIZE * 0.6);

    // Vignette / Fog of War effect
    const gradient = ctx.createRadialGradient(centerX, centerY, Math.min(width, height) * 0.3, centerX, centerY, Math.min(width, height) * 0.8);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center font-mono">
      {/* HUD */}
      {gameState === GameState.PLAYING && (
        <div className="absolute top-4 left-4 z-10 bg-slate-800/80 border border-emerald-600 text-emerald-100 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <h1 className="text-xl font-bold text-emerald-400 mb-2">Jungle Maze</h1>
            <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between w-40">
                    <span>TIME:</span>
                    <span className="font-bold text-white">{formatTime(elapsedTime)}</span>
                </div>
                <div className="flex justify-between w-40">
                    <span>POS:</span>
                    <span className="font-bold text-white">X:{playerPos.x} Y:{playerPos.y}</span>
                </div>
                <div className="flex justify-between w-40">
                    <span>GOAL:</span>
                    <span className="font-bold text-yellow-400">X:{GRID_SIZE-1} Y:{GRID_SIZE-1}</span>
                </div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
                Use Arrow Keys or WASD to move.
            </div>
        </div>
      )}

      {/* Loading Screen */}
      {gameState === GameState.GENERATING && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900 text-emerald-500">
          <div className="text-center">
            <div className="text-4xl animate-bounce mb-4">🌿</div>
            <h2 className="text-2xl font-bold">Generating 200x200 Jungle...</h2>
            <p className="text-sm mt-2 text-slate-500">Planting trees & placing mossy stones</p>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameState === GameState.WON && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-slate-800 border-2 border-yellow-500 p-8 rounded-2xl shadow-2xl text-center max-w-md animate-fade-in-up">
            <div className="text-6xl mb-4">🍌</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-2">YOU FOUND IT!</h2>
            <p className="text-slate-300 mb-6">The legendary Golden Banana is yours.</p>
            
            <div className="bg-slate-900 p-4 rounded-lg mb-6 border border-slate-700">
                <p className="text-emerald-400 text-sm">COMPLETION TIME</p>
                <p className="text-3xl font-mono text-white">{formatTime(elapsedTime)}</p>
            </div>

            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
                Play Again
            </button>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div ref={containerRef} className="w-full h-full relative cursor-crosshair overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
};

export default MazeGame;