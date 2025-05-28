<script>
import { useToast } from 'primevue/usetoast';
import { RESTAPI } from '../../service/api.js';
import CardEffect from '../CardEffect.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';

export default {
    components: {
        CardEffect,
        VueNeonLight
    },
    data() {
        return {
            year: null,
            startingMonth: null,
            months: null,
            GithubColors: ['#fff', '#9b7ba1', '#8a5b95', '#743179', '#692785'],
            data: [],
            toast: useToast()
        };
    },
    async created() {
        try {
            await this.getGithub('AmorimMG');

            const currentDate = new Date();
            this.year = currentDate.getFullYear();
            this.startingMonth = currentDate.getMonth();

            const months = [];
            for (let i = 0; i < 6; i++) {
                const monthIndex = (this.startingMonth - i + 12) % 12;
                months.unshift(this.getMonthName(monthIndex));
            }
            this.months = months;
        } catch (error) {
            console.error('Error in created hook:', error);
            this.toast.add({
                severity: 'error',
                summary: 'Error in component initialization',
                life: 3000
            });
        }
    },
    methods: {
        getMonthName(monthIndex) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames[monthIndex];
        },

        async getGithub(GithubUsername) {
            try {
                const response = await RESTAPI.ObterGithub(GithubUsername);
                this.data = response.data;
            } catch (error) {
                this.toast.add({
                    severity: 'error',
                    summary: error.message,
                    life: 3000
                });
            }
        },

        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        weeksInMonth(year, monthIndex) {
            const firstDay = new Date(year, monthIndex, 1).getDay();
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            return Math.ceil((firstDay + daysInMonth) / 7);
        },

        daysInWeek(year, monthIndex, week) {
            const start = (week - 1) * 7 + 1;
            const end = Math.min(start + 6, this.daysInMonth(year, monthIndex));
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },

        daysInMonth(year, monthIndex) {
            return new Date(year, monthIndex + 1, 0).getDate();
        },

        getGithubColor(value) {
            if (value >= 10) return this.GithubColors[4];
            if (value >= 7) return this.GithubColors[3];
            if (value >= 5) return this.GithubColors[2];
            if (value >= 1) return this.GithubColors[1];
            return this.GithubColors[0];
        },

        getColor(monthIndex, day) {
            const currentYear = new Date().getFullYear();
            const monthToCheck = this.startingMonth - monthIndex;
            const date = new Date(currentYear, monthToCheck < 0 ? monthToCheck + 12 : monthToCheck, day);
            const formattedDate = this.formatDate(date);

            let contributionCount = 0;
            for (const item of this.data) {
                for (const contributionDay of item.contributionDays) {
                    if (contributionDay.date === formattedDate) {
                        contributionCount = contributionDay.contributionCount;
                        break;
                    }
                }
            }
            return this.getGithubColor(contributionCount);
        }
    }
};
</script>

<template>
    <div class="col-span-12 lg:col-span-12 xl:col-span-12">
        <CardEffect>
            <div id="GithubHeatMap" class="card mb-0 center">
                <div class="calendar-heatmap">
                    <div class="flex w-full gap-1 justify-between">
                        <div class="legend-container">
                            <div class="legend">
                                <div v-for="color in GithubColors" :key="color" class="legend-item"
                                    :style="{ backgroundColor: color }"></div>
                            </div>
                            <VueNeonLight color="white" size="25px" :flash="false"> Github </VueNeonLight>
                        </div>
                    </div>
                    <div class="calendar">
                        <div v-for="(month, index) in months" :key="index" class="month">
                            <p style="color: white; margin-top: 10px">{{ month }}</p>
                            <div class="week" v-for="week in weeksInMonth(year, index)" :key="week">
                                <div v-for="day in daysInWeek(year, index, week)" :key="day" class="day"
                                    :style="{ backgroundColor: getColor(index, day) }">
                                    {{ day }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.card {
    max-height: 300px;
}

.calendar-heatmap {
    scale: 0.9;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.legend-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.legend {
    display: flex;
    justify-content: space-between;
    width: 150px;
    margin-bottom: 10px;
}

.legend-item {
    width: 15px;
    height: 15px;
    flex-direction: row;
    display: flex;
}

.calendar {
    display: flex;
}

.month {
    margin: 0 5px;
}

.month-header {
    text-align: center;
    font-weight: bold;
    margin-bottom: 3px;
}

.week {
    display: flex;
}

.day {
    width: 15px;
    height: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1px;
    font-size: 10px;
    cursor: pointer;
    color: black;
}
</style>
