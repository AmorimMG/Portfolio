<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    isGlitchActive: Boolean,
    discordData: Promise
});

const discordValue = ref(null);

props.discordData.then((response) => {
    discordValue.value = response.data;
});
</script>
<template>
    <template v-if="discordValue && discordValue.activities.length > 0" v-for="activity in discordValue?.activities">
        <div v-if="activity && activity.assets && activity.assets.large_text && (activity.application_id || activity.session_id)" class="col-4 lg:col-4 xl:col-3">
            <div class="card mb-0 center" style="padding: 0">
                <h6>{{ activity.assets.large_text }}</h6>
                <img v-if="activity.application_id && activity.assets.large_image" :src="`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`" alt="Discord" />
                <img v-else-if="activity.session_id && activity.assets.large_image" :src="`https://i.scdn.co/image/${activity.assets.large_image.replace('spotify:', '')}`" alt="Spotify" />
            </div>
        </div>
    </template>
</template>
<style scoped>
img {
    width: 50px;
    height: 50px;
}
</style>
