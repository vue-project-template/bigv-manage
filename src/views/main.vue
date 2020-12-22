<template>
  <div id="hmain" class="h-main">
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
export default {
  name: "hMain",
  data() {
    return {
    };
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.resize();
  },
  methods: {
    resize() {
      let { scaleWid, scaleHei } = this.computedScale();
      document.body.setAttribute(
        "style",
        `width: 1920px;height: 1080px;transform:scale(${scaleWid}, ${scaleHei});transform-origin: left top;`
      );
    },
    computedScale() {
      let wid = window.innerWidth;
      let hei = window.innerHeight;
      let scaleWid = wid / 1920;
      let scaleHei = hei / 1080;
      return { scaleWid, scaleHei };
    }
  }
};
</script>

<style lang="less">
.h-main {
  height: 100%;

  & > .logo {
    background: transparent;
    width: 100px;
    height: 35px;
    position: absolute;
    transform: translateX(-98px);
    z-index: 99;

    &.show {
      animation-name: logo-show;
      animation-duration: 300ms;
      animation-delay: 300ms;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }

    &.hide {
      display: none;
    }
  }

  header {
    height: 45px;
    overflow: hidden;
    z-index: 999;
    position: fixed;
    width: 100%;

    &.hide {
      animation-name: header-hide;
      animation-duration: 300ms;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }

    &.show {
      animation-name: header-show;
      animation-duration: 300ms;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }
  }

  section {
    width: 100%;
    height: 100%;
    position: absolute;

    &.max {
      animation-name: section-max;
      animation-duration: 300ms;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }

    &.min {
      animation-name: section-min;
      animation-duration: 300ms;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }
  }

  @keyframes header-hide {
    from {
      height: 45px;
    }
    to {
      height: 0;
    }
  }

  @keyframes header-show {
    from {
      height: 0;
    }
    to {
      height: 45px;
    }
  }

  @keyframes section-max {
    from {
      height: calc(100% - 45px);
    }
    to {
      height: 100%;
    }
  }

  @keyframes section-min {
    from {
      height: 100%;
    }
    to {
      height: calc(100% - 45px);
    }
  }

  @keyframes logo-show {
    from {
      transform: translate(-98px, 0);
      display: block;
    }
    to {
      transform: translate(5px, 5px);
      display: block;
    }
  }
}
</style>