<script setup>
import { useLayout } from '@/layout/composables/layout';
import { faSignal, faWifi } from '@fortawesome/free-solid-svg-icons';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons/faBatteryThreeQuarters';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import AppConfigurator from '../../layout/AppConfigurator.vue';
import { getLanguageCookie, setLanguageCookie } from '../../service/session';
import WallpaperModal from '../Modals/WallpaperModal.vue';

const { locale, t } = useI18n();
const dropdownValues = ref([
    { name: 'Português', code: 'BR', value: 'pt' },
    { name: 'Español', code: 'ES', value: 'es' },
    { name: 'English', code: 'UK', value: 'en' }
]);
const dropdownValue = ref(null);
const wallpaperModalVisible = ref(false);
const cameraModalVisible = ref(false);
const emit = defineEmits(['update:modelValue', 'hide']);
const { toggleDarkMode, isDarkTheme } = useLayout();
const currentTime = ref('');
const timer = ref(null);
const volumeValue = ref(0);
const audio = ref(null);
const isMobile = ref(window.innerWidth <= 768);
const opWifi = ref();
const opVolume = ref();

const toggleConfig = () => {
    wallpaperModalVisible.value = true;
};

const toggleWifi = (event) => {
    opWifi.value.toggle(event);
};

const toggleVolume = (event) => {
    opVolume.value.toggle(event);
};

const initializeAudio = () => {
    audio.value = new Audio('/sounds/JustAJoke.mp3');
    audio.value.loop = true;
    audio.value.volume = 0;
};

const updateTime = () => {
    const now = new Date();
    if (isMobile.value) {
        const options = { hour: '2-digit', minute: '2-digit' };
        currentTime.value = now.toLocaleTimeString('pt', options);
    } else {
        const options = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
        currentTime.value = now.toLocaleTimeString(locale.value, options);
    }
};

watch(volumeValue, (newVolume) => {
    if (!audio.value) return;

    if (newVolume > 0) {
        if (audio.value.paused) {
            audio.value.play();
        }
    } else {
        audio.value.pause();
    }
    audio.value.volume = newVolume / 100;
});

initializeAudio();

watch(locale, (newLocale) => {
    const newDropdownValue = dropdownValues.value.find((option) => option.value === newLocale);
    if (newDropdownValue) {
        dropdownValue.value = newDropdownValue;
    }
});

onMounted(() => {
    if (getLanguageCookie()) {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === getLanguageCookie());
        locale.value = getLanguageCookie();
    } else {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === 'en');
        locale.value = dropdownValue.value;
    }
    updateTime();
    timer.value = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    clearInterval(timer.value);
});

watchEffect(() => {
    const cookieValue = getLanguageCookie();
    if (cookieValue && dropdownValues.value.some((option) => option.value === cookieValue)) {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === cookieValue);
    } else {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === 'en');
        locale.value = 'en';
    }
});

watch(dropdownValue, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        setLanguageCookie(newValue.value);
        locale.value = newValue.value;
    }
});

const menubarItems = computed(() => [
    {
        label: t('DockTopBar.Finder'),
        class: 'menubar-root'
    },
    {
        label: 'File',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                items: [
                    {
                        label: 'Bookmark',
                        icon: 'pi pi-fw pi-bookmark'
                    },
                    {
                        label: 'Video',
                        icon: 'pi pi-fw pi-video'
                    }
                ]
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash'
            },
            {
                separator: true
            },
            {
                label: 'Export',
                icon: 'pi pi-fw pi-external-link'
            }
        ]
    },
    {
        label: t('DockTopBar.Edit'),
        items: [
            {
                label: 'Left',
                icon: 'pi pi-fw pi-align-left'
            },
            {
                label: 'Right',
                icon: 'pi pi-fw pi-align-right'
            },
            {
                label: 'Center',
                icon: 'pi pi-fw pi-align-center'
            },
            {
                label: 'Justify',
                icon: 'pi pi-fw pi-align-justify'
            }
        ]
    },
    {
        label: t('DockTopBar.Users'),
        items: [
            {
                label: t('DockTopBar.New'),
                icon: 'pi pi-fw pi-user-plus'
            },
            {
                label: t('DockTopBar.Delete'),
                icon: 'pi pi-fw pi-user-minus'
            },
            {
                label: t('DockTopBar.Search'),
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: t('DockTopBar.Filter'),
                        icon: 'pi pi-fw pi-filter',
                        items: [
                            {
                                label: 'Print',
                                icon: 'pi pi-fw pi-print'
                            }
                        ]
                    },
                    {
                        icon: 'pi pi-fw pi-bars',
                        label: t('DockTopBar.List')
                    }
                ]
            }
        ]
    },
    {
        label: 'Events',
        items: [
            {
                label: t('DockTopBar.Edit'),
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        label: t('DockTopBar.Save'),
                        icon: 'pi pi-fw pi-calendar-plus'
                    },
                    {
                        label: t('DockTopBar.Delete'),
                        icon: 'pi pi-fw pi-calendar-minus'
                    }
                ]
            },
            {
                label: 'Archive',
                icon: 'pi pi-fw pi-calendar-times',
                items: [
                    {
                        label: t('DockTopBar.Remove'),
                        icon: 'pi pi-fw pi-calendar-minus'
                    }
                ]
            }
        ]
    },
    {
        label: t('DockTopBar.Quit')
    }
]);

