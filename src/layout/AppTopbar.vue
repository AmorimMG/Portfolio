<script setup>
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    watchEffect,
} from "vue";
import { useRouter } from "vue-router";
import { getLanguageCookie, setLanguageCookie } from "../service/session";
import sessionModule from "../service/session.js";
import { useLayout } from "./composables/layout";
const { onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
	bindOutsideClickListener();
});

onBeforeUnmount(() => {
	unbindOutsideClickListener();
});

const dropdownValues = ref([
	{ name: "Português", code: "BR", value: "pt" },
	{ name: "Español", code: "ES", value: "es" },
	{ name: "English", code: "UK", value: "en" },
]);
const dropdownValue = ref(null);

const onTopBarMenuButton = () => {
	topbarMenuActive.value = !topbarMenuActive.value;
};

const logout = () => {
	sessionModule.actions.logout();
	router.push({ path: "/login" });
};

const topbarMenuClasses = computed(() => {
	return {
		"layout-topbar-menu-mobile-active": topbarMenuActive.value,
	};
});

const bindOutsideClickListener = () => {
	if (!outsideClickListener.value) {
		outsideClickListener.value = (event) => {
			if (isOutsideClicked(event)) {
				topbarMenuActive.value = false;
			}
		};

		document.addEventListener("click", outsideClickListener.value);
	}
};

const unbindOutsideClickListener = () => {
	if (outsideClickListener.value) {
		document.removeEventListener("click", outsideClickListener);
		outsideClickListener.value = null;
	}
};

const isOutsideClicked = (event) => {
	if (!topbarMenuActive.value) return;
	const sidebarEl = document.querySelector(".layout-topbar-menu");
	const topbarEl = document.querySelector(".layout-topbar-menu-button");

	return !(
		sidebarEl.isSameNode(event.target) ||
		sidebarEl.contains(event.target) ||
		topbarEl.isSameNode(event.target) ||
		topbarEl.contains(event.target)
	);
};

watchEffect(() => {
	const cookieValue = getLanguageCookie();
	if (
		cookieValue &&
		dropdownValues.value.some((option) => option.value === cookieValue)
	) {
		dropdownValue.value = dropdownValues.value.find(
			(option) => option.value === cookieValue,
		);
	} else {
		/*  dropdownValue.value = dropdownValues.value.find(option => option.value === "en"); */
	}
});

watch(dropdownValue, (newValue, oldValue) => {
	console.log(newValue, oldValue);
	if (newValue !== oldValue) {
		setLanguageCookie(newValue.value);
	}
});
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo center">
            <img alt="Logo" src="@/assets/images/cards/profilePic.png" />
        </router-link>
        <button class="p-link layout-menu-button layout-topbar-button " @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" class="dropdown flex align-items-center">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <img :alt="slotProps.value.label"
                            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                            :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 20px" />
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <img :alt="slotProps.option.label"
                            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                            :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Dropdown>

            <button @click="logout" class="p-btn p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
    </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-topbar-menu{
    height: 25px;
    align-items: center;
}

.p-btn{
    height: 0;
    i{
        font-size: 15px;
    }
}

.dropdown{
    outline: none;
    border: none;
    width: 80px;
    height: 25px;
}
</style>    
