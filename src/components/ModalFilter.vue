<template>
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
                        <div v-if="tag.type == 'number'">
                            <b-field
                                :message="tag.unit ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]}` : ''">
                                <template #label>
                                    <span>{{ tag.translate }} <b-icon pack="fas" type="is-danger" icon="xmark"
                                            class="filterRemoveIcon" @click.native="removeFilter(tag)">
                                        </b-icon></span>
                                </template>
                                <b-numberinput v-model="tag.value" :min="tag.range[0]" :max="tag.range[1]"
                                    controls-position="compact">
                                </b-numberinput>
                            </b-field>
                        </div>
                        <div v-if="tag.type == 'number_range'">
                            <b-field
                                :message="tag.unit ? `${$t('search.unitin')}: ${$t('units')[tag.unit.trim()]}` : ''">
                                <template #label>
                                    <span>{{ tag.translate }} <b-icon pack="fas" type="is-danger" icon="xmark"
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
            </div>
        </div>
    </b-modal>
</template>

<script>
export default {
    data() {
        return {
            isFilterModalActive: false,
            filtersList: [],
            selectedParameters: [],
        };
    },
    props: [
        'parameters',
        'filters',
    ],
    methods: {
        isMobile() {
            return window.innerWidth < 768;
        },
    }
}
</script>