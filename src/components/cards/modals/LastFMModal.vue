<script>
import { ref } from 'vue';
import Chart from '../../Chart.vue';
import { RESTAPI } from '../../../service/api';
import { useToast } from 'primevue/usetoast';
import CardEffect from '../../CardEffect.vue';

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
        CardEffect
    },
    mounted() {
        this.getLastFMInfo('RecNove');
    }
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button v-tooltip.top="'Last.FM Statitics'" @click="lastFMVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <h2 :class="{ glitch: isGlitchActive }" style="color: white">Last.FM Statics</h2>
                </Button>
            </div>
        </CardEffect>
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
