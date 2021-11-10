import BaseRenderer from "./BaseRenderer";
import * as PIXI from "pixi.js";
import XAxis from "./XAxis";

export default class Crosshair extends BaseRenderer {
  crosshairContainer = undefined;

  set ploter(val) {
    super.ploter = val;

    this.crosshairContainer = new PIXI.Container();
    this.crosshairContainer.interactive = true;
    this.crosshairContainer.on("pointerout", (event) => {
      console.log("pointerout");
    });
    this.crosshairContainer.on("pointerover", (event) => {
      console.log("pointerover");
    });

    val.app.stage.addChild(this.crosshairContainer);
  }

  get ploter() {
    return super.ploter;
  }

  getArea() {
    if (!this.ploter) {
      return { x1: 0, x2: 0, y1: 0, y2: 0 };
    }

    const xAxis = this.ploter.renderers.find(
      (renderer) => renderer instanceof XAxis
    );

    const { x2, y1 } = xAxis.getArea();

    return {
      x1: 0,
      x2: x2,
      y1: 0,
      y2: y1,
    };
  }

  redraw(dirty) {
    const { x1, x2, y1, y2 } = this.getArea();

    console.log(x2, y2);
    console.log("===");

    this.crosshairContainer.hitArea = new PIXI.Rectangle(
      x1,
      y1,
      x2 - x1,
      y2 - y1
    );
  }

  destroy() {
    if (this.crosshairContainer) {
      this.crosshairContainer.destroy(true);
    }
  }
}
