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
            colorCycle: ['1f77b4', 'ff7f0e', '2ca02c', 'd62728', '9467bd', '8c564b', 'e377c2', '7f7f7f', 'bcbd22', '17becf'],
        };
    },
    props: [
        'data',
        'type',
        'options',
        'show'
    ],
    created() {
        ChartJS.Chart.register(ChartJS.LinearScale, ChartJS.ScatterController, ChartJS.PointElement, ChartJS.Tooltip, ChartJS.Title);
    },
    methods: {
        generateColorForIndex(i) {
            return '#' + this.colorCycle[i % this.colorCycle.length];
        },
    },
    mounted() {
        this.$refs.canv.height = 400;
        this.$refs.canv.width = 400;
        var ctx = this.$refs.canv.getContext('2d');
        new ChartJS.Chart(ctx, {
            type: this.type,
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
    },
}
</script>