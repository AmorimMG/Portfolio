<script>
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';
import CardEffect from '../CardEffect.vue';

export default {
    components: {
        CardEffect
    },
    data() {
        return {
            year: null,
            startingMonth: null,
            months: null,
/*             AnilistColors: ['#f4edfd', '#d8baf5', '#b48af2', '#7e4ef1', '#4b2c8c'], */
            GithubColors: ['#e0f7e0', '#c0ebc0', '#a3d9a3', '#7bc97b', '#4caf50'],
            data: {},
            toast: useToast()
        };
    },
    async created() {
        try {
            await this.getGithub('AmorimMG');
/*             await this.getAnilist('RecNove'); */

            const currentDate = new Date();

            // Ensure Object.keys(this.data)[0] is a valid date string
            const firstDateKey = Object.keys(this.data)[0];
            const startingMonth = firstDateKey ? new Date(firstDateKey).getMonth() : currentDate.getMonth();

            const months = [];
            for (let i = 1; i < 7; i++) {
                const monthIndex = (startingMonth + i) % 12;
                months.push(this.getMonthName(monthIndex));
            }

            this.year = currentDate.getFullYear();
            this.startingMonth = startingMonth;
            console.log('Data:', this.data);
            console.log('Starting month index:', startingMonth);
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
/*         async getAnilist(AnilistUsername) {
            try {
                const response = await RESTAPI.ObterAnilist(AnilistUsername);
                const activityHistory = response.data;
                console.log('Anilist raw data:', activityHistory);
                this.processAnilistData(activityHistory); // Process and assign data
            } catch (error) {
                console.log(error);
                this.toast.add({
                    severity: 'error',
                    summary: error,
                    life: 3000
                });
            }
        }, */

        async getGithub(GithubUsername) {
            try {
                const response = await RESTAPI.ObterGithub(GithubUsername);
                const contributions = response.data;

                contributions.map((weeks) => {
                    console.log(weeks.contributionDays);

                    const week = weeks.contributionDays;
                    week.forEach((day) => {
                        console.log(day);
                        this.processGithubData(day);
                    });
                });

                console.log('GitHub raw data:', contributions);
            } catch (error) {
                console.log(error);
                this.toast.add({
                    severity: 'error',
                    summary: error.message,
                    life: 3000
                });
            }
        },

        processAnilistData(data) {
            const activityData = {};

            if (Array.isArray(data)) {
                data.forEach((entry) => {
                    const timestamp = entry.date;
                    if (timestamp === null || timestamp === undefined || isNaN(timestamp)) {
                        console.error('Invalid timestamp:', timestamp);
                        return;
                    }
                    const date = new Date(timestamp * 1000);
                    const formattedDate = this.formatDate(date);
                    activityData[formattedDate] = entry.amount;
                });
            } else {
                console.error('Unknown Anilist data format:', data);
            }

            console.log('Processed Anilist data structure:', activityData);
            this.data = { ...activityData };
            console.log('Assigned Anilist data:', this.data);
            return activityData;
        },

        processGithubData(day) {
            const date = new Date(day.date);
            const formattedDate = this.formatDate(date);

            // Ensure this.data is initialized as an object if it's initially null or undefined
            if (!this.data[formattedDate]) {
                this.data[formattedDate] = 0; // Initialize to zero if not yet defined
            }

            this.data[formattedDate] += day.contributionCount; // Accumulate contributions for the date
            return this.data; // Return updated data object
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

/*         getAnilistColor(value) {
            if (value >= 10) return this.AnilistColors[4];
            if (value >= 7) return this.AnilistColors[3];
            if (value >= 5) return this.AnilistColors[2];
            if (value >= 1) return this.AnilistColors[1];
            return this.AnilistColors[0];
        }, */

        getColor(monthIndex, day) {
            const currentYear = new Date().getFullYear();
            const currentMonthIndex = new Date().getMonth();
            const lastSixMonths = (monthIndex - this.startingMonth + 6) % 12;
            const monthToCheck = (currentMonthIndex - lastSixMonths + 12) % 12;
            const date = new Date(currentYear, monthToCheck, day);
            const formattedDate = this.formatDate(date);

            const githubValue = (this.data.github && this.data.github[formattedDate]) || 0;
            const anilistValue = (this.data.anilist && this.data.anilist[formattedDate]) || 0;

            if (githubValue > 0 && anilistValue > 0) {
                // If both GitHub and Anilist data exist for the date, choose GitHub color
                return this.getGithubColor(githubValue);
            } else if (githubValue > 0) {
                // Only GitHub data exists
                return this.getGithubColor(githubValue);
            } else if (anilistValue > 0) {
                // Only Anilist data exists
                return this.getAnilistColor(anilistValue);
            } else {
                // No data available
                return '#ffffff'; // Default color
            }
        }
    },

    getColor2(monthIndex, day) {
        const currentYear = new Date().getFullYear();
        const currentMonthIndex = new Date().getMonth();
        const lastSixMonths = (monthIndex - this.startingMonth + 6) % 12;
        const monthToCheck = (currentMonthIndex - lastSixMonths + 12) % 12;
        const date = new Date(currentYear, monthToCheck, day);
        const formattedDate = this.formatDate(date);

        const value = this.data[formattedDate] || 0; // Access data using formatted date

        if (value >= 10) return this.AnilistColors[4];
        if (value >= 7) return this.AnilistColors[3];
        if (value >= 5) return this.AnilistColors[2];
        if (value >= 1) return this.AnilistColors[1];
        return this.AnilistColors[0];
    }
};
</script>

<template>
    <div id="Anilist" class="col-12 lg:col-12 xl:col-12">
        <CardEffect>
            <div class="card mb-0 center">
                <a href="https://anilist.co/user/RecNove/" target="_blank" rel="noopener noreferrer">
                    <div class="calendar-heatmap">
                        <div class="flex w-full gap-1 justify-content-between">
                            <div class="legend-container">
                                <div class="legend">
                                    <div v-for="color in GithubColors" :key="color" class="legend-item" :style="{ backgroundColor: color }"></div>
                                </div>
                                <h2 class="lights center">Github</h2>
                            </div>
                            <div class="legend-container">
                                <div class="legend">
                                    <div v-for="color in AnilistColors" :key="color" class="legend-item" :style="{ backgroundColor: color }"></div>
                                </div>
                                <h2 class="lights center">Anilist</h2>
                            </div>
                        </div>
                        <div class="calendar">
                            <div v-for="(month, index) in months" :key="index" class="month">
                                <p>{{ month }}</p>
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
