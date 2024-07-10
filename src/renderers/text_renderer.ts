import { Grid, random } from "../grid";

export function render(grid: Grid) {
  for (let row of grid) {
    console.log(
      row
        .map((cell) => {
          return "populated" === cell.state
            ? "\x1b[47m\x1b[37m1\x1b[0m"
            : "\x1b[40m\x1b[30m0\x1b[0m";
        })
        .join("")
    );
  }
}
