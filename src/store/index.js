import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '@/plugins/vue-i18n'
import PlaneParameters from '@/assets/planeParameters.json';

Vue.use(Vuex)

const planeParameters = PlaneParameters.parameters;

function getBrowserLanguage() {
  let language = navigator.language || navigator.userLanguage;
  language = language.split('-')[0];
  return language;
}

function convertLanguage(language) {
  switch (language) {
    case 'en':
      return 'en';
    case 'pt':
      return 'pt';
    default:
      return 'en';
  }
}

export default new Vuex.Store({
  state: {
    unitList: {
      "SI": {
        name: "SI",
        label: "units:SI",
        custom: false,
        parameters: planeParameters.reduce((acc, curr) => (acc[curr.name] = {
          name: curr.name,
          unit: curr.unit,
          func: x => x,
        }, acc), {})
      },
    },
    currentUnit: localStorage.getItem('unit') || "SI",
    language: localStorage.getItem('language') || convertLanguage(getBrowserLanguage()),
    planeList: [],
  },
  getters: {
    getUnitList: state => {
      return state.unitList;
    },
    getUnit: state => unitName => {
      return state.unitList[unitName];
    },
    convertValue: state => (unitName, value) => {
      //console.log(unitName, value); //CHANGE
      return state.unitList[state.currentUnit].parameters[unitName].func(value);
    },
    getPlaneList: state => {
      return state.planeList;
    }
  },
  mutations: {
    changeUnit(state, payload) {
      if (typeof payload === "number") {
        state.currentUnit = Object.keys(state.unitList)[payload];
      } else if (state.unitList[payload]) {
        state.currentUnit = payload;
      } else {
        console.error("Unit not found");
      }
      localStorage.setItem('unit', state.currentUnit);
    },
    setLanguage(state, payload) {
      state.language = payload;
      localStorage.setItem('language', payload);
      i18n.locale = state.language;
    },
    updateLanguage(state) {
      state.language = localStorage.getItem('language') || convertLanguage(getBrowserLanguage());
      i18n.locale = state.language;
    },
    setPlaneList(state, payload) {
      state.planeList = payload;
    },
    clearPlaneList(state) {
      state.planeList = [];
    }
  },
  actions: {
  },
  modules: {
  }
})
