<script setup>
import { useLayout } from '@/layout/composables/layout';
import Chart from 'primevue/chart';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    lastFMData: Object
});

const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const lineData = ref(null);
const pieData = ref(null);
const polarData = ref(null);
const barData = ref(null);
const radarData = ref(null);

const lineOptions = ref(null);
const pieOptions = ref(null);
const polarOptions = ref(null);
const barOptions = ref(null);
const radarOptions = ref(null);

const generateColorPalette = (numColors) => {
    const colors = [];
    const saturation = '70%';
    const lightness = '50%';

    for (let i = 0; i < numColors; i++) {
        const hue = Math.floor((i * 360) / numColors);
        colors.push(`hsl(${hue}, ${saturation}, ${lightness})`);
    }

    return colors;
};

const fetchLastFMData = async () => {
    try {
        const data = props.lastFMData ?? [];


        const labels = data.map(track => track.name);
        const dataSet = data.map(track => parseInt(track.playcount));
        const colors = generateColorPalette(dataSet.length);

        barData.value = {
            labels: labels,
            datasets: [
                {
                    label: 'Track Play Counts',
                    backgroundColor: colors,
                    borderColor: colors,
                    data: dataSet
                }
            ]
        };

        pieData.value = {
            labels: labels,
            datasets: [
                {
                    data: dataSet,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors.map(color => color.replace('50%', '40%'))
                }
            ]
        };

        radarData.value = {
            labels: labels,
            datasets: [
                {
                    label: 'Play Counts',
                    borderColor: colors,
                    pointBackgroundColor: colors,
                    pointBorderColor: colors,
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: colors,
                    data: dataSet
                }
            ]
        };

        lineData.value = {
            labels: labels,
            datasets: [
                {
                    label: 'Play Counts',
                    data: dataSet,
                    fill: false,
                    backgroundColor: colors,
                    borderColor: colors,
                    tension: 0.4
                }
            ]
        };

        polarData.value = {
            datasets: [
                {
                    data: dataSet,
                    backgroundColor: colors,
                    label: 'Play Counts'
                }
            ],
            labels: labels
        };

    } catch (error) {
        console.error('Error fetching LastFM data:', error);
    }
};

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const setChart = () => {
    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    polarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };

    radarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: textColorSecondary
                }
            }
        }
    };
};

watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart();
    },
    { immediate: true }
);

onMounted(() => {
    fetchLastFMData(); // Fetch data when the component is mounted
});
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Listened Music's</h5>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Bar Chart</h5>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Pie Chart</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Doughnut Chart</h5>
                <Chart type="doughnut" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Polar Area Chart</h5>
                <Chart type="polarArea" :data="polarData" :options="polarOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Radar Chart</h5>
                <Chart type="radar" :data="radarData" :options="radarOptions"></Chart>
            </div>
        </div>
    </div>
</template>
