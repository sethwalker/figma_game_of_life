import { expect, test } from "bun:test";

import { Grid, tick } from "./grid";

test("smol", () => {
  let start = new Grid(2, 2);
  start.populate(0, 0);
  start.populate(0, 1);
  start.populate(1, 0);
  start.populate(1, 1);
  expect(tick(start)).toEqual(start);
});

test("pentamino", () => {
  let start = new Grid(10, 7);
  /*
  0000000000
  0000000000
  0000100000
  0001100000
  0000110000
  0000000000
  0000000000
  */
  start.populate(4, 2);
  start.populate(3, 3);
  start.populate(3, 4);
  start.populate(4, 5);
  start.populate(5, 5);
  let next = tick(start);
  expect(next).toEqual(new Grid(1, 1));
});
