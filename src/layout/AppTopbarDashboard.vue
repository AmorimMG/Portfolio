<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect, watch } from 'vue';
import { setLanguageCookie, getLanguageCookie } from '../service/session';
import { useLayout } from './composables/layout';
import AppConfig from './AppConfig.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import VueNeonLight from '../components/VueNeonLight/vue-neon-light.vue';

const { onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const appConfigRef = ref(null);
const { locale } = useI18n();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const dropdownValues = ref([
    { name: 'Português', code: 'BR', value: 'pt' },
    { name: 'Español', code: 'ES', value: 'es' },
    { name: 'English', code: 'UK', value: 'en' }
]);

const dropdownValue = ref(null);

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };

        document.addEventListener('click', outsideClickListener.value);
    }
};

const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};

const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;
    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

watchEffect(() => {
    const cookieValue = getLanguageCookie();
    if (cookieValue && dropdownValues.value.some((option) => option.value === cookieValue)) {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === cookieValue);
    } else {
        /*  dropdownValue.value = dropdownValues.value.find(option => option.value === "pt"); */
    }
});

watch(dropdownValue, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        setLanguageCookie(newValue.value);
        locale.value = newValue.value;
    }
});
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo center flex-row" style="margin-top: 15px">
            <VueNeonLight color="#ff00ff" size="50px" :flash="true"> AMORIM </VueNeonLight>
            <!-- <img alt="Logo" :src="'/src/assets/images/profilePic.png'" /> -->
        </router-link>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton">
            <i class="pi pi-ellipsis-v"></i>
        </button>
        <div class="layout-topbar-menu w-full flex-row gap-6 center" style="margin-top: 15px">
            <Button link @click="onMenuToggle">
                <h4>Home</h4>
            </Button>
            <Button link @click="onMenuToggle">
                <h4>Blog</h4>
            </Button>
            <Button link @click="onMenuToggle">
                <h4>Projects</h4>
            </Button>
            <Button link @click="onMenuToggle">
                <h4>CV</h4>
            </Button>
        </div>
        <div class="layout-topbar-menu flex-end" :class="topbarMenuClasses">
            <dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" class="dropdown flex align-items-center">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 20px" />
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </dropdown>

            <button class="p-btn p-link layout-topbar-button" type="button" @click="appConfigRef.onConfigButtonClick()">
                <i class="pi pi-cog" style="font-size: 25px"></i>
            </button>
            <app-config simple ref="appConfigRef"></app-config>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-topbar-menu {
    height: 25px;
    align-items: center;
    width: auto;
}

.p-btn {
    height: 0;
    i {
        font-size: 15px;
    }
}

.dropdown {
    outline: none;
    border: none;
    width: 80px;
    height: 25px;
}

.layout-topbar {
    border: 2px solid transparent;
    box-shadow: 0 0 5px #ff00ff;
}

h4:hover {
    color: #ff00ff;
}
</style>