const updateScreenSize = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
});
</script>

<template>
    <Menubar v-if="!isMobile" style="overflow-y: hidden" :model="!isMobile ? menubarItems : []" :pt="{
        // fixes https://github.com/primefaces/primevue/issues/6141
        action: {
            ariaHidden: false
        }
    }">
        <template #start>
            <img loading="lazy" src="@/assets/images/logo/flamorz.svg" alt="Flamorz Logo" class="w-9 h-9 mr-2" />
        </template>
        <template #end>
            <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                        <img loading="lazy" :alt="slotProps.value.label"
                            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                            :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 15px" />
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex items-center">
                        <img loading="lazy" :alt="slotProps.option.label"
                            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                            :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Select>
            <i class="pi pi-video px-2" @click="cameraModalVisible = true" />
            <i class="pi pi-wifi px-2" @click="toggleWifi" />
            <i class="pi pi-volume-up px-2" @click="toggleVolume" />
            <span class="px-2">{{ currentTime }}</span>
            <i class="pi pi-search px-2" />
            <i class="pi pi-bars px-2" />
            <button type="button" class="p-btn p-link layout-topbar-button px-2" @click="toggleConfig">
                <i class="pi pi-palette"></i>
            </button>
            <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                <i :class="['pi px-2', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
            </button>
            <button
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                type="button" class="layout-topbar-action layout-topbar-action-highlight">
                <i class="pi pi-cog px-2"></i>
            </button>
            <AppConfigurator />
            <router-link style="opacity: 1" to="/login">
                <button class="p-btn p-link layout-topbar-button px-2" type="button">
                    <i class="pi pi-sign-in"></i>
                </button>
            </router-link>
            <Popover ref="opWifi"> i'm a wifi </Popover>
            <Popover ref="opVolume">
                <Slider v-model="volumeValue" class="w-[14rem]" />
            </Popover>
            <CameraModal :isTopbar="true" v-model:visible="cameraModalVisible" />
            <WallpaperModal :isTopbar="true" v-model:visible="wallpaperModalVisible"
                @update:modelValue="$emit('update:modelValue', $event)" />
        </template>
    </Menubar>

    <Menubar v-if="isMobile" class="mobileMenubar" :model="[]" :pt="{
        // fixes https://github.com/primefaces/primevue/issues/6141
        action: {
            ariaHidden: false
        }
    }">
        <template #start>
            <div class="w-full flex justify-evenly items-center">
                <div>
                    <span>{{ currentTime }}</span>
                </div>
                <div class="flex items-center justify-center" style="width: 150px">
                    <div
                        style="background-color: black; width: 150px; height: 30px; border-radius: 20px; margin-left: 30px">
                    </div>
                </div>
                <div class="flex">
                    <FontAwesomeIcon class="pr-2" :icon="faSignal" />
                    <FontAwesomeIcon class="pr-2" :icon="faWifi" />
                    <FontAwesomeIcon :icon="faBatteryThreeQuarters" />
                </div>
            </div>
        </template>
    </Menubar>
</template>

<style lang="scss">
.p-dropdown {
    background-color: transparent;
}

.p-dropdown-trigger {
    display: none;
}

.mobileMenubar {
    background: transparent;
    overflow-y: hidden;
    font-size: medium;
    height: 50px;
    border-radius: 0px;
    position: absolute;
    width: 100%;
    z-index: 2;
    border: none;
}

.mobileMenubar>.p-menubar-start {
    width: 100%;
}

.background-theme {
    background-color: var(--primary-color) !important;
    border: none !important;
    border-radius: 0px !important;
    color: var(--text-color) !important;
}
</style>
