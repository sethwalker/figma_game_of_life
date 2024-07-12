import { random } from "../grid";
import * as blessed from "neo-blessed";

let grid = random(10, 10);
console.log(grid);

const screen = blessed.screen({
  smartCSR: true,
});

const box = blessed.box({
  parent: screen,
  top: "center",
  left: "center",
  width: "80%",
  height: "80%",
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
  grid = random(10, 10);
  box.setContent("");
  for (let row of grid) {
    let top = row
      .map((cell) => {
        return "populated" === cell.state
          ? "{white-bg}{white-fg}1{/white-fg}{/white-bg}"
          : "{black-bg}{black-fg}0{/black-fg}{/black-bg}";
      })
      .join("");
    // console.log(top);
    box.insertLine(1, top);
  }
  screen.render();
}, 2000);

screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

screen.render();
