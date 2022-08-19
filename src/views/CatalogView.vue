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
            planeList: [
                {
                    "name": "A19N",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A20N",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A21N",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A306",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A30B",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A310",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A318",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A319",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A320",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A321",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A332",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A333",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A337",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A338",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A339",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A342",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A343",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A345",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A346",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A359",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A35K",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A388",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A3ST",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "A400",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "AS32",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "AS50",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Airbus",
                    }
                },
                {
                    "name": "B17",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B29",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B37M",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B38M",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B39M",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B3XM",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B52",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B701",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B703",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B712",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B720",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B721",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B722",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B732",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B733",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B734",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B735",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B736",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B737",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B738",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B739",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B741",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B742",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B743",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B744",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B748",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                },
                {
                    "name": "B74R",
                    "properties": {
                        "age": 1994,
                        "manufactor": "Boeing",
                    }
                }
            ],
            columns: [
                {
                    field: 'id'
                },
                {
                    field: 'name',
                    label: 'Name',
                },
                {
                    field: 'properties.age',
                    label: 'Year',
                },
                {
                    field: 'properties.manufactor',
                    label: 'Manufactor',
                }
            ],
            loading: true,
        }
    },
    created() {
        this.axios({
            url: this.$backend + '/api/planes/list'
        }).then().catch().finally(() => {
            this.loading = false;
        })
    }
}

</script>

<style lang="scss" scoped>
.customTableFlex {
    //display: flex;
}

::v-deep .pagination {
    margin: 0px;
}
</style>