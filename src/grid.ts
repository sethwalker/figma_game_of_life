class Cell {
  state: "populated" | "unpopulated";

  constructor(state: "populated" | "unpopulated") {
    this.state = state;
  }

  get populated(): boolean {
    return "populated" === this.state;
  }
}

type Position = [x: number, y: number];

export class Grid {
  width: number;
  height: number;
  cells: Map<string, Cell>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = new Map();
  }

  reset() {
    this.cells = new Map();
  }

  isEmpty() {
    return this.cells.size === 0;
  }

  populate(x: number, y: number) {
    this.set([x, y], new Cell("populated"));
  }

  key(position: Position) {
    return `${position[0]},${position[1]}`;
  }

  get(position: Position) {
    return this.cells.get(this.key(position)) || new Cell("unpopulated");
  }

  set(position: Position, cell: Cell) {
    if (
      position[0] < 0 ||
      position[1] < 0 ||
      position[0] > this.width ||
      position[1] > this.height
    ) {
      return this.cells;
    }
    return this.cells.set(this.key(position), cell);
  }

  *[Symbol.iterator]() {
    for (let j = 0; j < this.height; j++) {
      let row = new Array(this.width);
      for (let i = 0; i < this.width; i++) {
        row[i] = this.get([i, j]);
      }
      yield row;
    }
  }
}

export function random(width: number, height: number) {
  const grid = new Grid(width, height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (Math.round(0.1 + Math.random())) {
        grid.populate(x, y);
      }
    }
  }

  return grid;
}

export function tick(grid: Grid): Grid {
  let next = new Grid(grid.width, grid.height);
  for (let i = 0; i < grid.width; i++) {
    for (let j = 0; j < grid.height; j++) {
      let cell = grid.get([i, j]);
      let neighbors: Position[] = [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],

        [i, j - 1],
        [i, j + 1],

        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
      let count = neighbors.reduce((n, neighbor) => {
        if (grid.get(neighbor).populated) {
          return n + 1;
        }
        return n;
      }, 0);
      //console.log("cell", i, j, "neighbors", count);
      if (
        (cell.populated && [2, 3].includes(count)) ||
        (!cell.populated && count === 3)
      ) {
        next.populate(i, j);
      }
    }
  }
  return next;
}
