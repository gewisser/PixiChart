<template lang="pug">
  .px(bind:this="{px}")
</template>

<script>
  //import { onMount, onDestroy } from 'svelte';
  import { onMount } from 'svelte';
  import PiXIPloter from "./components/PiXPloter.v.2/PiXIPloter"
  import XAxis from './components/PiXPloter.v.2/XAxis'
  import Crosshair from './components/PiXPloter.v.2/Crosshair'

  let px
  let PP

  function onResize() {
    //px.style.width = window.innerWidth + "px";
    //px.style.height = window.innerHeight + "px";

    if (PP) {
      PP.resize().then();
    }
  }

  onMount(async () => {
    //window.addEventListener("resize", onResize);
    //onResize();

    PP = new PiXIPloter(document.body);

    const xAxis = new XAxis();
    xAxis.setMinTickInterval(40, 45)
    xAxis.setRange(980, 10506)
    PP.addRenderer(xAxis)

    const crosshair = new Crosshair();
    PP.addRenderer(crosshair)

    await PP.resize();



    // PP.yAxiInfoWidth = 60;
    // PP.spaceYlines = 30; // расстояние между соседними горизонтальными линиями сетки оси Y
    // PP.spaceXlines = 80;
    // PP.SetYRange(-10, 110);
    // PP.SetXRange(0, 100);
    // PP.xAxiInfoWidth = 30;
    // PP.WindowResize();
  });

  // onDestroy(() => {
  //   window.removeEventListener("resize", onResize);
  // })
</script>

<style lang="scss" global>
  @import "./css/app";

  @import "~/uikit/src/scss/variables-theme.scss";
  @import "~/uikit/src/scss/mixins-theme.scss";

  @import "~/uikit/src/scss/theme/base.scss";
  @import "~/uikit/src/scss/components/base.scss";

  //@import "~/uikit/src/scss/theme/card.scss";
  //@import "~/uikit/src/scss/components/card.scss";

  @import "~/uikit/src/scss/theme/width.scss";
  @import "~/uikit/src/scss/components/width.scss";


  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
  }
</style>

