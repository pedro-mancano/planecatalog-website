<template>
    <div class="content">
        <div class="selector">
            <b-field :label="$t('search.enterparameters')">
                <b-taginput ref="taginputParams" v-model="selectedParameters" :data="planeParameters" autocomplete
                    :allow-new="false" open-on-focus icon="tag" field="name" :placeholder="$t('search.addatag')"
                    @typing="getFilteredTags_Parameters" @remove="updateParams" @input="updateParams">
                    <template slot-scope="props">
                        <span>{{ $t(`planeparams.${props.option.name}`) }}
                            <b-icon size="is-small" type="is-success" icon="check"
                                v-if="selectedParameters.indexOf(props.option) >= 0"></b-icon>
                        </span>
                    </template>
                    <template #selected="props">
                        <b-tag v-for="(tag, index) in props.tags" :key="index" type="is-primary" rounded
                            :tabstop="false" ellipsis closable @close="$refs.taginputParams.removeTag(index, $event)">
                            {{ $t("planeparams." + tag.name) }}
                        </b-tag>
                    </template>
                </b-taginput>
            </b-field>
        </div>
        <section>
            <b-table class="customTableFlex" :data="planeList" :columns="columns" narrowed hoverable paginated
                pagination-simple :loading="loading" :per-page="10" :total="count" :backend-pagination="true"
                @page-change="pageChanged">

                <template #empty>
                    <div class="has-text-centered">
                        <b-icon icon="box-open" size="is-large" type="is-primary">
                        </b-icon>
                        <p>{{ $t('empty') }}</p>
                    </div>
                </template>

            </b-table>
        </section>
    </div>
</template>

<script>
import planeParameters from '@/assets/planeParameters.json';
export default {
    data() {
        return {
            skip: 0,
            loading: true,
            planeList: [],
            planeParameters: planeParameters.parameters.map((el) => {
                el.translate = this.$t(`planeparams.${el.name}`);
                switch (el.type) {
                    case 'number_range':
                        el.value = [el.default, el.default];
                        break;
                }
                return el;
            }),
            selectedParameters: [],
            columns: [],
            count: -1,
            page: 1,
        };
    },
    methods: {
        parsePlaneData() { //Parse current plane data to be used in table and other components
            var data = this.$store.getters.getPlaneList;
            this.planeList = Array(data.length)
                .fill(0)
                .map((_, i) => {
                    return Object.assign({}, data[i]);
                });
            this.planeList.forEach((el) => {
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
            this.checkedRows = this.planeList;
        },
        pageChanged(page) {
            this.page = page;
            this.skip = (page - 1) * 10;
            this.loadPlaneList();
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
        updateParams() {
            if (this.columns != 0) {
                this.loadColumns();
            }
        },
        loadColumns() {
            this.columns = [
                {
                    field: 'name',
                    label: this.$t('search.planename'),
                },
                ...this.selectedParameters.map((el) => {
                    return {
                        field: el.name,
                        label: `${this.$t(`planeparams.${el.name}`)}${el.unit ? ` [${el.unit}]` : ''}`,
                    };
                }),
            ];
        },
        loadPlaneList(fallback) {
            this.loadColumns();
            this.loading = true;
            this.axios({
                url: (fallback ? this.$backend_fallback : this.$backend) + "/plane/all",
                method: "POST",
                data: {
                    skip: this.skip
                },
            }).then((resp) => {
                this.$store.commit("setPlaneList", resp.data.planes);
                this.count = resp.data.count;
                this.loading = false;
                this.parsePlaneData();
            }).catch(async () => {
                if (!this.$production) {
                    this.loadPlaneList(true);
                }
            }).finally(() => {
                this.loading = false;
            });
        }
    },
    created() {
        this.loadPlaneList();
    },
};
</script>

<style lang="scss" scoped>
//.customTableFlex {
//    display: flex;
//}
#content {
    display: flex;
    width: 100%;
    height: 100%;

    :deep(.table-wrapper) {
        margin-bottom: 0px !important;
    }

    div.table-footer {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

:deep(.pagination) {
    margin: 0px;
}

.selector {
    margin-bottom: 20px;
    max-width: 400px;
}
</style>