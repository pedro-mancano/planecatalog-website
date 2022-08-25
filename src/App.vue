<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  overflow-y: hidden !important;
  height: 100%;
}

#app {
  height: 100%;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #B3AFB3;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #B3AFB3;
}

::-webkit-scrollbar-track {
  background: #F0F0F0;
  border-radius: 15px;
  box-shadow: inset 0px 0px 0px 0px #F0F0F0;
}

@import "bulma/sass/utilities/functions";
@import "bulma/sass/utilities/initial-variables";
@import "@/assets/styles.scss";

$speed-slow: 150ms !default;
$speed-slower: 250ms !default;

$info: #167df0 !default;

$input-arrow: $primary  !default;

$link: $primary  !default;
$link-invert: $primary-invert  !default;
$link-visited: $grey  !default;
$link-focus-border: $primary  !default;

$label-weight: $weight-semibold  !default;

@import "buefy/src/scss/utils/_helpers.scss";
@import "buefy/src/scss/utils/_animations.scss";
@import "bulma/bulma";
@import "buefy/src/scss/buefy";

.background-primary {
  background-color: $primary;
}

.svg-fill-primary {
  fill: $primary;
}
</style>

<script>
export default {
  created() {
    // set language from store
    //this.$i18n.locale = this.$store.state.language;
  },
}
</script>