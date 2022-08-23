<template>
    <div class="content">
        <section>
            <b-table class="customTableFlex" :data="planeList" :columns="columns" narrowed hoverable paginated
                pagination-simple>
            </b-table>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            columns: [
                {
                    field: "id",
                },
                {
                    field: "name",
                    label: "Name",
                },
                {
                    field: "properties.age",
                    label: "Year",
                },
                {
                    field: "properties.manufactor",
                    label: "Manufactor",
                },
            ],
            loading: true,
        };
    },
    created() {
        this.axios({
            url: this.$backend + "/api/planes/list",
        })
            .then()
            .catch()
            .finally(() => {
                this.loading = false;
            });
    },
};
</script>

<style lang="scss" scoped>
.customTableFlex {
    //display: flex;
}

::v-deep .pagination {
    margin: 0px;
}
</style>