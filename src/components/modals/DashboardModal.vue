<script>
import { defineAsyncComponent } from 'vue';

export default {
    props: {
        header: String
    },
    data() {
        return {
            dashboardData: [],
            dashboardVisible: false
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.dashboardVisible = false;
        }
    },
    components: {
        Dashboard: defineAsyncComponent(() => import('../../views/Dashboard.vue'))
    }
};
</script>

<template>
    <Button text class="w-full h-full" @click="dashboardVisible = true"/>
    <Dialog class="dialog-terminal" contentStyle="width: 100%; height:100%;" 
            :visible="dashboardVisible"  
            @update:visible="dashboardVisible = $event"
            :closable="false"
            :breakpoints="{ '960px': '50vw' }"  
            :style="{ width: '90vw', height: '90vh' }"
            :unstyled="true"
            >
        <template #header>
            <div class="safari-header w-full flex justify-content-between items-center">
                <div class="header-buttons">
                    <button @click="dashboardVisible = false" class="nav-button back"></button>
                    <button @click="dashboardVisible = false" class="nav-button forward"></button>
                    <button @click="dashboardVisible = false" class="nav-button refresh"></button>
                </div>
                <div class="url-bar">https://amorim.pro/</div>
                <div class="right-section">
                </div>
            </div>
        </template>
        <Dashboard v-if="dashboardVisible" />
    </Dialog>
</template>

<style scoped>
.dialog-terminal {
    border-radius: 12px;
    overflow: hidden;
}

.dialog-header {
    padding: 0;
}

.safari-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #f2f2f7;
    border-bottom: 1px solid #dcdcdc;
}
.header-buttons {
    display: flex;
    gap: 8px;
}
.nav-button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #c4c4c4;
    border: none;
    cursor: pointer;
}
.back {
    background-color: #ff5f57;
}
.forward {
    background-color: #febc2e;
}
.refresh {
    background-color: #28c840;
}
.url-bar {
    padding: 6px 12px;
    border-radius: 8px;
    margin-left: 12px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    background-color: #333;
    color: white;
    font-size: 14px;
    font-weight: 500;
}
.right-section {
}
</style>
