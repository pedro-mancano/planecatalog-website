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
        };
    },
    props: [
        'data',
        'type',
        'options'
    ],
    created() {
        ChartJS.Chart.register(...ChartJS.registerables);
    },
    updated() {
        this.draw();
    },
    mounted() {
        this.$refs.canv.height = 400;
        this.$refs.canv.width = 400;
        this.ctx = this.$refs.canv.getContext('2d');
        this.draw();
    },
    unmonutted() {
        if (this.currentChart) {
            this.currentChart.destroy();
        }
    },
    methods: {
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
        draw() {
            if (this.currentChart) {
                this.currentChart.destroy();
            }
            for (let key in this.options) {
                if (!this.options[key]) {
                    return;
                }
            }
            switch (this.type) {
                case 'scatter':
                    this.drawTypeScatter();
                    break;
                case 'column':
                    this.drawTypeColumns();
                    break;
            }
        },
        drawTypeColumns() {
            this.currentChart = new ChartJS.Chart(this.ctx, {
                type: 'bar',
                data: {
                    labels: this.data.map((d) => d.name),
                    datasets: [{
                        label: this.$t('planeparams.' + this.options[1]),
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
                            type: 'linear',
                            title: {
                                display: true,
                                text: this.$t(`planeparams.${this.options[1]}`),
                            },
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: this.$t(`planeparams.${this.options[1]}`),
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
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: this.$t(`planeparams.${this.options[0]}`),
                            },
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: this.$t(`planeparams.${this.options[1]}`),
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
                            text: `${this.$t(`planeparams.${this.options[0]}`)} vs ${this.$t(`planeparams.${this.options[1]}`)}`,
                        }
                    }
                },
            })
        }
    },
}
</script>