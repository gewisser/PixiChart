import * as PIXI from "pixi.js";

export default class {
  constructor(container) {
    this.OnDrawOverlay_ = undefined;

    this.yAxiInfoWidth_ = 70;
    this.xAxiInfoWidth_ = 40;

    this.YRangeMIN = 0;
    this.YRangeMAX = 100;

    this.XRangeMIN = 0;
    this.XRangeMAX = 100;

    this.spaceYlines_ = 50;
    this.spaceXlines_ = 50;

    this.container = container;

    this.YAxis = undefined;
    this.XAxis = undefined;
    this.Overlay = undefined;

    this.containerX = 800;
    this.containerY = 600;

    this.app = new PIXI.Application({
      antialias: false,
      resizeTo: container,
    });

    container.appendChild(this.app.view);

    // this.sprites = new PIXI.ParticleContainer(10000, {
    //     scale: true,
    //     position: true,
    //     rotation: true,
    //     uvs: true,
    //     alpha: true,
    // });

    //this.app.stage.addChild(this.sprites);

    //this.sprites = this.app.stage

    // const loader = new PIXI.Loader();
    //
    // loader.add ('Arial', '/font/font.fnt');
    // loader.load(()=>{
    //     //this.WindowResize();
    // });

    //this.WindowResize();
  }

  map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  y2pix(val) {
    return this.map(val, this.YRangeMAX, this.YRangeMIN, 0, this.containerY);
  }

  pix2y(val) {
    const { y1, y2 } = this.getYInfoArea();

    return this.map(val, y2, y1, this.YRangeMIN, this.YRangeMAX);
  }

  x2pix(val) {
    return this.map(val, this.XRangeMAX, this.XRangeMIN, 0, this.containerX);
  }

  pix2x(val) {
    const { x1, x2 } = this.getXInfoArea();

    return this.map(val, x1, x2, this.XRangeMIN, this.XRangeMAX);
  }

  pixelRounding(val) {
    return parseInt(val / 0.5) * 0.5;
  }

  async loadFonts() {
    if (this.app.loader.resources.Arial) {
      return;
    }

    return new Promise((resolve) => {
      this.app.loader.add("Arial", "font/font.fnt").load(() => {
        resolve();
      });
    });
  }

  set yAxiInfoWidth(val) {
    this.yAxiInfoWidth_ = val;
  }

  get yAxiInfoWidth() {
    return this.yAxiInfoWidth_;
  }

  set xAxiInfoWidth(val) {
    this.xAxiInfoWidth_ = val;
  }

  get xAxiInfoWidth() {
    return this.xAxiInfoWidth_;
  }

  set spaceYlines(val) {
    this.spaceYlines_ = val;
  }

  get spaceYlines() {
    return this.spaceYlines_;
  }

  set spaceXlines(val) {
    this.spaceXlines_ = val;
  }

  get spaceXlines() {
    return this.spaceXlines_;
  }

  set OnDrawOverlay(val) {
    this.OnDrawOverlay_ = val;
  }

  get OnDrawOverlay() {
    return this.OnDrawOverlay_;
  }

  async Render() {
    await this.loadFonts();

    this.RenderOverlay();
    this.RenderYAxis();
    this.RenderXAxis();
  }

  SetYRange(min, max) {
    this.YRangeMIN = min;
    this.YRangeMAX = max;
  }

  SetXRange(min, max) {
    this.XRangeMIN = min;
    this.XRangeMAX = max;
  }

  WindowResize(x, y) {
    this.containerX = this.container.clientWidth;
    this.containerY = this.container.clientHeight;

    this.Render();
  }

  onDragStart(_this, event) {
    _this.dragging = true;
    _this.startDragY = event.data.global.y;
    _this.prevDragY = event.data.global.y;

    _this.startDragX = event.data.global.x;
  }

  onDragEnd(_this, event) {
    _this.dragging = false;
  }

  onDragMove(_this, event) {
    if (_this.dragging) {
      if (event.data.global.y > _this.prevDragY) {
        this.SetYRange(this.YRangeMIN - 0.25, this.YRangeMAX + 0.25);
      } else {
        this.SetYRange(this.YRangeMIN + 0.25, this.YRangeMAX - 0.25);
      }

      _this.prevDragY = event.data.global.y;
    }
  }

  /**
   * Координаты области оси Y текстом и метками
   */
  getYInfoArea() {
    return {
      x1: this.containerX - this.yAxiInfoWidth_,
      x2: this.containerX,
      y1: 0,
      y2: this.containerY - this.xAxiInfoWidth_,
    };
  }

  /**
   * Координаты области графика
   */
  getOverlayInfoArea() {
    const { x1, y2 } = this.getYInfoArea();

    return { x1: 0, x2: x1, y1: 0, y2 };
  }

  /**
   * Координаты области оси X текстом и метками
   */
  getXInfoArea() {
    return {
      x1: 0,
      x2: this.containerX - this.yAxiInfoWidth_,
      y1: this.containerY - this.xAxiInfoWidth_,
      y2: this.containerY,
    };
  }

