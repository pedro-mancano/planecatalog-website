<template>
    <div class="content">
        <section>
            <b-table class="customTableFlex" :data="planeList" :columns="columns" narrowed hoverable paginated
                pagination-simple :loading="loading">
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
            columns: [],
            total: -1,
        };
    },
    methods: {
        loadColumns() {
            this.columns = [
                {
                    field: 'name',
                    label: this.$t('search.planename'),
                },
                ...this.planeParameters.map((el) => {
                    return {
                        field: el.name,
                        label: `${this.$t(`planeparams.${el.name}`)}${el.unit ? ` [${el.unit}]` : ''}`,
                    };
                }),
            ];
        }
    },
    created() {
        this.loadColumns();
        this.axios({
            url: this.$backend + "/plane/all",
            method: "POST",
            data: {
                skip: this.skip
            },
        }).then((resp) => {
            this.planeList = resp.data.planes;
            this.count = resp.data.count;
            this.loading = false;
        }).catch().finally(() => {
            this.loading = false;
        });
    },
};
</script>

<style lang="scss" scoped>
//.customTableFlex {
//    display: flex;
//}
:deep(.pagination) {
    margin: 0px;
}
</style>