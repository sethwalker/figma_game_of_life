import { random, tick, Grid } from "../grid";
import * as blessed from "neo-blessed";

let grid = random(30, 15);
if ("palomino") {
  grid = new Grid(30, 15);
  grid.populate(15, 5);
  grid.populate(16, 4);
  grid.populate(16, 5);
  grid.populate(16, 6);
  grid.populate(17, 6);
}

const screen = blessed.screen({
  smartCSR: true,
});

const box = blessed.box({
  parent: screen,
  top: "center",
  left: "center",
  width: "90%",
  height: "90%",
  content: "",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "white",
    bg: "black",
    border: {
      fg: "#f0f0f0",
    },
    hover: {
      bg: "green",
    },
  },
});

screen.append(box);

setInterval(() => {
  for (let row of grid) {
    let top = row
      .map((cell) => {
        return cell.populated
          ? "{white-bg}{white-fg}1{/white-fg}{/white-bg}"
          : "{black-bg}{black-fg}0{/black-fg}{/black-bg}";
      })
      .join("");
    // console.log(top);
    box.insertLine(1, top);
  }
  screen.render();
  grid = tick(grid);
  box.setContent("");
}, 1000);

screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

screen.render();
