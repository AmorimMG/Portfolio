<script>
import { ref, inject } from 'vue';
import { useLayout } from '../../layout/composables/layout';
import AppConfig from '../../layout/AppConfig.vue';
import { getLanguageCookie } from '../../service/session';

const { layoutConfig } = useLayout();

export default {
    name: 'ClusterOpcoes',
    props: {
        isGlitchActive: Boolean
    },
    methods: {
        toggleOverlay() {
            if (this.overlayActive.value === true) {
                setDarkThemeCookie(this.overlayActive.value);
            } else {
                setDarkThemeCookie(this.overlayActive.value);
            }

            this.$emit('toggleOverlay', this.overlayActive);
            return this.overlayActive;
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

        const languageCookie = getLanguageCookie();

        const defaultLanguage = ref(dropdownValues.value.find((item) => item.value === languageCookie));

        const dropdownValue = ref(defaultLanguage.value || dropdownValues.value[0]);

        const currentTime = ref(null);
        const isDay = ref(false);
        const appConfigRef = ref(null);
        const overlayActive = ref(null);

        return {
            dropdownValue,
            dropdownValues,
            isDay,
            currentTime,
            appConfigRef,
            translations,
            updateTranslations,
            overlayActive
        };
    },
    mounted() {
        console.log(getLanguageCookie());

        this.appConfigRef = this.$refs.appConfigRef;

        this.getCurrentTime();
        setInterval(this.getCurrentTime, 1000);
        setTimeout(() => {
            this.isStarted = true;
        }, 2000);

        this.updateTranslations(getLanguageCookie());
    },
    components: {
        AppConfig
    }
};
</script>

<template>
    <div id="ClusterOpcoes" class="col-6 lg:col-6 xl:col-3 center">
        <div class="cluster" style="margin: 10px">
            <div class="little-card center">
                <Dropdown @change="this.handleDropdownChange" :showClear="false" v-model="this.dropdownValue" :options="this.dropdownValues" optionLabel="name" class="dropdown flex align-items-center">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex align-items-center">
                            <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()} `" style="width: 38px" />
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
                            <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()} relative`" />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="little-card center">
                <div class="relative" style="cursor: pointer">
                    <button class="p-btn p-link layout-topbar-button" type="button" @click="this.appConfigRef.onDarkModeChange(toggleOverlay())" :class="{ rotate: !this.overlayActive, 'rotate-reverse': this.overlayActive }">
                        <img id="bulb" src="/src/assets/images/bulb.png" width="25px" style="cursor: pointer" />
                    </button>
                </div>
            </div>
            <div class="little-card center">
                <div class="relative">
                    <button class="p-btn p-link layout-topbar-button" type="button" @click="this.appConfigRef.onConfigButtonClick()">
                        <i class="pi pi-cog" style="font-size: 25px"></i>
                    </button>
                    <app-config simple ref="appConfigRef"></app-config>
                </div>
            </div>
            <div class="little-card center" :style="{ backgroundImage: !isDay ? 'url(/src/assets/images/day.jpg)' : 'url(/src/assets/images/night.jpg)' }" style="background-size: cover">
                <div class="relative">
                    <h6 :class="{ glitch: this.isGlitchActive }" class="greenLights">{{ this.currentTime }}</h6>
                    <h6 :class="{ glitch: this.isGlitchActive }" class="greenLights">{{ this.translations.gblBrazil }}</h6>
                </div>
            </div>
        </div>
    </div>
</template>
