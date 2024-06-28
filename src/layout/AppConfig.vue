<script setup>
import { ref, onMounted } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useLayout } from '@/layout/composables/layout';
import { getDarkThemeCookie } from '../service/session';

defineProps({
    simple: {
        type: Boolean,
        default: false
    }
});

const $primevue = usePrimeVue();

const scales = ref([8, 9, 10, 11, 12]);
const visible = ref(false);

const compactMaterial = ref(false);
const primaryFocusRing = ref(true);

const { setScale, layoutConfig } = useLayout();

const onConfigButtonClick = () => {
    visible.value = !visible.value;
};

const onChangeTheme = (theme, mode) => {
    console.log(theme, mode);

    $primevue.changeTheme(layoutConfig.theme.value, theme, 'theme-css', () => {
        layoutConfig.theme.value = theme;
        layoutConfig.darkTheme.value = mode;
    });
};

const decrementScale = () => {
    setScale(layoutConfig.scale.value - 1);
    applyScale();
};

const incrementScale = () => {
    setScale(layoutConfig.scale.value + 1);
    applyScale();
};

const applyScale = () => {
    document.documentElement.style.fontSize = layoutConfig.scale.value + 'px';
};

const onDarkModeChange = (value) => {
    console.log(value);

    const newThemeName = value ? layoutConfig.theme.value.replace('light', 'dark') : layoutConfig.theme.value.replace('dark', 'light');

    layoutConfig.darkTheme.value = value;
    onChangeTheme(newThemeName, value);
};

const changeTheme = (theme, color) => {
    let newTheme, dark;

    newTheme = theme + '-' + (layoutConfig.darkTheme.value ? 'dark' : 'light');

    if (color) {
        newTheme += '-' + color;
    }

    if (newTheme.startsWith('md-') && compactMaterial.value) {
        newTheme = newTheme.replace('md-', 'mdc-');
    }

    dark = layoutConfig.darkTheme.value;

    onChangeTheme(newTheme, dark);
};
const isThemeActive = (themeFamily, color) => {
    let themeName;
    let themePrefix = themeFamily === 'md' && compactMaterial.value ? 'mdc' : themeFamily;

    themeName = themePrefix + (layoutConfig.darkTheme.value ? '-dark' : '-light');

    if (color) {
        themeName += '-' + color;
    }

    return layoutConfig.theme.value === themeName;
};

const onFocusRingColorChange = (value) => {
    primaryFocusRing.value = value;
    let root = document.documentElement;

    if (value) {
        if (layoutConfig.darkTheme.value) root.style.setProperty('--p-focus-ring-color', 'var(--primary-500)');
        else root.style.setProperty('--p-focus-ring-color', 'var(--primary-500)');
    } else {
        if (layoutConfig.darkTheme.value) root.style.setProperty('--p-focus-ring-color', 'var(--surface-500)');
        else root.style.setProperty('--p-focus-ring-color', 'var(--surface-900)');
    }
};

defineExpose({
    onConfigButtonClick,
    onDarkModeChange
});

onMounted(() => {
    onDarkModeChange(getDarkThemeCookie());
});
</script>

<template>
    <Sidebar v-model:visible="visible" position="right" class="layout-config-sidebar w-26rem" pt:closeButton="ml-auto">
        <div class="p-2">
            <section class="pb-4 flex align-items-center justify-content-between border-bottom-1 surface-border">
                <span class="text-xl font-semibold">Scale</span>
                <div class="flex align-items-center gap-2 border-1 surface-border py-1 px-2" style="border-radius: 30px">
                    <Button icon="pi pi-minus" @click="decrementScale" text rounded :disabled="layoutConfig.scale.value === scales[0]" />
                    <i v-for="s in scales" :key="s" :class="['pi pi-circle-fill text-sm text-200', { 'text-lg text-primary': s === layoutConfig.scale.value }]" />

                    <Button icon="pi pi-plus" @click="incrementScale" text rounded :disabled="layoutConfig.scale.value === scales[scales.length - 1]" />
                </div>
            </section>
            <section class="py-4 border-bottom-1 surface-border">
                <div class="flex align-items-center gap-2 mb-3">
                    <img src="https://primefaces.org/cdn/primevue/images/themes/lara-light-teal.png" alt="Lara Light Teal" class="border-circle" style="width: 1.5rem" />
                    <span class="font-medium">Temas</span>
                </div>
                <div class="flex align-items-center justify-content-between gap-3 mb-3">
                </div>
                <div class="flex align-items-center justify-content-center gap-3">
                   <!--  Muda literalmente o Tema -->

<!--                     <button
                        :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('lara', 'purple'), 'hover:border-500 surface-border': !isThemeActive('lara', 'purple') }
                        ]"
                        style="border-radius: 30px"
                        @click="changeTheme('lara', 'purple')"
                    >
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #7758e4 0%, rgba(119, 88, 228, 0.5) 100%)"></span>
                    </button> -->
                    
                    <!-- Muda o Tema de Claro para Escuro -->
                <button :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('lara', 'purple'), 'hover:border-500 surface-border': !isThemeActive('lara', 'purple') }
                        ]" style="border-radius: 30px" @click="onChangeTheme('lara-dark-purple', 'dark')">
                    <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(180deg, #7758e4 0%, rgba(119, 88, 228, 0.5) 100%)"></span>
                </button>
                    

                <button                         :class="[
                            'bg-transparent border-1 cursor-pointer p-2 w-3 flex align-items-center justify-content-center transition-all transition-duration-200',
                            { 'border-primary': isThemeActive('lara', 'purple'), 'hover:border-500 surface-border': !isThemeActive('lara', 'purple') }
                        ]"
                        style="border-radius: 30px" @click="onChangeTheme('lara-light-purple', 'light')">
                        <span class="block h-1rem w-full" style="border-radius: 30px; background: linear-gradient(rgb(500, 90, 228) 0%, rgba(100, 90, 500, 0.5) 100%)"></span>
                </button>
            </div>
            </section>
        </div>
    </Sidebar>
</template>

<style lang="scss" scoped></style>
