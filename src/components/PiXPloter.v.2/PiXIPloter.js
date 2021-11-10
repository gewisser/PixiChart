//import * as PIXI from "./pixiExport.js";
import * as PIXI from "pixi.js";

export default class PiXIPloter {
  constructor(container) {
    this.container = container;
    this.renderers = [];

    this.containerX = 800;
    this.containerY = 600;

    this.app = new PIXI.Application({
      antialias: false,
      resizeTo: container,
      backgroundAlpha: 0,
      //clearBeforeRender: false,
      //preserveDrawingBuffer: true,
      //legacy: true,
    });

    container.appendChild(this.app.view);

    this.app.renderer.on("resize", (w, h) => {
      //console.log(w, h);
      this.resize().then();
    });
  }

  async resize() {
    this.containerX = this.container.clientWidth;
    this.containerY = this.container.clientHeight;

    // console.log(this.containerX, this.containerY);

    await this.render(true);
  }

  async render(dirty = false) {
    await this.loadFonts();

    this.renderers.forEach((renderer) => {
      renderer.redraw(dirty);
    });

    // this.RenderOverlay();
    // this.RenderYAxis();
    // this.RenderXAxis();
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

  addRenderer(renderer) {
    renderer.ploter = this;
    this.renderers.push(renderer);
  }
}
