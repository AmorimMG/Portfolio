<script setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";

import { useI18n } from "vue-i18n";
import AppConfig from "../../layout/AppConfig.vue";
import {
    getLanguageCookie,
    setLanguageCookie,
} from "../../service/session";

const { locale } = useI18n();
const dropdownValues = ref([
	{ name: "Português", code: "BR", value: "pt" },
	{ name: "Español", code: "ES", value: "es" },
	{ name: "English", code: "UK", value: "en" },
]);
const dropdownValue = ref(null);

const emit = defineEmits(["hide"]);

const onClose = () => {
	emit("hide");
};

const currentTime = ref("");
const timer = ref(null);

const updateTime = () => {
	const now = new Date();
	const options = { weekday: "short", hour: "2-digit", minute: "2-digit" };
	currentTime.value = now.toLocaleTimeString(locale.value, options);
};

onMounted(() => {
	if (getLanguageCookie()) {
		dropdownValue.value = dropdownValues.value.find(
			(option) => option.value === getLanguageCookie(),
		);
		locale.value = getLanguageCookie();
	} else {
		dropdownValue.value = dropdownValues.value.find(
			(option) => option.value === "en",
		);
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
	if (
		cookieValue &&
		dropdownValues.value.some((option) => option.value === cookieValue)
	) {
		dropdownValue.value = dropdownValues.value.find(
			(option) => option.value === cookieValue,
		);
	} else {
		dropdownValue.value = dropdownValues.value.find(
			(option) => option.value === "en",
		);
		locale.value = "en";
	}
});

watch(dropdownValue, (newValue, oldValue) => {
	if (newValue !== oldValue) {
		setLanguageCookie(newValue.value);
		locale.value = newValue.value;
	}
});

const appConfigRef = ref(null);

const menubarItems = ref([
	{
		label: "Finder",
		class: "menubar-root",
	},
	{
		label: "File",
		items: [
			{
				label: "New",
				icon: "pi pi-fw pi-plus",
				items: [
					{
						label: "Bookmark",
						icon: "pi pi-fw pi-bookmark",
					},
					{
						label: "Video",
						icon: "pi pi-fw pi-video",
					},
				],
			},
			{
				label: "Delete",
				icon: "pi pi-fw pi-trash",
			},
			{
				separator: true,
			},
			{
				label: "Export",
				icon: "pi pi-fw pi-external-link",
			},
		],
	},
	{
		label: "Edit",
		items: [
			{
				label: "Left",
				icon: "pi pi-fw pi-align-left",
			},
			{
				label: "Right",
				icon: "pi pi-fw pi-align-right",
			},
			{
				label: "Center",
				icon: "pi pi-fw pi-align-center",
			},
			{
				label: "Justify",
				icon: "pi pi-fw pi-align-justify",
			},
		],
	},
	{
		label: "Users",
		items: [
			{
				label: "New",
				icon: "pi pi-fw pi-user-plus",
			},
			{
				label: "Delete",
				icon: "pi pi-fw pi-user-minus",
			},
			{
				label: "Search",
				icon: "pi pi-fw pi-users",
				items: [
					{
						label: "Filter",
						icon: "pi pi-fw pi-filter",
						items: [
							{
								label: "Print",
								icon: "pi pi-fw pi-print",
							},
						],
					},
					{
						icon: "pi pi-fw pi-bars",
						label: "List",
					},
				],
			},
		],
	},
	{
		label: "Events",
		items: [
			{
				label: "Edit",
				icon: "pi pi-fw pi-pencil",
				items: [
					{
						label: "Save",
						icon: "pi pi-fw pi-calendar-plus",
					},
					{
						label: "Delete",
						icon: "pi pi-fw pi-calendar-minus",
					},
				],
			},
			{
				label: "Archive",
				icon: "pi pi-fw pi-calendar-times",
				items: [
					{
						label: "Remove",
						icon: "pi pi-fw pi-calendar-minus",
					},
				],
			},
		],
	},
	{
		label: "Quit",
	},
]);
</script>

<template>
    <Menubar style="overflow-y: hidden" :model="menubarItems">
        <template #start>
            <i class="pi pi-apple px-2"></i>
        </template>
        <template #end>
            <dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 15px" />
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
            <i class="pi pi-video px-2" />
            <i class="pi pi-wifi px-2" />
            <i class="pi pi-volume-up px-2" />
            <span class="px-2">{{ currentTime }}</span>
            <i class="pi pi-search px-2" />
            <i class="pi pi-bars px-2" />
            <app-config simple ref="appConfigRef"></app-config>
            <button class="p-btn p-link layout-topbar-button px-2" type="button" @click="appConfigRef.onConfigButtonClick()">
                <i class="pi pi-cog"></i>
            </button>
            <router-link style="opacity: 1" to="/login">
                <button class="p-btn p-link layout-topbar-button px-2" type="button">
                    <i class="pi pi-sign-in"></i>
                </button>
            </router-link>
            <button class="p-btn p-link layout-topbar-button px-2" type="button" @click="onClose">
                <i class="pi pi-times"></i>
            </button>
        </template>
    </Menubar>
</template>
<style lang="scss" scoped></style>
