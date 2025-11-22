<script>
import { useToast } from 'primevue/usetoast';
import { RESTAPI } from '../../service/api';
import Chart from '../Chart.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

export default {
    components: {
        CustomDialog,
        Chart,
        VueNeonLight
    },
    props: {
        header: String
    },
    data() {
        return {
            lastFMData: [],
            lastFMUserData: [],
            imageLoaded: false,
            user: 'RecNove',
            lastFMVisible: false,
            loading: false,
            chartKey: 0
        };
    },
    created() {
        this.toast = useToast();
    },
    computed: {
        uniqueTracks() {
            const seen = new Set();
            return this.lastFMData.filter((track) => {
                const key = track.mbid || track.name;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        },
        topTracks() {
            return this.uniqueTracks.slice(0, 6);
        }
    },

    methods: {
        onHide() {
            this.$emit('close');
            this.lastFMVisible = false;
        },
        formatDate(timestamp) {
            const date = new Date(parseInt(timestamp) * 1000);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        handleImageLoad() {
            this.imageLoaded = true;
        },
        getLastFmUserData(lastFMUsername) {
            this.imageLoaded = false;
            return RESTAPI.ObterUsuarioLastFM(lastFMUsername)
                .then((response) => {
                    this.lastFMUserData = response.data.user;
                })
                .catch((error) => {
                    this.lastFMUserData = {}; // Fallback to an empty object
                    this.toast.add({
                        severity: 'error',
                        summary: error,
                        life: 3000
                    });
                });
        },
        getLastFMInfo(lastFMUsername) {
            return RESTAPI.ObterLastFM(lastFMUsername)
                .then((response) => {
                    this.lastFMData = [...response.data.weeklytrackchart.track];
                    this.chartKey++;
                })
                .catch((error) => {
                    this.lastFMData = []; // Fallback to an empty array
                    this.chartKey++; // Increment key to force re-render of the chart
                    this.toast.add({
                        severity: 'error',
                        summary: error,
                        life: 3000
                    });
                });
        },
        getData() {
            this.loading = true;
            Promise.all([this.getLastFMInfo(this.user), this.getLastFmUserData(this.user)]).finally(() => {
                this.loading = false;
            });
        }
    },
    mounted() {
        this.getData();
    }
};
</script>

<template>
    <div class="col-span-12 lg:col-span-12 xl:col-span-12 pb-0">
        <Button link class="w-full h-full" @click="lastFMVisible = true"
            style="width: 100%; height: 100%; justify-content: center">
            <VueNeonLight size="10px" :flash="false" style="color: white">Last.FM Statics</VueNeonLight>
        </Button>
        <CustomDialog :visible="lastFMVisible" @update:visible="onHide()" :maximized="true" :modal="true"
            class="p-dialog-maximized">
            <div class="h-full">
                <div class="LastFMheader">
                    <div class="flex flex-col md:flex-row items-center justify-between mt-5 p-4 gap-3">
                        <FloatLabel class="w-full md:w-3/4">
                            <InputText id="username" v-model="user" class="w-full" @keyup.enter="getData(user)" />
                            <label for="username">{{ $t('LastFM.Username') }}</label>
                        </FloatLabel>
                        <Button @click="getData(user)" class="w-full md:w-auto">
                            <VueNeonLight size="15px" :flash="false">
                                {{ $t('LastFM.GetInfo') }}
                            </VueNeonLight>
                        </Button>
                    </div>
                    <div v-if="loading" class="mt-4 text-center">
                        <ProgressSpinner style="width: 40px; height: 40px" />
                        <p class="mt-2 text-sm text-color-secondary">{{ $t('LastFM.LoadingUser') }}</p>
                    </div>

                    <div v-else-if="lastFMUserData && lastFMUserData.name" class="mt-3 text-center mb-3">
                        <Tag severity="success">{{ $t('LastFM.UserLoaded') }}: {{ lastFMUserData.name }}</Tag>
                    </div>
                </div>
                <Tabs value="0" class="h-full">
                    <TabList>
                        <Tab value="0">{{ $t('LastFM.Profile') }}</Tab>
                        <Tab value="1">{{ $t('LastFM.Charts') }}</Tab>
                    </TabList>
                    <TabPanels class="h-full">
                        <TabPanel value="0">
                            <div class="flex flex-col lg:flex-row p-4 gap-4">
                                <!-- User Info -->
                                <div class="lg:w-1/4 flex flex-col items-center text-center p-4 rounded-lg"
                                    style="background: var(--surface-section)">
                                    <Skeleton v-if="!imageLoaded" class="mb-3 border-circle shadow-2"
                                        style="width: 150px; height: 150px" />
                                    <Image v-show="imageLoaded && lastFMUserData.image && lastFMUserData.image[3]" @load="handleImageLoad"
                                        :src="lastFMUserData.image && lastFMUserData.image[3] ? lastFMUserData.image[3]['#text'] : ''" alt="Avatar" width="150" preview
                                        class="mb-3 border-circle shadow-2" />
                                    <h2 v-if="lastFMUserData.realname || lastFMUserData.name"
                                        class="text-xl font-bold">{{ lastFMUserData.realname || lastFMUserData.name }}</h2>
                                    <a v-if="lastFMUserData.url && lastFMUserData.name" :href="lastFMUserData.url" target="_blank"
                                        class="text-primary hover:underline"> @{{ lastFMUserData.name }} </a>
                                    <Tag v-if="lastFMUserData.country" severity="info" class="mt-2">{{ lastFMUserData.country }}</Tag>
                                </div>

                                <!-- Stats -->
                                <div class="lg:w-3/4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        <Card class="text-center">
                                            <template #title>🎵 {{ $t('LastFM.Tracks') }}</template>
                                            <template #content>
                                                <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.track_count || 0 }}</h3>
                                            </template>
                                        </Card>
                                        <Card class="text-center">
                                            <template #title>🧑‍🎤 {{ $t('LastFM.Artists') }}</template>
                                            <template #content>
                                                <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.artist_count || 0 }}</h3>
                                            </template>
                                        </Card>
                                        <Card class="text-center">
                                            <template #title>💿 {{ $t('LastFM.Albums') }}</template>
                                            <template #content>
                                                <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.album_count || 0 }}</h3>
                                            </template>
                                        </Card>
                                        <Card class="text-center">
                                            <template #title>▶️ {{ $t('LastFM.Playcount') }}</template>
                                            <template #content>
                                                <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.playcount || 0 }}</h3>
                                            </template>
                                        </Card>
                                        <Card class="text-center col-span-1 md:col-span-2 xl:col-span-1">
                                            <template #title>📅 {{ $t('LastFM.Registered') }}</template>
                                            <template #content>
                                                <h3 class="text-lg">
                                                    {{ lastFMUserData.registered ? formatDate(lastFMUserData.registered.unixtime) : '-' }}
                                                </h3>
                                            </template>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="1">
                            <div class="max-h-[70vh] overflow-y-auto px-4">
                                <div v-if="loading" class="text-center mt-4">
                                    <ProgressSpinner />
                                    <p class="mt-2 text-sm text-color-secondary">{{ $t('LastFM.LoadingCharts') }}</p>
                                </div>
                                <Chart v-else :key="chartKey" :lastFMData="lastFMData" />
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </CustomDialog>
    </div>
</template>
<style scoped>
.LastFMheader {
    background: var(--surface-ground);
    border: 1px solid var(--surface-border);
}
</style>
