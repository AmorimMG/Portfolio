<script setup>
import CardEffect from '../CardEffect.vue';
import Discord from '../Cards/Discord.vue';
import Valorant from '../Cards/Valorant.vue';
import Weather from '../Cards/Weather.vue';
import LastFMModal from '../Modals/LastFMModal.vue';
</script>
<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3">
        <CardEffect>
            <div class="card clusterT" style="padding: 0">
                <div class="card-wrapper">
                    <div class="card-body">
                        <LastFMModal />
                    </div>
                    <div class="card-body">
                        <Discord />
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="card-body">
                        <Weather />
                    </div>
                    <div class="card-body">
                        <Valorant />
                    </div>
                </div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.clusterT {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.card-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
}

.card-body {
    border: 1px solid #4d25b0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
