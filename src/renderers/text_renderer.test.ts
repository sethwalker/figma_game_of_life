import { expect, test } from "bun:test";

import { random } from "../grid";
import { render } from "./text_renderer";

test("random grid", () => {
  expect(render(random(10, 10))).toEqual([]);
});
