import { expect, test } from "bun:test";

import { random } from "./grid";

test("random grid", () => {
  expect(random(10, 10)).toEqual([]);
});