  /**
   * Отрисовка оси Y
   */
  RenderYAxis() {
    const _this = this;

    if (this.YAxis === undefined) {
      this.YAxis = new PIXI.Graphics();
      this.YAxis.interactive = true;
      this.YAxis.on("pointerdown", (event) => _this.onDragStart(this, event))
        .on("pointerup", (event) => _this.onDragEnd(this, event))
        .on("pointerupoutside", (event) => _this.onDragEnd(this, event))
        .on("pointermove", (event) => _this.onDragMove(this, event));

      this.app.stage.addChild(this.YAxis);
    } else {
      for (let i = this.YAxis.children.length - 1; i >= 0; i--) {
        this.YAxis.children[i].destroy(true);
        this.YAxis.children.splice(i, 1);
      }

      this.YAxis.clear();
    }

    const { x1, x2, y1, y2 } = this.getYInfoArea();

    /**
     * Заливка области значений Y
     */
    this.YAxis.beginFill(0x121826);
    this.YAxis.drawRect(x1, y1, x2, y2);
    this.YAxis.endFill();

    /**
     * Отрисовка вертикальной оси Y
     */
    this.YAxis.lineStyle(1, 0x838383, 1);
    this.YAxis.moveTo(x1, y1);
    this.YAxis.lineTo(x1, y2);
    this.YAxis.closePath();

    const horizBlocksCount = (y2 / this.spaceYlines_) >> 0;

    for (let i = 1; i <= horizBlocksCount; i++) {
      //console.log('for');

      const y_ = y2 - i * this.spaceYlines_;

      /**
       * Отрисовка горизонтальной сетки
       */
      this.YAxis.lineStyle(1, 0x2f3240, 1);
      this.YAxis.moveTo(0, y_);
      this.YAxis.lineTo(x1, y_);
      this.YAxis.closePath();

      /**
       * Отрисовка метки
       */
      this.YAxis.lineStyle(1, 0x838383, 1);
      this.YAxis.moveTo(x1, y_);
      this.YAxis.lineTo(x1 + 5, y_);
      this.YAxis.closePath();

      /**
       * Отрисовка текста метки
       */
      const label = new PIXI.Text(this.pix2y(y_).toFixed(2), {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xebebeb,
      });
      label.x = x1 + 10;
      label.y = y_;
      label.anchor.set(0, 0.5);

      this.YAxis.addChild(label);
    }
  }

  /**
   * Отрисовка оси X
   */
  RenderXAxis() {
    if (this.XAxis === undefined) {
      this.XAxis = new PIXI.Graphics();

      this.app.stage.addChild(this.XAxis);
    } else {
      for (let i = this.XAxis.children.length - 1; i >= 0; i--) {
        this.XAxis.children[i].destroy(true);
        this.XAxis.children.splice(i, 1);
      }

      this.XAxis.clear();
    }

    const { x1, x2, y1, y2 } = this.getXInfoArea();

    /**
     * Заливка области значений Y
     */
    this.XAxis.beginFill(0x121826);
    this.XAxis.drawRect(x1, y1, this.containerX, y2);
    this.XAxis.endFill();

    /**
     * Отрисовка горизонталной оси X
     */
    this.XAxis.lineStyle(1, 0x838383, 1);
    this.XAxis.moveTo(x1, y1);
    this.XAxis.lineTo(this.containerX, y1);
    this.XAxis.closePath();

    const vertBlocksCount = (x2 / this.spaceXlines_) >> 0;

    for (let i = 0; i <= vertBlocksCount; i++) {
      //console.log('for');

      const x_ = x2 - i * this.spaceXlines_;

      if (i !== 0) {
        /**
         * Отрисовка горизонтальной сетки
         */
        this.XAxis.lineStyle(1, 0x2f3240, 1);
        this.XAxis.moveTo(x_, 0);
        this.XAxis.lineTo(x_, y1);
        this.XAxis.closePath();
      }

      /**
       * Отрисовка метки
       */
      this.XAxis.lineStyle(1, 0x838383, 1);
      this.XAxis.moveTo(x_, y1);
      this.XAxis.lineTo(x_, y1 + 5);
      this.XAxis.closePath();

      //break;

      /**
       * Отрисовка текста метки
       */

      const label = new PIXI.BitmapText(this.pix2x(x_).toFixed(2), {
        fontName: "Arial",
        fontSize: -12,
        tint: 0xff2525,
      });

      const offset = Math.floor(label.textWidth / 2);

      //console.log(label.width, label.textWidth);

      //const label = new PIXI.Text(this.pix2x(x_).toFixed(2), {fontFamily : 'Arial', fontSize: 11, fill : 0xEBEBEB});

      //console.log(x_, y1 + 10);
      label.x = x_ - offset;
      label.y = y1 + 10;
      //label.anchor.set(0.5, 0);

      //this.app.stage.addChild(label)

      this.XAxis.addChild(label);
    }
  }

  /**
   * Базовая отрисовка области графика
   */
  RenderOverlay() {
    if (this.Overlay === undefined) {
      this.Overlay = new PIXI.Graphics();
      this.Overlay.interactive = true;
      /*            this.YAxis
                .on('pointerdown', (event) => _this.onDragStart(this, event))
                .on('pointerup', (event) => _this.onDragEnd(this, event))
                .on('pointerupoutside', (event) => _this.onDragEnd(this, event))
                .on('pointermove', (event) => _this.onDragMove(this, event));*/

      this.app.stage.addChild(this.Overlay);
    } else {
      for (let i = this.Overlay.children.length - 1; i >= 0; i--) {
        this.Overlay.children[i].destroy(true);
        this.Overlay.children.splice(i, 1);
      }

      this.Overlay.clear();
    }

    const { x1, x2, y1, y2 } = this.getOverlayInfoArea();

    /**
     * Заливка области значений Y
     */
    this.Overlay.beginFill(0x121826);
    this.Overlay.drawRect(x1, y1, x2, y2);
    this.Overlay.endFill();
  }
}
