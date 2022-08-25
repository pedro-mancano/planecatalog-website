<template>
    <div id="content">
        <div :class="`sidebar ${scrollbarActiveMobile ? 'sidebar-active-mobile' : ''}`">
            <img alt="Logo" class="logo" src="../assets/logo.png" />

            <b-button v-for="(item, index) in buttons" :key="index" :type="getButtonType(item.view)"
                @click="goToPage(item.view)" expanded>
                {{ $t(item.name) }}
            </b-button>

            <div class="bottom">
                <b-dropdown aria-role="list" expanded position="is-top-left">
                    <template #trigger>
                        <b-button :label="$t('language')" type="is-primary is-light" icon-left="language" expanded />
                    </template>

                    <b-dropdown-item v-for="(language, languageIndex) in languages" :key="languageIndex"
                        @click="changeLanguage(language)">
                        {{ language }}
                    </b-dropdown-item>
                </b-dropdown>
            </div>

            <div v-if="isMobile" class="sidebar-swtich">
                <b-button @click="toggleSidebar" icon-left="bars" type="is-light" />
            </div>
        </div>
        <div class="view-out">
            <div class="header">
                <span>{{ $t($route.name.toLocaleLowerCase()) }}</span>
            </div>
            <div class="view">
                <router-view />
            </div>
            <div class="sidebar-background" v-if="scrollbarActiveMobile" @click="toggleSidebar">
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
            scrollbarActiveMobile: false
        };
    },
    computed: {
        languages() {
            return Object.keys(this.$i18n.messages);
        }
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
            if (this.isMobile()) {
                this.toggleSidebar();
            }
        },
        changeLanguage(language) {
            this.$i18n.locale = language;
        },
        isMobile() {
            return window.innerWidth < 768;
        },
        toggleSidebar() {
            this.scrollbarActiveMobile = !this.scrollbarActiveMobile;
        }
    },
};
</script>

<style lang="scss" scoped>
#content {
    display: flex;
    width: 100%;
    height: 100%;
}

.sidebar-background {
    display: none;

    @media screen and (max-width: 768px) {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000000cc;
        z-index: 998;
    }
}

.sidebar {
    width: 240px;
    min-width: 240px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    left: 0px;

    & .sidebar-swtich {
        display: none;
    }

    @media (max-width: 768px) {
        position: absolute;
        z-index: 999;
        background: white;
        height: 100%;
        left: -240px;
        transition: left ease-in-out 0.3s;

        & .sidebar-swtich {
            position: absolute;
            top: 20px;
            width: 40px;
            height: 40px;
            left: 220px;
            display: block;
        }

        &.sidebar-active-mobile {
            left: 0px !important;
        }
    }

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

    @media screen and (max-width: 768px) {
        overflow-x: hidden;
        overflow-y: auto;
        width: 100vw;
    }

    & .header {
        height: auto;
        font-size: 2.25rem;
        margin-bottom: 20px;
        text-transform: capitalize;
        padding: 20px 20px 0px 20px;

        @media screen and (max-width: 768px) {
            margin-bottom: 0px;
            padding: 11px 20px 0px 20px;
        }
    }

    & .view {
        padding: 20px 20px 0px 20px;
        overflow: auto;
        height: 100%;

        @media screen and (max-width: 768px) {
            padding: 20px;
        }
    }
}

.logo {
    width: 180px;
}

.bottom {
    margin-top: auto;
    width: 100%;
}
</style>