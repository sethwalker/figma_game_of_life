type Cell = {
  state: "populated" | "unpopulated";
};

export type Grid = Cell[][];

export function random(width: number, height: number) {
  let grid: Grid = [];
  for (let x = 0; x < width; x++) {
    grid[x] = [];
    for (let y = 0; y < height; y++) {
      grid[x][y] = {
        state: Math.round(Math.random()) ? "populated" : "unpopulated",
      };
    }
  }

  return grid;
}
