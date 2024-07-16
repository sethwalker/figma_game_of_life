import { random, tick, Grid } from "./grid";

const nodes: SceneNode[] = [];
const nodePool: SceneNode[] = [];
let grid: Grid;
let size: number;

if (figma.editorType === "figjam" || figma.editorType === "figma") {
  figma.showUI(__html__);

  let timer: number;
  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = (msg: { type: string; size: number; speed: number }) => {
    if (msg.type === "clear") {
      grid && grid.reset();
      clearInterval(timer);
      nodes.forEach((node) => (node.visible = false));
      nodePool.concat(nodes);
      nodes.length = 0;
    }
    if (msg.type === "stop") {
      clearInterval(timer);
    }
    if (msg.type === "run") {
      let section = undefined;
      if (
        figma.currentPage.selection[0] &&
        "SECTION" === figma.currentPage.selection[0].type
      ) {
        section = figma.currentPage.selection[0];
        // fill the section
      }

      if (!grid || grid.isEmpty() || size !== msg.size) {
        size = msg.size;
        const numCellsX = Math.round((section ? section.width : 1000) / size);
        const numCellsY = Math.round((section ? section.height : 1000) / size);
        grid = random(numCellsX, numCellsY);
        section?.children.forEach((child) => {
          if (child.getPluginData("onfirstrender") === "remove") {
            child.remove();
          }
        });
      }
      render(grid, section);
      timer = setInterval(function () {
        grid = tick(grid);
        render(grid, section);
      }, msg.speed * 1000);
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    //    figma.closePlugin();
  };
}

function render(grid: Grid, section?: SectionNode) {
  const gridWidth = section ? section.width : 1000;
  const gridHeight = section ? section.height : 1000;
  const cellWidth = gridWidth / grid.width;
  const cellHeight = gridHeight / grid.height;

  nodes.forEach((node) => (node.visible = false));
  nodePool.concat(nodes);
  nodes.length = 0;

  for (const [key, cell] of grid.cells.entries()) {
    if (!cell.populated) {
      continue;
    }
    const [x, y] = key.split(",").map(Number);
    let shape;
    if (figma.editorType === "figma") {
      shape = (nodePool.pop() as RectangleNode) || figma.createRectangle();
    } else {
      shape =
        (nodePool.pop() as ShapeWithTextNode) || figma.createShapeWithText();
      shape.shapeType = "SQUARE";
    }
    shape.x = x * cellWidth;
    shape.y = y * cellHeight;
    shape.resize(cellWidth, cellHeight);
    // You can set shapeType to one of: 'SQUARE' | 'ELLIPSE' | 'ROUNDED_RECTANGLE' | 'DIAMOND' | 'TRIANGLE_UP' | 'TRIANGLE_DOWN' | 'PARALLELOGRAM_RIGHT' | 'PARALLELOGRAM_LEFT'
    shape.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    shape.visible = true;
    shape.setPluginData("onfirstrender", "remove");
    if (section) {
      section.appendChild(shape);
    } else {
      figma.currentPage.appendChild(shape);
    }

    nodes.push(shape);
  }

  /*
    for (let i = 0; i < numberOfShapes - 1; i++) {
      const connector = figma.createConnector();
      connector.strokeWeight = 8;

      connector.connectorStart = {
        endpointNodeId: nodes[i].id,
        magnet: "AUTO",
      };

      connector.connectorEnd = {
        endpointNodeId: nodes[i + 1].id,
        magnet: "AUTO",
      };
    }
    */

  //figma.viewport.scrollAndZoomIntoView(nodes);
}
