/* eslint-disable */
<template>
  <div class="searchContent">
    <div class="filterContent">
      <b-field :label="$t('search.entercategories')">
        <b-taginput v-model="selectedCategories" :data="planeCategories" autocomplete :allow-new="false" open-on-focus
          field="name" icon="tag" :placeholder="$t('search.addatag')" @typing="getFilteredTags_Categories">
        </b-taginput>
      </b-field>
      <b-field :label="$t('search.enterparameters')">
        <b-taginput ref="taginputParams" v-model="selectedParameters" :data="planeParameters" autocomplete
          :allow-new="false" open-on-focus icon="tag" field="name" :placeholder="$t('search.addatag')"
          @typing="getFilteredTags_Parameters" @remove="removedParameters" @input="selectedParamChanged">
          <template slot-scope="props">
            <span>{{ $t(`planeparams.${props.option.name}`) }}
              <b-icon size="is-small" type="is-success" icon="check"
                v-if="selectedParameters.indexOf(props.option) >= 0"></b-icon>
            </span>
          </template>
          <template #selected="props">
            <b-tag v-for="(tag, index) in props.tags" :key="index" type="is-primary" rounded :tabstop="false" ellipsis
              closable @close="$refs.taginputParams.removeTag(index, $event)">
              {{ $t("planeparams." + tag.name) }}
            </b-tag>
            <b-tag v-for="(custom, index) in customParams" :key="`custom-` + index" type="is-primary is-light" rounded
              :tabstop="false" ellipsis closable @close="removeCustomParam(index)">
              {{ custom.name }}
            </b-tag>
          </template>
        </b-taginput>
      </b-field>
      <div class="buttonsList">
        <b-button type="is-primary is-light" @click="openFilterModal" icon-left="filter">
          {{
              `${$t("filters")} ${filtersList.length > 0 ? `(${filtersList.length})` : ""
              }`
          }}
        </b-button>
        <b-button type="is-primary is-light" @click="openCustomParamModal">
          {{
              `${$t("customparams")} ${customParams.length > 0 ? `(${customParams.length})` : ""
              }`
          }}
        </b-button>
      </div>
      <div class="searchButton">
        <b-button type="is-primary" @click="search" :loading="isTableLoading" icon-left="search">{{ $t("search") }}
        </b-button>
      </div>
    </div>

    <div class="planeTable" v-if="columns.length > 0">
      <b-table :data="planeData" :columns="columns" :checked-rows.sync="checkedRows" :loading="isTableLoading" paginated
        :per-page="10" pagination-simple checkable>
        <template #bottom-left>
          <!--b>Total checked</b>: {{ checkedRows.length }} <div-->
        </template>
        <template #empty>
          <div class="has-text-centered">
            <b-icon icon="box-open" size="is-large" type="is-primary">
            </b-icon>
            <p>{{ $t('empty') }}</p>
          </div>
        </template>
      </b-table>
      <div class="plotButtons">
        <b-button type="is-primary is-light" @click="downloadTable">{{
            $t("search.download")
        }}</b-button>
        <b-button type="is-primary is-light" @click="plotModal">
          {{
              `${$t("search.plotconfig")} ${plotArr.length > 0 ? `(${plotArr.length})` : ""
              }`
          }}
        </b-button>
        <b-button type="is-primary" @click="plot">{{
            $t("search.plot")
        }}</b-button>
      </div>
    </div>

    <div v-if="showPlots" class="plots" ref="plots">
      <PlotComponent v-for="(plot, index) in readyToPlot" :key="index" :data="checkedRows" :type="plot.type"
        :options="[plot.x, plot.y]" :plotRef="plot" :log-scale="plot.log"
        :selectedParams="selectedParameters.concat(customParams)" :ref="`plot-${index}`">
      </PlotComponent>
    </div>

    <b-modal v-model="isFilterModalActive" :width="isMobile() ? '92vw' : '640px'" scroll="keep">
      <div class="modalContainer">
        <div class="model-card">
          <div class="model-card__header">
            <div class="model-card__title">
              <h1 class="title">
                <span>{{ $t("filters") }}</span>
              </h1>
            </div>

            <b-dropdown aria-role="list">
              <template #trigger="{}">
                <b-button icon-left="plus" type="is-primary">
                  {{ $t("search.addfilter") }}
                </b-button>
              </template>

              <b-dropdown-item arial-role="listitem" v-for="(item, itemIndex) of selectedParameters" :key="itemIndex"
                @click="filterClick(itemIndex)">
                <span>{{ $t(`planeparams.${item.name}`) }}
                  <b-icon v-if="filtersList.indexOf(item) >= 0" type="is-success" icon="check">
                  </b-icon>
                </span>
              </b-dropdown-item>
            </b-dropdown>
          </div>

          <div class="filterArr">
            <div v-for="(tag, tagIndex) of filtersList" :key="tagIndex" class="filterItem">
              <div v-if="tag.type == 'number'">
                <b-field :message="
                  tag.unit
                    ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]
                    }`
                    : ''
                ">
                  <template #label>
                    <span>{{ $t(`planeparams.${tag.name}`) }}
                      <b-icon pack="fas" type="is-danger" icon="xmark" class="filterRemoveIcon"
                        @click.native="removeFilter(tag)">
                      </b-icon>
                    </span>
                  </template>
                  <b-numberinput v-model="tag.value" :min="tag.range[0]" :max="tag.range[1]"
                    controls-position="compact">
                  </b-numberinput>
                </b-field>
              </div>
              <div v-if="tag.type == 'number_range'">
                <b-field :message="
                  tag.unit
                    ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]
                    }`
                    : ''
                ">
                  <template #label>
                    <span>{{ $t(`planeparams.${tag.name}`) }}
                      <b-icon pack="fas" type="is-danger" icon="xmark" class="filterRemoveIcon"
                        @click.native="removeFilter(tag)">
                      </b-icon>
                    </span>
                  </template>
                  <div>
                    <span>{{ `${tag.value[0]} - ${tag.value[1]}` }}</span>
                    <b-slider v-model="tag.value" :min="tag.range[0]" :max="tag.range[1]" :step="1">
                    </b-slider>
                  </div>
                </b-field>
              </div>
            </div>
          </div>

          <div class="model-card__footer">
            <b-button type="is-danger" @click="isFilterModalActive = false">
              {{ $t("close") }}
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="isPlotModalActive" :width="isMobile() ? '92vw' : '640px'" scroll="keep">
      <div class="modalContainer">
        <div class="model-card">
          <div class="model-card__header">
            <div class="model-card__title">
              <h1 class="title">
                <span>{{ $t("search.plot") }}</span>
              </h1>
            </div>

            <b-button icon-left="plus" type="is-primary" @click="addPlot">
              {{ $t("search.addplot") }}
            </b-button>
          </div>

          <div class="plotArr">
            <div v-for="(plot, plotIndex) of plotArr" :key="plotIndex" class="plotItem">
              <div class="plotContainer">
                <b-field>
                  <template #label>
                    <span>{{ `Plot ${plotIndex + 1}` }}
                      <b-icon pack="fas" type="is-danger" icon="xmark" class="filterRemoveIcon"
                        @click.native="removePlot(plotIndex)">
                      </b-icon>
                    </span>
                  </template>
                  <b-select v-model="plot.type" :placeholder="$t('plot.selecttype')" @input="plotTypeInput(plotIndex)"
                    expanded>
                    <option value="scatter">{{ $t("scatter") }}</option>
                    <option value="pie">{{ $t("pie") }}</option>
                    <option value="bar">{{ $t("bar") }}</option>
                    <option value="bar-multi">{{ $t("bar-multi") }}</option>
                  </b-select>
                </b-field>
                <div v-if="plot.type == 'scatter' || plot.type == 'bar'" class="plotParams1">
                  <b-field>
                    <template #label>
                      <div class="plot-axis">
                        <span>X</span>
                        <b-checkbox v-model="plot.logX" size="is-small" v-if="plot.type == 'scatter'">Log</b-checkbox>
                      </div>
                    </template>
                    <b-select v-if="plot.type == 'scatter'" v-model="plot.x" :placeholder="$t('plot.selectparam')"
                      expanded>
                      <option v-for="(param, paramIndex) of selectedParameters.filter(
                        (i) => i.name != plot.y && i.type.includes('number')
                      )" :key="paramIndex" :value="param.name">
                        {{ $t(`planeparams.${param.name}`) }}
                      </option>
                      <option v-for="(custom, customIndex) of customParams.filter(
                        (i) => i.name != plot.y
                      )" :key="'custom-' + customIndex" :value="custom.name">
                        {{ custom.name }}
                      </option>
                    </b-select>
                    <b-select v-if="plot.type == 'bar'" :placeholder="$t('search.planename')" expanded disabled>
                    </b-select>
                  </b-field>
                  <b-field label="Y">
                    <template #label>
                      <div class="plot-axis">
                        <span>Y</span>
                        <b-checkbox v-model="plot.logY" size="is-small">Log</b-checkbox>
                      </div>
                    </template>
                    <b-select v-model="plot.y" :placeholder="$t('plot.selectparam')" expanded>
                      <option v-for="(param, paramIndex) of selectedParameters.filter(
                        (i) => i.name != plot.x && i.type.includes('number')
                      )" :key="paramIndex" :value="param.name">
                        {{ $t(`planeparams.${param.name}`) }}
                      </option>
                      <option v-for="(custom, customIndex) of customParams.filter(
                        (i) => i.name != plot.x
                      )" :key="'custom-' + customIndex" :value="custom.name">
                        {{ custom.name }}
                      </option>
                    </b-select>
                  </b-field>
                </div>
                <div v-if="plot.type == 'pie'" class="plotParams2">
                  <b-field>
                    <template #label>
                      <div class="plot-axis">
                        <span>{{ $t("qualitativeParameter") }}</span>
                      </div>
                    </template>
                    <b-select v-model="plot.x" :placeholder="$t('plot.selectparam')" expanded>
                      <option v-for="(param, paramIndex) of selectedParameters" :key="paramIndex" :value="param.name">
                        {{ $t(`planeparams.${param.name}`) }}
                      </option>
                      <option v-for="(custom, customIndex) of customParams" :key="'custom-' + customIndex"
                        :value="custom.name">
                        {{ custom.name }}
                      </option>
                    </b-select>
                  </b-field>
                </div>
                <div v-if="plot.type == 'bar-multi'" class="plotParams3">
                  <b-field>
                    <template #label>
                      <div class="plot-axis">
                        <span>{{ $t("plot.selectparams") }}</span>
                      </div>
                    </template>

                    <b-taginput ref="plotTagInputParams" v-model="plot.ys"
                      :data="selectedParameters.filter((i) => i.type.includes('number')).concat(customParams)"
                      autocomplete :allow-new="false" open-on-focus icon="tag" field="name"
                      :placeholder="$t('search.addatag')" @typing="getFilteredTags_Parameters">
                      <template slot-scope="props">
                        <span>{{ props.option.custom ? props.option.name : $t(`planeparams.${props.option.name}`) }}
                          <b-icon size="is-small" type="is-success" icon="check"
                            v-if="plot.ys?.indexOf(props.option) >= 0"></b-icon>
                        </span>
                      </template>
                      <template #selected="props">
                        <b-tag v-for="(tag, index) in props.tags" :key="index" type="is-primary" rounded
                          :tabstop="false" ellipsis closable @close="plot.ys.splice(index, 1)">
                          {{ tag.custom ? tag.name : $t("planeparams." + tag.name) }}
                        </b-tag>
                      </template>
                    </b-taginput>
                  </b-field>
                </div>
              </div>
            </div>
          </div>

          <div class="model-card__footer">
            <b-button type="is-danger" @click="isPlotModalActive = false">
              {{ $t("close") }}
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>

    <CustomParam ref="customParams" v-bind:enabled.sync="isCustomParamModalActive"
      v-bind:customParams.sync="customParams" v-bind:activeParams="
        selectedParameters.filter((e) => e.type == 'number_range')
      " @save="savedCustomParams">
    </CustomParam>
  </div>
