<template>
    <div id="content">
        <div class="sidebar">
            <img alt="Logo" class="logo" src="../assets/logo.png" />

            <b-button
                v-for="(item, index) in buttons"
                :key="index"
                :type="getButtonType(item.view)"
                @click="goToPage(item.view)"
                expanded
            >
                {{ $t(item.name) }}
            </b-button>
        </div>
        <div class="view-out">
            <div class="header">
                <span>{{ $t($route.name.toLocaleLowerCase()) }}</span>
            </div>
            <div class="view">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            buttons: [
                {
                    view: "home",
                    name: "home",
                },
                {
                    view: "search",
                    name: "search",
                },
                {
                    view: "catalog",
                    name: "catalog",
                },
            ],
        };
    },
    methods: {
        getButtonType(name) {
            if (name == this.$route.name) {
                return "is-primary";
            } else {
                return "is-primary is-light";
            }
        },
        goToPage(name) {
            if (name == this.$route.name) return;
            this.$router.push({
                name,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
#content {
    display: flex;
    width: 100%;
    height: 100%;
}

.sidebar {
    width: 240px;
    min-width: 240px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;

    & .logo {
        margin-top: 40px;
        margin-bottom: 40px;
    }

    & button {
        margin-bottom: 8px;
    }
}

.view-out {
    flex: 1 auto;
    display: flex;
    flex-direction: column;

    & .header {
        height: auto;
        font-size: 2.25rem;
        margin-bottom: 20px;
        text-transform: capitalize;
        padding: 20px 20px 0px 20px;
    }

    & .view {
        padding: 20px 20px 0px 20px;
        overflow: auto;
        height: 100%;
    }
}

.logo {
    width: 180px;
}
</style>