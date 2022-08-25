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
          @typing="getFilteredTags_Parameters" @remove="removedParameters">
          <template slot-scope="props">
            <span>{{ $t(`planeparams.${props.option.name}`) }}
              <b-icon size="is-small" type="is-success" icon="check"
                v-if="selectedParameters.indexOf(props.option) >= 0"></b-icon>
            </span>
          </template>
          <template #selected="props">
            <b-tag v-for="(tag, index) in props.tags" :key="index" type="is-primary" rounded :tabstop="false" ellipsis
              closable @close="$refs.taginputParams.removeTag(index, $event)">
              {{ $t('planeparams.' + tag.name) }}
            </b-tag>
          </template>
        </b-taginput>
      </b-field>
      <div class="buttons">
        <b-button type="is-primary is-light" @click="openFilterModal">
          {{ `${$t('filters')} ${filtersList.length > 0 ? `(${filtersList.length})` : ''}` }}
        </b-button>
        <b-button type="is-primary" @click="search" :loading="isTableLoading">{{ $t('search') }}</b-button>
      </div>
    </div>

    <div class="planeTable" v-if="columns.length > 0">
      <b-table :data="planeData" :columns="columns" :checked-rows.sync="checkedRows" :loading="isTableLoading"
        checkable>
        <template #bottom-left>
          <!--b>Total checked</b>: {{ checkedRows.length }} <div-->
        </template>
      </b-table>
      <div class="plotButtons">
        <b-button type="is-primary is-light" @click="plotModal">
          {{ `${$t('search.plotconfig')} ${plotArr.length > 0 ? `(${plotArr.length})` : ''}` }}
        </b-button>
        <b-button type="is-primary" @click="plot">{{ $t('search.plot') }}</b-button>
      </div>
    </div>

    <div v-if="showPlots" class="plots" ref="plots">
      <PlotComponent v-for="(plot, index) in readyToPlot" :key="index" :data="checkedRows" :type="plot.type"
        :options="[plot.x, plot.y]" :ref="`plot-${index}`">
      </PlotComponent>
    </div>



    <b-modal v-model="isFilterModalActive" :width="isMobile() ? '92vw' : '640px'" scroll="keep">
      <div class="modalContainer">
        <div class="model-card">
          <div class="model-card__header">
            <div class="model-card__title">
              <h1 class="title">
                <span>{{ $t('filters') }}</span>
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
                <b-field :message="tag.unit ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]}` : ''">
                  <template #label>
                    <span>{{ $t(`planeparams.${tag.name}`) }} <b-icon pack="fas" type="is-danger" icon="xmark"
                        class="filterRemoveIcon" @click.native="removeFilter(tag)">
                      </b-icon></span>
                  </template>
                  <b-numberinput v-model="tag.value" :min="tag.range[0]" :max="tag.range[1]"
                    controls-position="compact">
                  </b-numberinput>
                </b-field>
              </div>
              <div v-if="tag.type == 'number_range'">
                <b-field :message="tag.unit ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]}` : ''">
                  <template #label>
                    <span>{{ $t(`planeparams.${tag.name}`) }} <b-icon pack="fas" type="is-danger" icon="xmark"
                        class="filterRemoveIcon" @click.native="removeFilter(tag)">
                      </b-icon></span>
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
                <span>{{ $t('search.plot') }}</span>
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
                    <span>{{ `Plot ${plotIndex + 1}` }} <b-icon pack="fas" type="is-danger" icon="xmark"
                        class="filterRemoveIcon" @click.native="removePlot(plotIndex)">
                      </b-icon></span>
                  </template>
                  <b-select v-model="plot.type" :placeholder="$t('plot.selecttype')" @input="plotTypeInput(plotIndex)"
                    expanded>
                    <option value="scatter">{{ $t('scatter') }}</option>
                    <option value="column">{{ $t('column') }}</option>
                  </b-select>
                </b-field>
                <b-field label="X">
                  <b-select v-if="plot.type != 'column'" v-model="plot.x" :placeholder="$t('plot.selectparam')"
                    expanded>
                    <option v-for="(param, paramIndex) of selectedParameters.filter(i => i.name != plot.y)"
                      :key="paramIndex" :value="param.name">
                      {{ $t(`planeparams.${param.name}`) }}
                    </option>
                  </b-select>
                  <b-select v-else :placeholder="$t('search.planename')" expanded disabled>
                  </b-select>
                </b-field>
                <b-field label="Y">
                  <b-select v-model="plot.y" :placeholder="$t('plot.selectparam')" expanded>
                    <option v-for="(param, paramIndex) of selectedParameters.filter(i => i.name != plot.x)"
                      :key="paramIndex" :value="param.name">
                      {{ $t(`planeparams.${param.name}`) }}
                    </option>
                  </b-select>
                </b-field>
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
  </div>
