<script>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { RESTAPI } from '../../service/api';
import CardEffect from '../CardEffect.vue';
import Chart from '../Chart.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';

export default {
    props: {
        header: String
    },
    data() {
        return {
            toast: useToast(),
            lastFMData: [],
            lastFMUserData: [],
            user: ref('RecNove'),
            lastFMVisible: ref(false),
            tabs: [
                { title: 'Tab 1', content: 'Tab 1 Content' },
                { title: 'Tab 2', content: 'Tab 2 Content' },
                { title: 'Tab 3', content: 'Tab 3 Content' }
            ]
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.lastFMVisible = false;
        },
        handleChangeTabs(tabs) {
            if (tabs.index === 0) {
                /* this.obterCodigoFonte(this.selectedNode.id); */
            }

            if (tabs.index === 1) {
                /* this.obterDetalhes(this.selectedNode.id); */
            }
        },
        getLastFmUserData(lastFMUsername) {
            RESTAPI.ObterUsuarioLastFM(lastFMUsername)
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
            RESTAPI.ObterLastFM(lastFMUsername)
                .then((response) => {
                    this.lastFMData = response.data.weeklytrackchart.track;
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
            this.getLastFMInfo(this.user);
            this.getLastFmUserData(this.user);
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
    <Button text class="w-full h-full" @click="lastFMVisible = true" style="width: 100%; height: 100%; justify-content: center">
        <VueNeonLight size="15px" :flash="false" style="color: white">Last.FM Statics</VueNeonLight>
    </Button>
    <Dialog :visible="lastFMVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
                        <template #header>
                            <div class="inline-flex align-items-center justify-content-center gap-2">
                                <h2>Your Weekly Track Chart</h2>
                            </div>
                        </template>
                        <div class="border-round border-1 surface-border p-4 surface-card">
                            <ul class="m-0 p-0 list-none">
                                <li class="mb-3">
                                    <div class="flex">
                                        <Image :src="lastFMUserData.image[2]['#text']" class="m-4"/>
                                        <div class="mt-3 align-self-center" style="flex: 1">
                                            <FloatLabel>
                                                <InputText id="username" v-model="user" />
                                                <label for="username">Username</label>
                                            </FloatLabel>
                                            <Button text @click="getData(user)" style="width: 100%; height: 100%; justify-content: center">
                                                <VueNeonLight size="15px" :flash="false" style="color: white">Get Info</VueNeonLight>
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <TabView @tab-change="handleChangeTabs($event)">
                            <TabPanel header="t('Profile')">
                                <p>Profile</p>
                            </TabPanel>
                            <TabPanel header="t('Charts')">
                            <div class="popup-content" style="height: 100%; height: 100% !important; overflow-y: auto !important; overflow-x: hidden !important">
                                <Chart :lastFMData="lastFMData" />
                            </div>
                            </TabPanel>
                        </TabView>
                    </Dialog>
                </div>
</template>
