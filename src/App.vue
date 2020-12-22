<template>
  <router-view></router-view>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  border: 0;
  font-size: 100%;
}
*::-webkit-scrollbar-track {
  background-color: #fff;
}
*::-webkit-scrollbar {
  width: 6px;
}
*::-webkit-scrollbar-thumb {
  background-color: #a9a9a9;
  border-radius: 3px;
}

html {
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
}

body {
  /* width: 1920px;
  height: 1080px; */
  width: 100%;
  height: 100%
}

#app {
  height: 100%;
}

li {
  list-style: none;
}
</style>
