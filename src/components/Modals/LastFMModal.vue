<script>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { RESTAPI } from '../../service/api';
import CardEffect from '../CardEffect.vue';
import Chart from '../Chart.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

export default {
    components: {
        CustomDialog
    },
    props: {
        header: String
    },
    data() {
        return {
            toast: useToast(),
            lastFMData: [],
            lastFMUserData: [],
            imageLoaded: ref(false),
            user: ref('RecNove'),
            lastFMVisible: ref(false),
            loading: false,
            tabs: [
                { title: 'Tab 1', content: 'Tab 1 Content' },
                { title: 'Tab 2', content: 'Tab 2 Content' },
                { title: 'Tab 3', content: 'Tab 3 Content' }
            ],
            chartKey: 0
        };
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
        handleChangeTabs(tabs) {
            if (tabs.index === 0) {
                /* this.obterCodigoFonte(this.selectedNode.id); */
            }

            if (tabs.index === 1) {
                /* this.obterDetalhes(this.selectedNode.id); */
                this.chartKey++;
            }
        },
        getLastFmUserData(lastFMUsername) {
            this.imageLoaded = false;
            return RESTAPI.ObterUsuarioLastFM(lastFMUsername)
                .then((response) => {
                    this.lastFMUserData = response.data.user;
                })
                .catch((error) => {
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
                    this.chartKey++; // força o re-render do chart
                })
                .catch((error) => {
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
    components: {
        Chart,
        CardEffect,
        VueNeonLight
    },
    mounted() {
        this.getLastFMInfo(this.user);
        this.getLastFmUserData(this.user);
    }
};
</script>

<template>
    <div class="col-12 lg:col-12 xl:col-12 pb-0">
        <Button text class="w-full h-full" @click="lastFMVisible = true"
            style="width: 100%; height: 100%; justify-content: center">
            <VueNeonLight size="10px" :flash="false" style="color: white">Last.FM Statics</VueNeonLight>
        </Button>
        <CustomDialog :visible="lastFMVisible" @update:visible="onHide()" :maximized="true" :modal="true"
            class="p-dialog-maximized">
            <template #header>
                <div class="inline-flex items-center justify-center gap-2">
                    <h2>{{ $t('LastFM.WeeklyTrackChart') }}</h2>
                </div>
            </template>
            <div class="border-round border-1 surface-border p-4 surface-card">
                <div class="flex flex-col md:flex-row items-center justify-content-between gap-3">
                    <FloatLabel class="w-full md:w-6">
                        <InputText id="username" v-model="user" class="w-full" @keyup.enter="getData(user)" />
                        <label for="username">{{ $t('LastFM.Username') }}</label>
                    </FloatLabel>
                    <Button text @click="getData(user)" class="w-full md:w-2 md:ml-3">
                        <VueNeonLight size="15px" :flash="false" style="color: white">
                            {{ $t('LastFM.GetInfo') }}
                        </VueNeonLight>
                    </Button>
                </div>

                <div v-if="loading" class="mt-4 text-center">
                    <ProgressSpinner style="width: 40px; height: 40px" />
                    <p class="mt-2 text-sm text-color-secondary">{{ $t('LastFM.LoadingUser') }}</p>
                </div>

                <div v-else-if="lastFMUserData && lastFMUserData.name" class="mt-3 text-center">
                    <Tag severity="success">{{ $t('LastFM.UserLoaded') }}: {{ lastFMUserData.name }}</Tag>
                </div>
            </div>

            <Tabs @tab-change="handleChangeTabs($event)">
                <TabPanel :header="$t('LastFM.Profile')">
                    <div class="grid p-3">
                        <div class="col-12 md:col-4 flex flex-col items-center text-center">
                            <Skeleton v-if="!imageLoaded" class="mb-3 border-circle shadow-2"
                                style="width: 150px; height: 150px" />
                            <Image v-show="imageLoaded" @load="handleImageLoad" :src="lastFMUserData.image[3]['#text']"
                                alt="Avatar" width="150" preview class="mb-3 border-circle shadow-2" />
                            <h2>{{ lastFMUserData.realname || lastFMUserData.name }}</h2>
                            <a :href="lastFMUserData.url" target="_blank" class="text-primary hover:underline"> @{{
                                lastFMUserData.name }} </a>
                            <Tag severity="info" class="mt-2">{{ lastFMUserData.country }}</Tag>
                        </div>

                        <!-- Estatísticas -->
                        <div class="col-12 md:col-8">
                            <div class="grid">
                                <div class="col-6 md:col-4">
                                    <Card>
                                        <template #title>🎵 {{ $t('LastFM.Tracks') }}</template>
                                        <template #content>
                                            <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.track_count }}
                                            </h3>
                                        </template>
                                    </Card>
                                </div>
                                <div class="col-6 md:col-4">
                                    <Card>
                                        <template #title>🧑‍🎤 {{ $t('LastFM.Artists') }}</template>
                                        <template #content>
                                            <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.artist_count
                                            }}</h3>
                                        </template>
                                    </Card>
                                </div>
                                <div class="col-6 md:col-4">
                                    <Card>
                                        <template #title>💿 {{ $t('LastFM.Albums') }}</template>
                                        <template #content>
                                            <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.album_count }}
                                            </h3>
                                        </template>
                                    </Card>
                                </div>
                                <div class="col-6 md:col-4">
                                    <Card>
                                        <template #title>▶️ {{ $t('LastFM.Playcount') }}</template>
                                        <template #content>
                                            <h3 class="text-2xl font-bold text-primary">{{ lastFMUserData.playcount }}
                                            </h3>
                                        </template>
                                    </Card>
                                </div>
                                <div class="col-6 md:col-4">
                                    <Card>
                                        <template #title>📅 {{ $t('LastFM.Registered') }}</template>
                                        <template #content>
                                            <h3 class="text-lg">
                                                {{ formatDate(lastFMUserData.registered.unixtime) }}
                                            </h3>
                                        </template>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel :header="$t('LastFM.Charts')">
                    <div class="popup-content" style="height: 100%; overflow-y: auto; overflow-x: hidden">
                        <div v-if="loading" class="text-center mt-4">
                            <ProgressSpinner />
                            <p class="mt-2 text-sm text-color-secondary">{{ $t('LastFM.LoadingCharts') }}</p>
                        </div>
                        <Chart v-else :lastFMData="lastFMData" :key="chartKey" />
                    </div>
                </TabPanel>
            </Tabs>
        </CustomDialog>
    </div>
</template>
