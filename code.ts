// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in FigJam
if (figma.editorType === "figjam" || figma.editorType === "figma") {
  // This plugin will open a window to prompt the user to enter a number, and
  // it will then create that many shapes and connectors on the screen.

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);

  function createShapes(count: number, section?: SectionNode) {
    const numberOfShapes = count;
    const nodes: SceneNode[] = [];
    for (let i = 0; i < numberOfShapes; i++) {
      let shape;
      if (figma.editorType === "figma") {
        shape = figma.createRectangle();
        shape.x = i * 150;
      } else {
        shape = figma.createShapeWithText();
        shape.shapeType = "SQUARE";
        shape.x = i * (shape.width + 200);
        shape.y = i * (shape.height + 200);
      }
      // You can set shapeType to one of: 'SQUARE' | 'ELLIPSE' | 'ROUNDED_RECTANGLE' | 'DIAMOND' | 'TRIANGLE_UP' | 'TRIANGLE_DOWN' | 'PARALLELOGRAM_RIGHT' | 'PARALLELOGRAM_LEFT'
      shape.fills = [
        { type: "SOLID", color: { r: 1, g: 0.5, b: Math.random() } },
      ];
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

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = (msg: { type: string; count: number }) => {
    if (msg.type === "create-shapes") {
      let section = undefined;
      if (
        figma.currentPage.selection[0] &&
        "SECTION" === figma.currentPage.selection[0].type
      ) {
        section = figma.currentPage.selection[0];
        // fill the section
      }

      // One way of distinguishing between different types of messages sent from
      // your HTML page is to use an object with a "type" property like this.
      setInterval(function () {
        createShapes(msg.count, section);
      }, 2000);
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    //    figma.closePlugin();
  };
}
