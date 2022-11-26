<template>
  <div id="content">
    <div :class="`sidebar ${scrollbarActiveMobile ? 'sidebar-active-mobile' : ''
    }`">
      <img alt="Logo" class="logo" src="@/assets/plane_logo.png" />

      <b-button v-for="(item, index) in buttons" :key="index" :type="getButtonType(item.view)" :icon-left="item.icon"
        @click="goToPage(item.view)" expanded>
        {{ $t(item.name) }}
      </b-button>

      <div class="bottom">
        <div>
          <b-dropdown aria-role="list" expanded position="is-top-left">
            <template #trigger>
              <b-button :label="$t('unitofmeasure')" type="is-primary is-light" icon-left="balance-scale-right"
                expanded />
            </template>

            <b-dropdown-item v-for="(unit, unitIndex) in units" :key="unitIndex" @click="changeUnit(unitIndex)">
              {{ unit.custom ? unit.label : $t(unit.label) }}
            </b-dropdown-item>

            <b-dropdown-item custom aria-role="listitem">
              <b-button :label="$t('createunit')" @click="unitChange" type="is-primary" expanded />
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div>
          <b-dropdown aria-role="list" expanded position="is-top-left">
            <template #trigger>
              <b-button :label="$t('language')" type="is-primary is-light" icon-left="language" expanded>
              </b-button>
            </template>

            <b-dropdown-item v-for="(language, languageIndex) in languages" :key="languageIndex"
              @click="changeLanguage(language)">
              <div class="languageSelect">
                <img class="languageSelectImg" :src="require(`@/assets/flags/${language}.svg`)" :alt="language" />
                <span>{{ $t(`languageList.${language}`) }}</span>
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>

      <div v-if="isMobile" class="sidebar-swtich">
        <b-button @click="toggleSidebar" icon-left="bars" type="is-light" />
      </div>
    </div>
    <div class="view-out">
      <div class="header">
        <BreadcrumbHeader />
      </div>
      <div class="view">
        <router-view />
      </div>
      <div class="sidebar-background" v-if="scrollbarActiveMobile" @click="toggleSidebar"></div>
    </div>
  </div>
</template>

<script>
import BreadcrumbHeader from '../../components/BreadcrumbHeader.vue';
export default {
  components: { BreadcrumbHeader },
  data() {
    return {
      buttons: [
        {
          view: "plane.home",
          name: "home",
          icon: "home",
        },
        {
          view: "plane.search",
          name: "search",
          icon: "plane-departure",
        },
        {
          view: "plane.catalog",
          name: "catalog",
          icon: "list-ul",
        },
      ],
      scrollbarActiveMobile: false,
    };
  },
  computed: {
    languages() {
      return Object.keys(this.$i18n.messages);
    },
    units() {
      return this.$store.getters.getUnitList;
    },
    getUnit(name) {
      return this.$store.getters.getUnit(name);
    },
  },
  methods: {
    changeUnit(unit) {
      this.$store.commit("changeUnit", unit);
    },
    getButtonType(name) {
      if (name == this.$route.name) {
        return "is-primary";
      } else {
        return "is-primary is-light";
      }
    },
    goToPage(name) {
      if (name == this.$route.name) return;
      this.$router.push({
        name,
      });
      if (this.isMobile()) {
        this.toggleSidebar();
      }
    },
    changeLanguage(language) {
      this.$store.commit("setLanguage", language);
      this.$root.$emit("languageChanged");
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    toggleSidebar() {
      this.scrollbarActiveMobile = !this.scrollbarActiveMobile;
    },
    unitChange() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `${this.$t("wip")}`,
        position: "is-bottom",
        type: `is-warning`,
      });
    },
  }
};
</script>

<style lang="scss" scoped>
#content {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar-background {
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000cc;
    z-index: 998;
  }
}

:deep(button > span:last-child:not(.icon)) {
  width: 100%;
  white-space: pre;
}

:deep(button > span:is(.icon)) {
  margin-left: calc(-0.5em + 1px) !important;
}

.languageSelect {
  display: flex;
  align-items: center;

  & .languageSelectImg {
    height: 25px;
    width: auto;
    margin-right: 10px;
    min-width: 40px;
  }
}

.sidebar {
  width: 240px;
  min-width: 240px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  left: 0px;

  //deep(> .b-button) {

  & .sidebar-swtich {
    display: none;
  }

  @media (max-width: 768px) {
    position: absolute;
    z-index: 999;
    background: white;
    height: 100%;
    left: -240px;
    transition: left ease-in-out 0.3s;

    & .sidebar-swtich {
      position: absolute;
      top: 20px;
      width: 40px;
      height: 40px;
      left: 220px;
      display: block;
    }

    &.sidebar-active-mobile {
      left: 0px !important;
    }
  }

  & .logo {
    margin-top: 40px;
    margin-bottom: 40px;
  }

  & button {
    margin-bottom: 8px;
  }
}

.view-out {
  flex: 1 auto;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100vw;
  }

  & .header {
    height: auto;
    font-size: 2.25rem;
    margin-bottom: 20px;
    text-transform: capitalize;
    padding: 20px 20px 0px 20px;

    @media screen and (max-width: 768px) {
      margin-bottom: 0px;
      padding: 11px 20px 0px 20px;
    }
  }

  & .view {
    padding: 20px 20px 0px 20px;
    overflow: auto;
    height: 100%;

    @media screen and (max-width: 768px) {
      padding: 20px;
    }
  }
}

.logo {
  width: 180px;
}

.bottom {
  margin-top: auto;
  width: 100%;
}
</style>

<style lang="scss">
@import "bulma/sass/utilities/functions";
@import "bulma/sass/utilities/initial-variables";
@import "./node_modules/buefy/src/scss/utils/_functions.scss";

$primary: #317ada;
$primary-invert: findColorInvert($primary);
$primary-light: findLightColor($primary);
$primary-dark: findDarkColor($primary);

:root {
  --primary: #{$primary};
  --primary-invert: #{$primary-invert};
  --primary-light: #{$primary-light};
  --primary-dark: #{$primary-dark};
}

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