</template>

<script>

import planeParameters from '@/assets/planeParameters.json';
import planeCategories from '@/assets/planeCategories.json';
import PlotComponent from '@/components/PlotComponent.vue';
import * as ChartJS from 'chart.js';

export default {
  components: {
    PlotComponent
  },
  data() {
    return {
      tags: [],
      planeParameters: planeParameters.parameters.map((el) => {
        el.translate = this.$t(`planeparams.${el.name}`);
        switch (el.type) {
          case 'number_range':
            el.value = [el.default, el.default];
            break;
        }
        return el;
      }),
      planeCategories: planeCategories.categories,
      selectedCategories: [],
      selectedParameters: [],
      filtersList: [],
      isFilterModalActive: false,
      checkedRows: [],
      isTableLoading: false,
      planeData: [],
      columns: [],
      isPlotModalActive: false,
      plotArr: [],
      showPlots: false,
      readyToPlot: []
    };
  },
  created() {
    ChartJS.Chart.register(ChartJS.LinearScale, ChartJS.ScatterController, ChartJS.PointElement, ChartJS.Tooltip);
  },
  methods: {
    filterClick(e) {
      if (!this.filtersList.includes(this.selectedParameters[e])) {
        this.filtersList.push(this.selectedParameters[e]);
      }
    },
    getFilteredTags_Parameters(text) {
      this.planeParameters = planeParameters.parameters.filter((option) => {
        return option.name
          .toString()
          .toLowerCase()
          .indexOf(text.toLowerCase()) >= 0
      })
    },
    removedParameters(tag) {
      this.removeFilter(tag);
      this.plotArr = [];
    },
    getFilteredTags_Categories(text) {
      this.planeCategories = planeCategories.categories.filter((option) => {
        return option.name
          .toString()
          .toLowerCase()
          .indexOf(text.toLowerCase()) >= 0
      })
    },
    openFilterModal() {
      if (this.selectedParameters.length > 0) {
        this.isFilterModalActive = true;
      }
    },
    removeFilter(e) {
      this.filtersList.splice(this.filtersList.indexOf(e), 1);
    },
    parseFilterItem(item) {
      switch (item.type) {
        case 'number_range':
          return {
            field: item.name,
            type: item.type,
            value: {
              min: item.value[0],
              max: item.value[1]
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
    search() {
      this.planeData = [];
      this.checkedRows = [];
      this.isTableLoading = true;
      this.axios({
        url: this.$backend + "/plane/query",
        method: "POST",
        data: {
          filter: this.parseFilterListToServer(),
        },
      }).then((e) => {
        this.planeData = e.data;
        this.checkedRows = this.planeData;
      }).catch(() => {

      }).finally(() => {
        this.isTableLoading = false;
      });
      this.columns = [
        {
          field: 'name',
          label: this.$t('search.planename'),
        },
        ...this.selectedParameters.map((el) => {
          return {
            field: el.name,
            label: this.$t(`planeparams.${el.name}`),
          };
        })]
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    plotModal() {
      this.isPlotModalActive = true;
    },
    addPlot() {
      this.plotArr.push({
        type: 'scatter',
        x: undefined,
        y: undefined
      });
    },
    removePlot(index) {
      this.plotArr.splice(index, 1);
    },
    plot() {
      this.showPlots = true;
      this.readyToPlot = [];
      this.plotArr.forEach((plot) => {
        this.readyToPlot.push({
          type: plot.type,
          x: plot.x,
          y: plot.y
        });
      });
    },
    plotTypeInput(i) {
      var plotObj = this.plotArr[i];
      if (plotObj.type == 'column') {
        plotObj.x = '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchContent {
  display: flex;
  flex-direction: column;
  width: 100%;


  & .filterContent {
    display: flex;
    flex-direction: column;
    max-width: 380px;
    width: 380px;
    margin-bottom: 30px;


    @media (max-width: 768px) {
      width: unset;
    }

    .tagSelector {
      display: table;
    }

    .buttons>:last-child {
      margin-left: auto;
    }

    .taginput {
      display: table;
    }
  }
}


.model-card {
  background-color: #FFF;
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

::v-deep .animation-content.modal-content {
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
  overflow: auto;

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

    ::v-deep .field {
      width: 30%;
    }
  }
}

.planeTable {
  ::v-deep .b-table {
    margin-bottom: 20px;
  }

  & .plotButtons {
    max-width: 380px;
    width: 380px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;

    &> :last-child {
      margin-left: auto;
    }
  }
}

.plots {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>