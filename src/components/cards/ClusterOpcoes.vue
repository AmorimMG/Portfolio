<script>
import { ref, inject } from 'vue';
import AppConfig from '../../layout/AppConfig.vue';
import { getLanguageCookie } from '../../service/session';

export default {
    name: 'ClusterOpcoes',
    props: {
        overlayActive: Boolean,
        isGlitchActive: Boolean
    },
    methods: {
        toggleOverlay(event) {
            this.$emit('toggleOverlay', event);
        },
        handleDropdownChange({ value }) {
            this.$emit('update-dropdown-value', value);
            this.updateTranslations(value);
        },
        getCurrentTime() {
            const brazilTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            const timeComponents = brazilTime.split(', ')[1].split(':');
            let hour = parseInt(timeComponents[0]);
            let meridiem = 'AM';

            if (hour >= 12) {
                meridiem = 'PM';
                hour -= 12;
            }

            if (hour === 0) {
                hour = 12;
            }

            this.currentTime = `${hour}:${timeComponents[1]} ${meridiem}`;
            this.isDay = hour >= 6 && hour < 18;
        }
    },
    data() {
        const { translations, updateTranslations } = inject('translations');

        const dropdownValues = ref([
            { name: 'Português', code: 'BR', value: 'pt' },
            { name: 'Español', code: 'ES', value: 'es' },
            { name: 'English', code: 'US', value: 'en' }
        ]);

        const defaultLanguage = dropdownValues.value.find((item) => item.value === getLanguageCookie());

        const dropdownValue = ref(defaultLanguage || dropdownValues.value[0]);

        const currentTime = ref(null);
        const isDay = ref(false);
        const appConfigRef = ref(null);

        const selectedDropdownValue = this.dropdownValue;

        return {
            selectedDropdownValue,
            dropdownValue,
            dropdownValues,
            isDay,
            currentTime,
            appConfigRef,
            translations,
            updateTranslations
        };
    },
    mounted() {
        this.appConfigRef = this.$refs.appConfigRef;

        this.getCurrentTime();
        console.log(this.message);
        setInterval(this.getCurrentTime, 1000);
        setTimeout(() => {
            this.isStarted = true;
        }, 2000);
    },
    components: {
        AppConfig
    }
};
</script>

<template>
    <div class="cluster" style="margin: 0 !important">
        <div class="little-card center">
            <Dropdown @change="this.handleDropdownChange" :showClear="false" v-model="this.selectedDropdownValue" :options="this.dropdownValues" optionLabel="name" class="dropdown flex align-items-center">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 40px" />
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #dropdownicon>
                    <i class="pi pi-chevron-down"></i>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Dropdown>
        </div>
        <div class="little-card center">
            <div class="center" style="cursor: pointer">
                <button class="p-btn p-link layout-topbar-button" type="button" @click="this.appConfigRef.onDarkModeChange(toggleOverlay(!this.overlayActive))" :class="{ rotate: this.overlayActive, 'rotate-reverse': !this.overlayActive }">
                    <img id="bulb" src="/src/assets/images/bulb.png" width="25px" style="cursor: pointer" />
                </button>
            </div>
        </div>
        <div class="little-card center">
            <div class="center">
                <button class="p-btn p-link layout-topbar-button" type="button" @click="this.appConfigRef.onDarkModeChange(toggleOverlay(!this.appConfigRef.overlayActive))">
                    <i class="pi pi-cog" style="font-size: 25px"></i>
                </button>
                <app-config ref="appConfigRef"></app-config>
            </div>
        </div>
        <div class="little-card center" :style="{ backgroundImage: !isDay ? 'url(/src/assets/images/day.jpg)' : 'url(/src/assets/images/night.jpg)' }" style="background-size: cover">
            <div class="center">
                <h6 :class="{ glitch: this.isGlitchActive }" class="greenLights">{{ this.currentTime }}</h6>
                <h6 :class="{ glitch: this.isGlitchActive }" class="greenLights">{{ this.translations.gblBrazil }}</h6>
            </div>
        </div>
    </div>
</template>