</template>

<script>
import planeParameters from "@/assets/planeParameters.json";
import planeCategories from "@/assets/planeCategories.json";
import PlotComponent from "@/components/PlotComponent.vue";
import CustomParam from "@/components/CustomParam.vue";
import * as XLSX from "xlsx";

export default {
  components: {
    PlotComponent,
    CustomParam,
  },
  data() {
    return {
      tags: [],
      planeParameters: planeParameters.parameters.map((el) => {
        el.translate = this.$t(`planeparams.${el.name}`);
        switch (el.type) {
          case "number_range":
            el.value = [el.default, el.default];
            break;
        }
        return el;
      }),
      planeCategories: planeCategories.categories,
      selectedCategories: [],
      selectedParameters: [],
      filtersList: [],
      checkedRows: [],
      planeData: [],
      columns: [],
      plotArr: [],
      readyToPlot: [],
      customParams: [],
      isFilterModalActive: false,
      isPlotModalActive: false,
      isCustomParamModalActive: false,
      isTableLoading: false,
      showPlots: false,
    };
  },
  methods: {
    removeCustomParam(index) {
      this.customParams.splice(index, 1);
      this.updateCustomParams();
      if (this.columns != 0) {
        this.generateColumns();
      }
    },
    selectedParamChanged() {
      setImmediate(() => {
        this.$refs.customParams.ensureParams();
        this.updateCustomParams();
        if (this.columns != 0) {
          this.generateColumns();
        }
      });
    },
    savedCustomParams() {
      setImmediate(() => {
        this.updateCustomParams();
        if (this.columns != 0) {
          this.generateColumns();
        }
      });
    },
    filterClick(e) {
      if (!this.filtersList.includes(this.selectedParameters[e])) {
        this.filtersList.push(this.selectedParameters[e]);
      }
    },
    getFilteredTags_Parameters(text) {
      this.planeParameters = planeParameters.parameters.filter((option) => {
        return (
          option.name.toString().toLowerCase().indexOf(text.toLowerCase()) >=
          0 ||
          this.$t("planeparams." + option.name)
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    removedParameters(tag) {
      this.removeFilter(tag);
      this.plotArr = [];
      this.updateCustomParams();
      if (this.columns.length != 0) {
        this.generateColumns();
      }
    },
    getFilteredTags_Categories(text) {
      this.planeCategories = planeCategories.categories.filter((option) => {
        return (
          option.name.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    openFilterModal() {
      if (this.selectedParameters.length > 0) {
        this.isFilterModalActive = true;
      }
    },
    openCustomParamModal() {
      if (this.selectedParameters.length > 0) {
        this.isCustomParamModalActive = true;
      }
    },
    removeFilter(e) {
      this.filtersList.splice(this.filtersList.indexOf(e), 1);
    },
    parseFilterItem(item) {
      switch (item.type) {
        case "number_range":
          return {
            field: item.name,
            type: item.type,
            value: {
              min: item.value[0],
              max: item.value[1],
            },
          };
      }
    },
    parseFilterListToServer() {
      let filters = [];
      this.filtersList.forEach((item) => {
        filters.push(this.parseFilterItem(item));
      });
      return filters;
    },
    updateCustomParams() {
      for (let i = 0; i < this.planeData.length; i++) {
        for (var custom of this.customParams) {
          var refData = {};
          for (var ref of custom.refs) {
            refData[ref.name] = this.planeData[i][ref.ref.name];
          }
          var value = custom.code.evaluate(refData);
          this.planeData[i][custom.name] = parseFloat(
            parseFloat(value).toFixed(2)
          ); //CHANGE
        }
      }
    },
    parsePlaneData() { //Parse current plane data to be used in table and other components
      var data = this.$store.getters.getPlaneList;
      this.planeData = Array(data.length)
        .fill(0)
        .map((_, i) => {
          return Object.assign({}, data[i]);
        });
      this.planeData.forEach((el) => {
        for (let key of this.planeParameters) {
          if (key.type == "number_range") { //Convert numbers units
            el[key.name] = this.$store.getters.convertValue(
              key.name,
              el[key.name]
            );
          } else if (key.type == "select") { //Translate select values
            if (el[key.name] == '' || el[key.name] == null) {
              el[key.name] = this.$t('unknown');
            } else {
              el[key.name] = this.$t(`planeparams.${key.name}List.${el[key.name]}`);
            }
          }
        }
      });
      this.updateCustomParams();
      this.checkedRows = this.planeData;
    },
    getPlaneData(fallback) {
      new Promise((resolve) => {
        this.axios({
          url: (fallback ? this.$backend_fallback : this.$backend) + "/plane/query",
          method: "POST",
          data: {
            filter: this.parseFilterListToServer(),
          },
        }).then((e) => {
          this.$store.commit("setPlaneList", e.data);
          this.parsePlaneData();
        }).catch(() => {
          if (!fallback && !this.$production) {
            this.getPlaneData(true);
          } else {
            this.toast(this.$t("serverError"));
          }
        }).finally(() => {
          if (!fallback) {
            this.isTableLoading = false;
          }
          resolve();
        });
      });
    },
    search() {
      this.planeData = [];
      this.checkedRows = [];
      this.isTableLoading = true;
      this.getPlaneData(false);
      this.generateColumns();
    },
    generateColumns() {
      this.columns = [
        {
          field: "name",
          label: this.$t("search.planename"),
        },
        ...this.selectedParameters.map((el) => {
          return {
            field: el.name,
            label: `${this.$t(`planeparams.${el.name}`)}${el.unit ? ` [${el.unit}]` : ""
              }`,
          };
        }),
        ...this.customParams.map((el) => {
          return {
            field: el.name,
            label: `${el.name}${el.unit ? ` [${el.unit}]` : ""}`,
          };
        }),
      ];
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    plotModal() {
      this.isPlotModalActive = true;
    },
    toast(message, type = "is-danger") {
      this.$buefy.toast.open({
        duration: 5000,
        message: `${message}`,
        position: "is-bottom",
        type: `${type}`,
      });
    },
    removePlot(index) {
      this.plotArr.splice(index, 1);
    },
    addPlot() {
      this.plotArr.push({
        type: "scatter",
        x: undefined,
        y: undefined,
        logX: false,
        logY: false,
      });
    },
    plot() {
      if (this.checkedRows.length === 0) {
        this.toast(this.$t("search.nothingtoplot"));
        return;
      }

      if (this.plotArr.length === 0) {
        this.toast(this.$t("search.nothingtoplot"));
        return;
      }

      this.readyToPlot = [];
      this.plotArr.forEach((plot, plotIndex) => {
        if (plot.type === "bar" || plot.type === "bar-multi") {
          plot.x = "disable";
        }

        if (plot.type === "bar-multi") {
          plot.y = "disable";
        }

        if (plot.type === "pie") {
          plot.y = "disable";
        }

        if (!plot.x || !plot.y) {
          this.toast(
            `${this.$t("plot.undefined")} ${plotIndex + 1}`,
            "is-danger"
          );
          return;
        }

        let x =
          this.selectedParameters.find((el) => el.name === plot.x) ||
          this.customParams.find((el) => el.name === plot.x) ||
          plot.x === "disable";
        let y =
          this.selectedParameters.find((el) => el.name === plot.y) ||
          this.customParams.find((el) => el.name === plot.y) ||
          plot.y === "disable";

        if (!x || !y) {
          this.toast(
            `${this.$t("plot.undefined")} ${plotIndex + 1}`,
            "is-danger"
          );
          plot.x = x ? plot.x : undefined;
          plot.y = y ? plot.y : undefined;
          return;
        }

        this.readyToPlot.push({
          log: [plot.logX, plot.logY],
          ...plot,
        });
      });
      this.showPlots = true;
      setImmediate(() => {
        for (var i = 0; i < this.readyToPlot.length; i++) {
          if (!this.readyToPlot[i].x || !this.readyToPlot[i].y) {
            this.toast(`${this.$t("plot.undefined")} ${i + 1}`, "is-danger");
            continue;
          }
          if (!this.$refs[`plot-${i}`]) return;
          this.$refs[`plot-${i}`][0].draw();
        }
        this.$refs[`plot-${this.readyToPlot.length - 1}`][0].$el.scrollIntoView(
          {
            behavior: "smooth",
            block: "end",
          }
        );
      });
    },
    plotTypeInput(i) {
      var plotObj = this.plotArr[i];
      if (plotObj.type == "bar") {
        plotObj.x = "name";
      }
    },
    downloadTable() {
      if (this.checkedRows.length === 0) {
        this.toast(this.$t("search.nothingtodownload"));
        return;
      }

      var workbook = XLSX.utils.book_new();
      var worksheet = XLSX.utils.aoa_to_sheet([
        [
          this.$t("search.planename"),
          ...this.planeParameters.map((el) => {
            return this.$t(`planeparams.${el.name}`) || el;
          }),
          ...this.customParams.map((el) => {
            return el.name;
          }),
        ],
        ...this.checkedRows.map((el, i) => {
          var val = this.planeParameters
            .map((e) => e.name)
            .map((key) => {
              return el[key];
            });
          val.unshift(el.name);
          for (var custom of this.customParams) {
            val.push(this.checkedRows[i][custom.name]);
          }
          return val;
        }),
      ]);

      worksheet.A1.v = this.$t("search.planename");

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "data.xlsx");
    },
    languageChanged() {
      this.parsePlaneData();
      this.generateColumns();
    }
  },
  created() {
    //register event listener for $root 
    this.$root.$on("languageChanged", this.languageChanged);
  },
  beforeDestroy() {
    this.$root.$off("languageChanged", this.languageChanged);
  },
};
</script>

<style lang="scss" scoped>
.searchContent {
  display: flex;
  flex-direction: column;
  width: 100%;

  & .filterContent {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    width: 400px;
    margin-bottom: 28px;

    .taginput {
      width: 100%;
    }

    .searchButton {
      margin-bottom: 10px;
      width: 120px;

      & :deep(.button) {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      width: unset;
    }

    .tagSelector {
      display: table;
    }

    .buttonsList {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    :deep(.buttonsList > :first-child) {
      width: 120px;
    }

    .buttonsList> :last-child {
      margin-left: auto;
    }

    @media (max-width: 768px) {
      .buttonsList {
        flex-direction: column;
        align-items: flex-start;
      }

      .buttonsList> :last-child {
        margin-top: 10px;
        margin-left: 0;
      }
    }

    .taginput {
      display: table;
    }
  }
}

.model-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 0px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  color: black;
  overflow: visible;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  & .model-card__header {
    padding: 0px 20px;
  }

  & .model-card__footer {
    padding: 0px 20px;
    margin-left: auto;
    margin-top: 20px;
  }

  & .model-card__title {
    margin-bottom: 1rem;
  }

  &>.title {
    text-align: center;
  }
}

:deep(.animation-content.modal-content) {
  overflow: visible;
}

.filterArr {
  margin-top: 25px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  overflow: auto;
}

.filterItem {
  width: 215px;

  @media (max-width: 768px) {
    width: 90%;
    padding: 0px 30px;
  }
}

.filterItem:not(:last-child) {
  margin-bottom: 15px;
}

.filterRemoveIcon {
  cursor: pointer;
}

.plotArr {
  margin-top: 25px;
  position: relative;
  overflow: auto; //CHANGE IT LATTER

  & .plotItem:not(:last-child) {
    margin-bottom: 15px;
  }

  & .plotContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    padding: 0px 20px;
    width: 100%;

    :deep(.field) {
      width: 30%;
    }
  }

  & .plotParams1 {
    display: flex;
    width: 70%;
    flex-direction: row;
    justify-content: space-evenly;

    :deep(.field) {
      width: 40% !important;
    }
  }

  & .plotParams2 {
    display: flex;
    width: 70%;
    flex-direction: row;
    justify-content: space-evenly;

    :deep(.field) {
      width: 60% !important;
    }
  }

  & .plotParams3 {
    display: flex;
    width: 70%;
    flex-direction: row;
    justify-content: space-evenly;

    :deep(.dropdown-menu) {
      position: absolute;
    }

    :deep(.dropdown-content) {
      position: fixed;
    }

    :deep(.field) {
      overflow: hidden;
      margin-left: 20px;
      width: 100% !important;
    }
  }
}

.planeTable {
  margin-bottom: 28px;

  :deep(.b-table) {
    margin-bottom: 20px;
  }

  & .plotButtons {
    max-width: 380px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;

    &> :not(:last-child) {
      margin-right: 10px;
    }
  }
}

.plots {
  margin-bottom: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.plot-axis {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;

  &>span {
    margin-right: 10px;
  }

  & :deep(.control-label) {
    padding-left: 0.125rem;
  }
}
</style>
