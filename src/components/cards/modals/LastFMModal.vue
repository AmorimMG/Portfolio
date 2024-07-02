<script>
import Chart from '../../Chart.vue';
import { RESTAPI } from '../../../service/api';
import { useToast } from 'primevue/usetoast';

export default {
    props: {
        visible: Boolean,
        header: String
    },
    data() {
        return {
            toast: useToast(),
            lastFMData: []
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
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
        Chart
    },
    mounted() {
        this.getLastFMInfo('RecNove');
    }
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <h2>Your Weekly Track Chart</h2>
            </div>
        </template>
        <div class="popup-content" style="height: 100%; height: 100% !important; overflow-y: auto !important; overflow-x: hidden !important">
            <Chart :lastFMData="lastFMData"/>
        </div>
    </Dialog>
</template>
