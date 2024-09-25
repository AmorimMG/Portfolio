<script>
import { useToast } from "primevue/usetoast";
import { RESTAPI } from "../../service/api.js";
import CardEffect from "../CardEffect.vue";

export default {
	components: {
		CardEffect,
	},
	data() {
		return {
			year: null,
			startingMonth: null,
			months: null,
			GithubColors: ["#e0f7e0", "#c0ebc0", "#a3d9a3", "#7bc97b", "#4caf50"],
			data: {},
			toast: useToast(),
		};
	},
	async created() {
		try {
			await this.getGithub("AmorimMG");

			const currentDate = new Date();

			// Ensure Object.keys(this.data)[0] is a valid date string
			const firstDateKey = Object.keys(this.data)[0];
			const startingMonth = firstDateKey
				? new Date(firstDateKey).getMonth()
				: currentDate.getMonth();

			const months = [];
			for (let i = 1; i < 7; i++) {
				const monthIndex = (startingMonth + i) % 12;
				months.push(this.getMonthName(monthIndex));
			}

			this.year = currentDate.getFullYear();
			this.startingMonth = startingMonth;
			console.log("Data:", this.data);
			console.log("Starting month index:", startingMonth);
			this.months = months;
		} catch (error) {
			console.error("Error in created hook:", error);
			this.toast.add({
				severity: "error",
				summary: "Error in component initialization",
				life: 3000,
			});
		}
	},
	methods: {
		getMonthName(monthIndex) {
			const monthNames = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			return monthNames[monthIndex];
		},

		async getGithub(GithubUsername) {
			try {
				const response = await RESTAPI.ObterGithub(GithubUsername);
				const commits = response.data;

				for (const commit of commits) {
					const date = new Date(commit.commit.author.date);
					this.processGithubData({
						date: date.toISOString().split("T")[0],
						contributionCount: 1,
					});
				}

				console.log("GitHub raw data:", commits);
			} catch (error) {
				console.log(error);
				this.toast.add({
					severity: "error",
					summary: error.message,
					life: 3000,
				});
			}
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
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
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
			const currentMonthIndex = new Date().getMonth();
			const lastSixMonths = (monthIndex - this.startingMonth + 6) % 12;
			const monthToCheck = (currentMonthIndex - lastSixMonths + 12) % 12;
			const date = new Date(currentYear, monthToCheck, day);
			const formattedDate = this.formatDate(date);

			const githubValue = this.data.github?.[formattedDate] || 0;
			return this.getGithubColor(githubValue);
		},
	},
};
</script>

<template>
    <div class="col-12 lg:col-12 xl:col-12">
        <CardEffect>
            <div class="card mb-0 center">
                    <div class="calendar-heatmap">
                        <div class="flex w-full gap-1 justify-content-between">
                            <div class="legend-container">
                                <div class="legend">
                                    <div v-for="color in GithubColors" :key="color" class="legend-item" :style="{ backgroundColor: color }"></div>
                                </div>
                                <h2 class="lights center">Github</h2>
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
