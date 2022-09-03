<template>
    <div>
        <b-modal v-model="localEnabled" :width="isMobile() ? '92vw' : '640px'" scroll="keep" @close="closeModal"
            @after-enter="enderModal">
            <div class="modalContainer">
                <div class="model-card">
                    <div class="model-card__header">
                        <div class="model-card__title">
                            <h1 class="title">
                                <span>{{ $t('customparam.title') }}</span>
                            </h1>
                        </div>

                        <b-button icon-left="plus" type="is-primary" @click="addParam">
                            {{ $t("customparam.add") }}
                        </b-button>
                    </div>

                    <div class="params">
                        <div v-for="(param, index) of params" :key="index">
                            <b-field>
                                <p class="control">
                                    <span class="button is-static">{{ $t('customparam.name') }}</span>
                                </p>
                                <b-input v-model="param.name" :placeholder="$t('customparam.paramname')" expanded>
                                </b-input>
                                <p class="control">
                                    <span class="button is-static">{{ $t('customparam.unit') }}</span>
                                </p>
                                <b-input v-model="param.unit" :placeholder="$t('customparam.paramunit')" expanded>
                                </b-input>
                            </b-field>
                            <b-field>
                                <p class="control" @mouseenter="tooltipEnter(param)" @mouseleave="tooltipLeave(param)">
                                    <span class="button is-static">
                                        <b-tooltip size="is-large" position="is-right" class="tooltip-help"
                                            :active="param.tooltipState" multilined always>
                                            <b-icon icon="circle-question">
                                            </b-icon>
                                            <template v-slot:content>
                                                <div class="tooltip-help-p">
                                                    <p>{{ $t('customparam.formulahelp') }}</p>
                                                    <br />
                                                    <span v-if="param.refs.length != 0">
                                                        <p v-for="(ref, refIndex) of param.refs" :key="refIndex">
                                                            {{ `${ref.name}: ${$t('planeparams.' + ref.ref.name)}` }}
                                                        </p>
                                                    </span>
                                                    <p v-else><b>{{ $t('customparam.norefs') }}</b></p>
                                                </div>
                                            </template>
                                        </b-tooltip>
                                        <span>{{ `f(${param.refs.map(e => e.name).join(', ')}) = ` }}</span>
                                    </span>
                                </p>
                                <b-input v-model="param.expression" :placeholder="$t('customparam.yourfunction')"
                                    expanded>
                                </b-input>
                                <p class="control">
                                    <b-button type="is-danger" icon-left="xmark" @click="remove(param)" />
                                </p>
                            </b-field>
                            <hr v-if="index != params.length - 1">
                        </div>
                    </div>


                    <div class="model-card__footer">
                        <div class="footer-buttons">
                            <b-button type="is-success" @click="save">
                                {{ $t("save") }}
                            </b-button>
                            <b-button type="is-danger" @click="close">
                                {{ $t("close") }}
                            </b-button>
                        </div>
                    </div>

                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import * as MathJS from 'mathjs';

export default {
    data() {
        return {
            params: [],
            timeout: null,
        };
    },
    props: [
        'enabled',
        'customParams',
        'activeParams'
    ],
    methods: {
        isMobile() {
            return window.innerWidth < 768;
        },
        calculateCharCodes(length) {
            //97 - 122 -> a-z
            //65 - 90 -> A-Z
            //e = 101
            //i = 105
            //E = 69
            var newArr = [];
            for (var i = 0; i < length; i++) {
                if (i == 0) {
                    newArr.push(97);
                } else {
                    var expected = newArr[i - 1] + 1;
                    if (expected == 101) expected++;
                    if (expected == 105) expected++;
                    if (expected == 69) expected++;

                    if (expected > 122) {
                        expected = 65 + (expected - 122) - 1;
                        if (expected > 90) {
                            throw new Error("Too many parameters");
                        } else {
                            newArr.push(expected);
                        }
                    } else {
                        newArr.push(expected);
                    }
                }
            }
            return newArr.map(e => String.fromCharCode(e)).join('');
        },
        generateRefs() {
            var refs = [];
            var codes = this.calculateCharCodes(this.activeParams.length)
            for (var i = 0; i < this.activeParams.length; i++) {
                refs.push({
                    ref: this.activeParams[i],
                    name: codes[i]
                });
            }
            return refs;
        },
        tooltipEnter(param) {
            this.timeout = setTimeout(() => {
                param.tooltipState = true;
            }, 200);
        },
        tooltipLeave(param) {
            clearTimeout(this.timeout);
            param.tooltipState = false;
        },
        addParam() {
            this.params.push({
                name: '',
                unit: '',
                expression: '',
                refs: this.generateRefs(),
                tooltipState: false,
                code: null,
                custom: true
            });
        },
        remove(param) {
            this.params.splice(this.params.indexOf(param), 1);
        },
        close() {
            this.localEnabled = false;
            this.closeModal();
        },
        toastError() {
            this.$buefy.toast.open({
                message: this.$t('customparam.error'),
                type: 'is-danger',
                position: 'is-bottom',
                duration: 3000
            });
        },
        save() {
            var ids = [];
            for (var param of this.params) {
                param.name = param.name.trim();
                param.id = param.name.toLowerCase().replace(/ /g, '_');
                if (ids.includes(param.id)) {
                    this.toastError();
                    return;
                }
                ids.push(param.id);
                if (param.name == '' || param.expression == '') {
                    this.toastError();
                    return;
                }
                param.unit = param.unit.trim() || '';
                try {
                    var scope = {};
                    param.refs.forEach(element => {
                        scope[element.name] = 0;
                    });
                    MathJS.evaluate(param.expression, scope);
                    param.code = MathJS.compile(param.expression);
                } catch (e) {
                    this.toastError();
                    return;
                }
            }
            this.$emit('save', this.localCustomParams, this.params);
            this.localCustomParams = this.params;
            this.localEnabled = false;
        },
        closeModal() {
            this.params = [];
        },
        ensureParams() {
            var toRemoveList = [];
            for (var param of this.localCustomParams) {
                for (var ref of param.refs) {
                    if (!this.activeParams.includes(ref.ref)) {
                        toRemoveList.push(param);
                    }
                }
            }
            for (var paramToRemove of toRemoveList) {
                this.localCustomParams = this.localCustomParams.filter(e => e != paramToRemove);
            }
            this.params = this.localCustomParams.map(e => Object.assign({}, e));
        },
        enderModal() {
            this.ensureParams();
        }
    },
    computed: {
        localEnabled: {
            get() {
                return this.enabled
            },
            set(newValue) {
                this.$emit('update:enabled', newValue)
            },
        },
        localCustomParams: {
            get() {
                return this.customParams
            },
            set(newValue) {
                this.$emit('update:customParams', newValue)
            },
        },
    }
}
</script>

<style lang="scss" scoped>
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

.params {
    padding: 0px 20px;
    overflow-y: auto;
    flex-grow: 1;
    margin-top: 20px;
    overflow: visible;
}

.footer-buttons {
    &>:not(:last-child) {
        margin-right: 10px;
    }
}

.tooltip-help {
    width: 24px;
}

.tooltip-help-p {
    text-align: left;
}
</style>