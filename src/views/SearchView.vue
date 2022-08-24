/* eslint-disable */
<template>
  <div class="searchContent">
    <div class="filterContent">
      <b-field :label="$t('search.entercategories')">
        <b-taginput v-model="selectedCategories" :data="planeCategories" autocomplete :allow-new="false" open-on-focus
          field="name" icon="tag" placeholder="Add a tag" @typing="getFilteredTags_Categories">
        </b-taginput>
      </b-field>
      <b-field :label="$t('search.enterparameters')">
        <b-taginput v-model="selectedParameters" :data="planeParameters" autocomplete :allow-new="false" open-on-focus
          icon="tag" field="translate" placeholder="Add a tag" @typing="getFilteredTags_Parameters">
          <template slot-scope="props">
            <span>{{ props.option.translate }}
              <b-icon size="is-small" type="is-success" icon="check"
                v-if="selectedParameters.indexOf(props.option) >= 0"></b-icon>
            </span>
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

    <div class="" v-if="columns.length > 0">
      <b-table :data="planeData" :columns="columns" :checked-rows.sync="checkedRows" :loading="isTableLoading"
        checkable>
        <template #bottom-left>
          <b>Total checked</b>: {{ checkedRows.length }}
        </template>
      </b-table>
      <b-button type="is-primary" @click="plot">{{ $t('search.plot') }}</b-button>
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

              <b-dropdown-item arial-role="listitem" v-for="(item, index) of selectedParameters" :key="index"
                @click="filterClick(index)">
                <span>{{ item.translate }}
                  <b-icon v-if="filtersList.indexOf(item) >= 0" type="is-success" icon="check">
                  </b-icon>
                </span>
              </b-dropdown-item>
            </b-dropdown>
          </div>

          <div class="filterArr">
            <div v-for="(tag, index) of filtersList" :key="index" class="filterItem">
              <div v-if="tag.type == '!number'">
                <b-field :message="tag.unit ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]}` : ''">
                  <template #label>
                    <span>{{ tag.translate }} <b-icon pack="fas" type="is-danger" icon="xmark" class="filterRemoveIcon"
                        @click.native="removeFilter(tag)">
                      </b-icon></span>
                  </template>
                  <b-numberinput v-model="tag.value" :min="tag.range[0]" :max="tag.range[1]"
                    controls-position="compact">
                  </b-numberinput>
                </b-field>
              </div>
              <div v-if="tag.type == 'number'">
                <b-field :message="tag.unit ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]}` : ''">
                  <template #label>
                    <span>{{ tag.translate }} <b-icon pack="fas" type="is-danger" icon="xmark" class="filterRemoveIcon"
                        @click.native="removeFilter(tag)">
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


            <b-button icon-left="plus" type="is-primary">
              {{ $t("search.addplot") }}
            </b-button>
          </div>

          <div class="plotArr">
            <div v-for="(tag, index) of plotArr" :key="index" class="filterItem">

            </div>
          </div>

        </div>
      </div>

    </b-modal>
  </div>
</template>

<script>

import planeParameters from '@/assets/planeParameters.json';
import planeCategories from '@/assets/planeCategories.json';

export default {
  data() {
    return {
      tags: [],
      planeParameters: planeParameters.parameters.map((el) => {
        el.translate = this.$t(el.name);
        switch (el.type) {
          case 'number':
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
    };
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
    search() {
      this.isTableLoading = true;
      this.axios({
        url: this.$backend + "/plane/query",
        method: "POST",
        data: {
          filter: "adasdaa@adada.com",
        },
      }).then((e) => {
        this.planeData = e.data;
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
            label: el.translate,
          };
        })]
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    plot(){
      this.isPlotModalActive = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.searchContent {
  display: flex;
  flex-direction: column;
  max-width: 450px;

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
</style>