class Cell {
  state: "populated" | "unpopulated";
  constructor(state: "populated" | "unpopulated") {
    this.state = state;
  }
}

type Position = [x: number, y: number];

class Grid {
  width: number;
  height: number;
  cells: Map<string, Cell>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = new Map();
  }

  key(position: Position) {
    return `${position[0]},${position[1]}`;
  }
  get(position: Position) {
    return this.cells.get(this.key(position)) || new Cell("unpopulated");
  }

  set(position: Position, cell: Cell) {
    return this.cells.set(this.key(position), cell);
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.height; i++) {
      let row = new Array(this.width);
      for (let j = 0; j < this.width; j++) {
        row[j] = this.get([i, j]);
      }
      yield row;
    }
  }
}

export function random(width: number, height: number) {
  let grid = new Grid(width, height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      grid.set([x, y], {
        state: Math.round(Math.random()) ? "populated" : "unpopulated",
      });
    }
  }

  return grid;
}
