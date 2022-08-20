<template>
    <div class="search">
        <div class="filters">
            <b-field :label="$t('planeCategory')" class="p-tagInput">
                <b-taginput
                    v-model="tags"
                    :data="planeCategories"
                    autocomplete
                    :allow-new="false"
                    open-on-focus
                    field="text"
                    icon="tag"
                    :placeholder="$t('addTag')"
                    @typing="getFilteredTags"
                >
                </b-taginput>
            </b-field>
            <b-field :label="$t('parameters')" class="p-tagInput">
                <b-taginput
                    v-model="tags"
                    :data="planeCategories"
                    autocomplete
                    :allow-new="false"
                    open-on-focus
                    field="text"
                    icon="tag"
                    :placeholder="$t('addTag')"
                    @typing="getFilteredTags"
                >
                </b-taginput>
            </b-field>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchView",
    data() {
        return {
            planeCategories: [{ text: "LSA" }],
            planeParameters: [
                {
                    text: "Wingspan",
                    value: "wingspan",
                    id: 0,
                    type: {
                        value: "number",
                        from: 0,
                        to: 100,
                    },
                },
                {
                    text: "Length",
                    value: "length",
                    id: 1,
                    type: {
                        value: "number",
                        from: 0,
                        to: 100,
                    },
                },
                {
                  text:"wingStyle",
                  value:"wingStyle",
                  id:2,
                  type:{
                    value:"string",
                    values:["conventional","tail-cone","delta","delta-tail-cone"]
                  }
                }
            ],
            tags: [],
        };
    },
    methods: {
        getFilteredTags(text) {
            this.filteredTags = this.planeCategories.filter((option) => {
                return (
                    option.text
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                );
            });
        },
    },
};
</script>

<style scoped lang="scss">
.about {
    padding: 20px;
    text-align: center;
}

.filters {
    display: flex;
    flex-direction: row;
    flex-flow: wrap;

    & .p-tagInput {
        max-width: 200px;
        margin: 10px;
    }
}
</style>
