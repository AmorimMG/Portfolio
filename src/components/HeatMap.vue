<script>
import { defineComponent } from 'vue';
import VueCalendarHeatmap from 'vue-calendar-heatmap';
import axios from 'axios';

export default defineComponent({
  name: 'HeatMap',
  props: {
    className: String
  },
  data() {
    return {
      rawData: [],
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      data: [
        { date: '2024-03-01', count: 5 },
        { date: '2024-03-10', count: 10 },
        { date: '2024-03-15', count: 15 },
        // Add more data as needed
      ],
    };
  },
  computed: {
    heatmapData() {
      return this.rawData.map(dataPoint => ({
        date: new Date(dataPoint.date * 1000).toISOString().slice(0, 10),
        value: dataPoint.amount
      }));
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.post('https://graphql.anilist.co', {
          query: `
            query($id:Int,$name:String){
              User(id:$id,name:$name){
                stats{
                  activityHistory{
                    date
                    amount
                    level
                  }
                }
              }
            }
          `,
          variables: {
            name: 'RecNove',
          },
        });

        if (response.data && response.data.data && response.data.data.User) {
          this.rawData = response.data.data.User.stats.activityHistory;
        }
      } catch (error) {
        console.error('Error fetching raw data:', error);
      }
    },
    getColor(value) {
      return value > 5 ? '#4CAF50' : '#F44336';
    }
  },
  components: {
    VueCalendarHeatmap
  }
});
</script>

<template>
  <div>
    <vue-calendar-heatmap :data="data" :color-range="['#eeeeee', '#008000']" :month-format="'YYYY-MM'" />
    <div :class="[
      'group min-h-[21rem] bg-violet-700/20 p-3 hover:cursor-pointer hover:brightness-75',
      'mb-4 flex flex-col backdrop-blur sm:col-span-6 sm:h-[26rem] md:mb-0 md:h-[22rem] text-center',
    ]">
      <span class="block font-mono text-xl font-bold text-pink-200 line-through md:text-glow-violet-500">ANILIST</span>
      <a href="https://anilist.co/user/RecNove/" target="_blank" rel="noopener noreferrer" class="lights relative h-48 w-full rounded-md bg-violet-700/20 backdrop-blur hover:cursor-pointer hover:brightness-75 sm:h-full">
        <VueCalendarHeatmap :data="heatmapData" :color="getColor" :startDate="startDate" :endDate="endDate" />
      </a>
    </div>
  </div>
</template>