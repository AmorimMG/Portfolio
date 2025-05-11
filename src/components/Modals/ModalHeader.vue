<script setup>
import { defineEmits } from 'vue';
const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close');
};

const onMaximize = () => {
    emit('maximize');
};
</script>

<template>
    <div class="modal-header">
        <div class="window-controls">
            <span class="close" @click="closeModal"></span>
            <span class="minimize" @click="closeModal"></span>
            <span class="maximize" @click="onMaximize"></span>
        </div>
    </div>
</template>

<style scoped>
.modal-header {
    background-color: #e8e8e8;
    border-top-left-radius: 10px;
    border-top-right-radius: 0px;
    padding: 10px;
}

.window-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    justify-content: start;
}

.window-controls span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.close {
    background-color: #ff5f56;
}
.minimize {
    background-color: #ffbd2e;
}
.maximize {
    background-color: #27c93f;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toolbar button {
    background-color: #d8d8d8;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
}

.path-input {
    flex-grow: 1;
    background-color: #ffffff;
    border: 1px solid #d1d1d1;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    color: black;
}
</style>
