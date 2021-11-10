import Axis, { GRID_LINE_NAME, GRID_LABEL_NAME } from "./Axis";
//import * as PIXI from "./pixiExport.js";
import * as PIXI from "pixi.js";

export default class XAxis extends Axis {
  marginRight = 60; // отступ справа

  /**
   * Координаты области оси X текстом и метками
   */
  getArea() {
    return {
      x1: 0,
      x2: this.ploter.containerX - this.marginRight,
      y1: this.ploter.containerY - this._size,
      y2: this.ploter.containerY,
    };
  }

  toPix(val) {
    return this.map(
      val,
      this.rangeMin,
      this.rangeMax,
      0,
      this.ploter.containerX - this.marginRight
    );
  }

  toVal(val) {
    const { x1, x2 } = this.getArea();

    return this.map(val, x1, x2, this.rangeMin, this.rangeMax);
  }

  onUpdateIternalPos(gridLineContainer) {
    const gridLineLabel = gridLineContainer.getChildByName(GRID_LABEL_NAME);

    const { y1 } = this.getArea();
    gridLineLabel.y = y1 + 10;
  }

  onRequestGridLineContainer(x) {
    const gridLineTexture = this.createTextureGridLine();

    const gridLine = new PIXI.Sprite(gridLineTexture);
    gridLine.name = GRID_LINE_NAME;

    const label = new PIXI.BitmapText(undefined, {
      fontName: "Arial",
      fontSize: -12,
    });
    label.name = GRID_LABEL_NAME;

    const cotainer = new PIXI.Container();
    cotainer.addChild(gridLine, label);

    cotainer.x = x;

    return cotainer;
  }

  onUpdateLabel(bitmapText, pixPoint, value) {
    bitmapText.text = this.onFormatLabel(pixPoint, value);
    bitmapText.x = -Math.floor(bitmapText.textWidth / 2);
  }

  createTextureGridLine(dirty = false) {
    if (!this.textureGridLine || dirty) {
      const { y1 } = this.getArea();

      const pg = new PIXI.Graphics();
      pg.lineStyle(1, 0x2f3240, 1);
      pg.moveTo(0, 0);
      pg.lineTo(0, y1);
      pg.closePath();

      pg.lineStyle(1, 0x838383, 1);
      pg.moveTo(0, y1);
      pg.lineTo(0, y1 + 5);
      pg.closePath();

      if (this.textureGridLine) {
        this.textureGridLine.destroy(true);
        this.textureGridLine = undefined;
      }

      this.textureGridLine = this.ploter.app.renderer.generateTexture(pg);
    }

    return this.textureGridLine;
  }

  createX() {
    const { x1, x2, y1, y2 } = this.getArea();

    const pg = new PIXI.Graphics();
    /**
     * Отрисовка горизонталной оси X
     */
    pg.lineStyle(1, 0x828282, 1);
    pg.moveTo(0, 0);
    pg.lineTo(this.ploter.containerX, 0);
    pg.closePath();

    if (this.bgTexture) {
      this.ploter.app.stage.removeChild(this.bgTexture);
      this.bgTexture.destroy(true);
      this.bgTexture = undefined;
    }

    this.bgTexture = new PIXI.Sprite(
      this.ploter.app.renderer.generateTexture(pg)
    );

    this.bgTexture.x = x1;
    this.bgTexture.y = y1;

    this.ploter.app.stage.addChild(this.bgTexture);
  }

  redraw(dirty) {
    if (dirty) {
      this.createX();
      this.updateGridLine(this.createTextureGridLine(dirty));
    }

    this.refreshGrid();
  }
}
