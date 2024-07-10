<script>
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            year: null,
            startingMonth: null,
            months: null,
            colors: ['#f4edfd', '#d8baf5', '#b48af2', '#7e4ef1', '#4b2c8c'],
            data: {},
            toast: useToast()
        };
    },
    async created() {
        await this.getAnilist('RecNove');
        const currentDate = new Date();
        const startingMonth = new Date(Object.keys(this.data)[0]).getMonth();

        const months = [];
        for (let i = 1; i < 7; i++) {
            const monthIndex = (startingMonth + i) % 12;
            months.push(this.getMonthName(monthIndex));
        }

        this.year = currentDate.getFullYear();
        this.startingMonth = startingMonth;
        console.log(this.data);
        this.months = months;
    },
    methods: {
        getMonthName(monthIndex) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames[monthIndex];
        },
        async getAnilist(AnilistUsername) {
            try {
                RESTAPI.ObterAnilist(AnilistUsername)
                    .then((response) => {
                        const activityHistory = response.data;
                        this.data = this.processData(activityHistory);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.toast.add({
                            severity: 'error',
                            summary: error,
                            life: 3000
                        });
                    });
            } catch (error) {
                console.log(error);
                this.toast.add({
                    severity: 'error',
                    summary: error,
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
        processData(activityHistory) {
            const activityData = {};

            activityHistory.forEach((entry) => {
                const timestamp = entry.date;
                if (timestamp === null || timestamp === undefined || isNaN(timestamp)) {
                    console.error('Invalid timestamp:', timestamp);
                    return;
                }
                const date = new Date(timestamp * 1000);
                const formattedDate = this.formatDate(date);
                activityData[formattedDate] = entry.amount;
            });

            activityData;
            return activityData;
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
        getColor(monthIndex, day) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonthIndex = currentDate.getMonth();
            const lastSixMonths = (monthIndex - this.startingMonth + 6) % 12;
            const monthToCheck = (currentMonthIndex - lastSixMonths + 12) % 12;
            const date = new Date(currentYear, monthToCheck, day);
            //Problema no Código que ajuda na formatação da data na Linha abaixo
            /* const formattedDate = date.toISOString().split('T')[0]; */
            const value = this.data[date] || 0;

            if (value >= 10) return this.colors[4];
            if (value >= 7) return this.colors[3];
            if (value >= 5) return this.colors[2];
            if (value >= 1) return this.colors[1];
            return this.colors[0];
        }
    }
};
</script>
<template>
    <div class="card mb-0 center">
        <h2 class="lights">Anilist</h2>
        <a href="https://anilist.co/user/RecNove/" target="_blank" rel="noopener noreferrer">
            <div class="calendar-heatmap">
                <div class="legend">
                    <div v-for="color in colors" :key="color" class="legend-item" :style="{ backgroundColor: color }"></div>
                </div>
                <div class="calendar">
                    <div v-for="(month, index) in months" :key="index" class="month">
                        <p>{{getMonthName(index)}}</p>
                        <div class="month-header">{{ month }}</div>
                        <div class="week" v-for="week in weeksInMonth(year, index)" :key="week">
                            <div v-for="day in daysInWeek(year, index, week)" :key="day" class="day" :style="{ backgroundColor: getColor(index, day) }">
                                {{ day }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

</template>

<style scoped>
.calendar-heatmap {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    font-size: 12px;
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
}
</style>
