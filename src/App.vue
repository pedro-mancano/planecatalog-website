<template>
  <div id="app">
    <router-view />
    <div v-if="!$production" class="devWarning">
      <p>Development Version</p>
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  overflow-y: hidden !important;
  height: 100%;
}

.devWarning {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ff0000;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
  z-index: 9999;
}

.devWarning:hover {
  opacity: 0;
}

#app {
  height: 100%;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #b3afb3;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b3afb3;
}

::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 15px;
  box-shadow: inset 0px 0px 0px 0px #f0f0f0;
}

@import "bulma/sass/utilities/functions";
@import "bulma/sass/utilities/initial-variables";
@import "@/assets/styles.scss";

$speed-slow: 150ms !default;
$speed-slower: 250ms !default;

$info: #167df0 !default;

$input-arrow: $primary !default;

$link: $primary !default;
$link-invert: $primary-invert !default;
$link-visited: $grey !default;
$link-focus-border: $primary !default;

$label-weight: $weight-semibold !default;

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
    this.$store.commit("updateLanguage");
  },
};
</script>
