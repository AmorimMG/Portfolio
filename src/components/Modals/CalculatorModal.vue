<script setup>
import { ref } from 'vue';
import CustomDialog from './CustomDialog.vue';

defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible']);

const openCalculator = ref(false);
const display = ref('0');

const append = (char) => {
    if (display.value === '0') {
        display.value = char;
    } else {
        display.value += char;
    }
};

const clear = () => {
    display.value = '0';
};

const setOperation = (operation) => {
    const lastChar = display.value.slice(-1);
    if (!['+', '-', '*', '/'].includes(lastChar)) {
        display.value += operation;
    }
};

const calculate = () => {
    try {
        // Using eval() for simplicity, but be aware of security implications in a real-world app.
        const result = eval(display.value);
        display.value = String(result);
    } catch (error) {
        display.value = 'Error';
    }
};

const dot = () => {
    const parts = display.value.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (!lastPart.includes('.')) {
        display.value += '.';
    }
};

const closeModal = () => {
    emit('update:visible', false);
    openCalculator.value = false;
};
</script>

<template>
    <div class="portfolio-root" v-bind="$attrs">
        <Button v-if="!visible" text class="w-full h-full" @click="openCalculator = true"
            style="width: 100%; height: 100%; justify-content: center">
            <!-- You might want a specific icon here -->
        </Button>
        <CustomDialog :visible="visible || openCalculator" @update:visible="closeModal" :maximized="false" header="Calculadora">
            <div class="calculator">
                <div class="display">{{ display }}</div>
                <div class="buttons">
                    <button @click="clear" class="operator">C</button>
                    <button @click="setOperation('/')" class="operator">/</button>
                    <button @click="setOperation('*')" class="operator">*</button>
                    <button @click="setOperation('-')" class="operator">-</button>

                    <button @click="append('7')">7</button>
                    <button @click="append('8')">8</button>
                    <button @click="append('9')">9</button>
                    <button @click="setOperation('+')" class="operator rowspan-2">+</button>

                    <button @click="append('4')">4</button>
                    <button @click="append('5')">5</button>
                    <button @click="append('6')">6</button>

                    <button @click="append('1')">1</button>
                    <button @click="append('2')">2</button>
                    <button @click="append('3')">3</button>
                    <button @click="calculate" class="operator rowspan-2">=</button>

                    <button @click="append('0')" class="colspan-2">0</button>
                    <button @click="dot">.</button>
                </div>
            </div>
        </CustomDialog>
    </div>
</template>

<style scoped>
.calculator {
    width: 100%;
    height: 100%;
    margin: auto;
    background-color: #2d3748;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
}

.display {
    background-color: #1a202c;
    color: white;
    text-align: right;
    padding: 20px;
    font-size: 2em;
    border-radius: 4px;
    margin-bottom: 20px;
    overflow-x: auto;
    flex-shrink: 0;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    height: 100%;
}

button {
    padding: 20px;
    font-size: 1.2em;
    border: none;
    border-radius: 4px;
    background-color: #4a5568;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #718096;
}

.operator {
    background-color: #f6ad55;
    color: #1a202c;
}

.operator:hover {
    background-color: #ed8936;
}

.rowspan-2 {
    grid-row: span 2;
}

.colspan-2 {
    grid-column: span 2;
}
</style>
