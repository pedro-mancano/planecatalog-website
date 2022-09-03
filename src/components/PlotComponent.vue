<template>
    <div>
        <canvas ref="canv"></canvas>
    </div>
</template>

<script>

import * as ChartJS from 'chart.js';

export default {
    data() {
        return {
            colorCycle: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
            ctx: null,
            currentChart: null,
            units: [

            ]
        };
    },
    props: [
        'data',
        'type',
        'options',
        'log-scale',
        'selectedParams'
    ],
    created() {
        ChartJS.Chart.register(...ChartJS.registerables);
    },
    updated() {
        this.draw();
    },
    mounted() {
        var isMobile = window.innerWidth < 768;
        this.$refs.canv.height = isMobile ? window.innerWidth * 0.8 : 400;
        this.$refs.canv.width = isMobile ? window.innerWidth * 0.8 : 400;
        this.ctx = this.$refs.canv.getContext('2d');
        this.draw();
    },
    unmonutted() {
        if (this.currentChart) {
            this.currentChart.destroy();
        }
    },
    methods: {
        generateUnits() {
            this.units = [
                `${this.searchParamByName(this.options[0]).unit ? ' [' + this.searchParamByName(this.options[0]).unit + ']' : ''}`,
                `${this.searchParamByName(this.options[1]).unit ? ' [' + this.searchParamByName(this.options[1]).unit + ']' : ''}`
            ]
        },
        searchParamByName(i) {
            var found = this.selectedParams.find((param) => param.name == i.trim());
            return found || {};
        },
        generateColorForIndex(i) {
            return this.colorCycle[i % this.colorCycle.length];
        },
        compareArrays(arr1, arr2) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        },
        getScale(axis) {
            if (this.logScale[axis]) {
                return 'logarithmic';
            }
            return 'linear';
        },
        draw() {
            if (this.currentChart) {
                this.currentChart.destroy();
            }
            for (let key in this.options) {
                if (!this.options[key]) {
                    return;
                }
            }
            this.generateUnits();
            switch (this.type) {
                case 'scatter':
                    this.drawTypeScatter();
                    break;
                case 'column':
                    this.drawTypeColumns();
                    break;
            }
        },
        betterTranslate(text) {
            var search = this.searchParamByName(text);
            return search.custom ? search.name : this.$t('planeparams.' + search.name);
        },
        drawTypeColumns() {
            this.currentChart = new ChartJS.Chart(this.ctx, {
                type: 'bar',
                data: {
                    labels: this.data.map((d) => d.name),
                    datasets: [{
                        label: this.betterTranslate(this.options[1]),
                        data: this.data.map((d) => d[this.options[1]]),
                        backgroundColor: this.colorCycle,
                        borderColor: this.colorCycle,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            type: this.getScale(1),
                            title: {
                                display: true,
                                text: `${this.betterTranslate(this.options[1])}${this.units[1]}`,
                            },
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `${this.betterTranslate(this.options[1])}${this.units[1]}`,
                        },
                        legend: {
                            display: false,
                        }
                    }
                }
            })
        },
        drawTypeScatter() {
            this.currentChart = new ChartJS.Chart(this.ctx, {
                type: 'scatter',
                data: {
                    datasets: this.data.map((el, i) => {
                        return {
                            label: el.name,
                            data: [
                                [el[this.options[0]], el[this.options[1]]],
                            ],
                            backgroundColor: this.generateColorForIndex(i),
                            borderColor: this.generateColorForIndex(i),
                            borderWidth: 1,
                            pointRadius: 3,
                        }
                    })
                },
                options: {
                    scales: {
                        x: {
                            type: this.getScale(0),
                            position: 'bottom',
                            title: {
                                display: true,
                                text: `${this.betterTranslate(this.options[0])}${this.units[0]}`,
                            },
                        },
                        y: {
                            type: this.getScale(1),
                            position: 'left',
                            title: {
                                display: true,
                                text: `${this.betterTranslate(this.options[1])}${this.units[1]}`,
                            },
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                label: function (data) {
                                    var name = data.dataset.label;
                                    return name;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: `${this.betterTranslate(this.options[0])}${this.units[0]} vs ${this.betterTranslate(this.options[1])}${this.units[1]}`,
                        }
                    }
                },
            })
        }
    },
}
</script>