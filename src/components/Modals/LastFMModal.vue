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
            lastFMVisible: ref(false)
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.lastFMVisible = false;
        },
        getLastFMInfo(lastFMUsername) {
            RESTAPI.ObterLastFM(lastFMUsername)
                .then((response) => {
                    this.lastFMData = response.data.weeklytrackchart.track;
                })
                .catch((error) => {
                    console.log(error);
                    this.toast.add({
                        severity: 'error',
                        summary: error,
                        life: 3000
                    });
                });
        }
    },
    components: {
        Chart,
        CardEffect,
        VueNeonLight
    },
    mounted() {
        this.getLastFMInfo('RecNove');
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
            <div class="popup-content" style="height: 100%; height: 100% !important; overflow-y: auto !important; overflow-x: hidden !important">
                <Chart :lastFMData="lastFMData" />
            </div>
        </Dialog>
    </div>
</template>
