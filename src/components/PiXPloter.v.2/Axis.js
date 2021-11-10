import BaseRenderer from "./BaseRenderer";
import * as PIXI from "pixi.js";

export const GRID_LINE_NAME = "line";
export const GRID_LABEL_NAME = "label";

export default class Axis extends BaseRenderer {
  rangeMin = 0;
  rangeMax = 100;
  minPix = 40;
  rangeInterval = 45;
  _size = 30;

  onFormatLabel = function (pixPoint, value) {
    return value;
  };

  set ploter(val) {
    super.ploter = val;

    this.gridContainer = new PIXI.Container();
    val.app.stage.addChild(this.gridContainer);
  }

  get ploter() {
    return super.ploter;
  }

  set size(val) {
    this._size = val;
  }

  get size() {
    return this._size;
  }

  setMinTickInterval(minPix, interval) {
    this.minPix = minPix;
    this.rangeInterval = interval;
  }

  calcTickInterval() {
    return (
      Math.ceil(this.minPix / this.toPix(this.rangeMin + this.rangeInterval)) *
      this.rangeInterval
    );
  }

  refreshGrid() {
    const tickInterval = this.calcTickInterval();

    let incTick = Math.ceil(this.rangeMin / tickInterval) * tickInterval;

    const tickArray = [];

    while (incTick < this.rangeMax) {
      tickArray.push(incTick);
      incTick += tickInterval;
    }

    this.addGridCoordinates(tickArray);
  }

  updateGridLine(texture) {
    for (let i = 0; i < this.gridContainer.children.length; i++) {
      const gridLineContainer = this.gridContainer.children[i];

      const gridLine = gridLineContainer.getChildByName(GRID_LINE_NAME);

      if (!gridLine) {
        continue;
      }

      this.onUpdateIternalPos(gridLineContainer);

      gridLine.texture = texture;
    }
  }

  onRequestGridLineContainer() {
    return new PIXI.Container();
  }

  onUpdateLabel(gridLineLabel) {}

  onUpdateIternalPos(gridLineContainer) {}

  addGridCoordinates(arrPoints, axis = "x") {
    if (arrPoints.length < this.gridContainer.children.length) {
      for (
        let i = this.gridContainer.children.length - 1;
        i >= arrPoints.length;
        i--
      ) {
        const lineElement = this.gridContainer.children[i];
        lineElement.destroy();
      }
    }

    for (let i = 0; i < arrPoints.length; i++) {
      const pixPoint = Math.floor(this.toPix(arrPoints[i]));

      if (i > this.gridContainer.children.length - 1) {
        const gridLineContainer = this.onRequestGridLineContainer(
          pixPoint,
          arrPoints[i]
        );

        this.onUpdateIternalPos(gridLineContainer);

        const gridLineLabel = gridLineContainer.getChildByName(GRID_LABEL_NAME);
        this.onUpdateLabel(gridLineLabel, pixPoint, arrPoints[i]);

        this.gridContainer.addChild(gridLineContainer);

        continue;
      }

      const lineElement = this.gridContainer.children[i];

      lineElement[axis] = pixPoint;

      const gridLineLabel = lineElement.getChildByName(GRID_LABEL_NAME);

      if (gridLineLabel) {
        this.onUpdateLabel(gridLineLabel, pixPoint, arrPoints[i]);
      }
    }
  }

  destroy() {
    if (this.gridContainer) {
      this.gridContainer.destroy(true);
    }
  }

  setRange(min, max) {
    this.rangeMin = min;
    this.rangeMax = max;
  }
}
