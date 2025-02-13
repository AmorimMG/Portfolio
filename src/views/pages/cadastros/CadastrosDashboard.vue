<script setup>
import { useLayout } from "@/layout/composables/layout";
import MeterGroup from 'primevue/metergroup';
import { onMounted, ref, watch } from "vue";
const { getPrimary, getSurface, isDarkTheme } = useLayout();
const products = ref(null);
const chartData = ref(null);
const chartOptions = ref(null);

const value = ref([
    { label: 'Apps', color1: '#34d399', color2: '#fbbf24', value: 25, icon: 'pi pi-table' },
    { label: 'Messages', color1: '#fbbf24', color2: '#60a5fa', value: 15, icon: 'pi pi-inbox' },
    { label: 'Media', color1: '#60a5fa', color2: '#c084fc', value: 20, icon: 'pi pi-image' },
    { label: 'System', color1: '#c084fc', color2: '#c084fc', value: 10, icon: 'pi pi-cog' }
]);

const items = ref([
	{ label: "Add New", icon: "pi pi-fw pi-plus" },
	{ label: "Remove", icon: "pi pi-fw pi-trash" },
]);

onMounted(() => {
	chartData.value = setChartData();
	chartOptions.value = setChartOptions();
});

function setChartData() {
	const documentStyle = getComputedStyle(document.documentElement);

	return {
		labels: ["Q1", "Q2", "Q3", "Q4"],
		datasets: [
			{
				type: "bar",
				label: "Subscriptions",
				backgroundColor: documentStyle.getPropertyValue("--p-primary-400"),
				data: [4000, 10000, 15000, 4000],
				barThickness: 32,
			},
			{
				type: "bar",
				label: "Advertising",
				backgroundColor: documentStyle.getPropertyValue("--p-primary-300"),
				data: [2100, 8400, 2400, 7500],
				barThickness: 32,
			},
			{
				type: "bar",
				label: "Affiliate",
				backgroundColor: documentStyle.getPropertyValue("--p-primary-200"),
				data: [4100, 5200, 3400, 7400],
				borderRadius: {
					topLeft: 8,
					topRight: 8,
				},
				borderSkipped: true,
				barThickness: 32,
			},
		],
	};
}

function setChartOptions() {
	const documentStyle = getComputedStyle(document.documentElement);
	const borderColor = documentStyle.getPropertyValue("--surface-border");
	const textMutedColor = documentStyle.getPropertyValue(
		"--text-color-secondary",
	);

	return {
		maintainAspectRatio: false,
		aspectRatio: 0.8,
		scales: {
			x: {
				stacked: true,
				ticks: {
					color: textMutedColor,
				},
				grid: {
					color: "transparent",
					borderColor: "transparent",
				},
			},
			y: {
				stacked: true,
				ticks: {
					color: textMutedColor,
				},
				grid: {
					color: borderColor,
					borderColor: "transparent",
					drawTicks: false,
				},
			},
		},
	};
}

const formatCurrency = (value) => {
	return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

watch([getPrimary, getSurface, isDarkTheme], () => {
	chartData.value = setChartData();
	chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="flex gap-5 flex-column">
        <div>
                <MeterGroup :value="value" labelPosition="start">
                    <template #label="{ value }">
                        <div class="flex flex-wrap gap-3">
                            <template v-for="val of value" :key="val.label">
                                <Card class="flex-1">
                                    <template #content>
                                        <div class="flex justify-content-between gap-5">
                                            <div class="flex flex-column gap-1">
                                                <span class="text-secondary text-sm">{{ val.label }}</span>
                                                <span class="font-bold text-lg">{{ val.value }}%</span>
                                            </div>
                                            <span class="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center" :style="{ backgroundColor: `${val.color1}`, color: '#ffffff' }">
                                                <i :class="val.icon" />
                                            </span>
                                        </div>
                                    </template>
                                </Card>
                            </template>
                        </div>
                    </template>
                    <template #meter="slotProps">
                        <span :class="slotProps.class" :style="{ background: `linear-gradient(to right, ${slotProps.value.color1}, ${slotProps.value.color2})`, width: slotProps.size }" />
                    </template>
                    <template #start="{ totalPercent }">
                        <div class="flex justify-content-between mt-3 mb-2 relative">
                            <span>Storage</span>
                            <span :style="{ width: totalPercent + '%' }" class="absolute text-right">{{ totalPercent }}%</span>
                            <span class="font-medium">1TB</span>
                        </div>
                    </template>
                    <template #end>
                        <div class="flex justify-content-between mt-3">
                            <Button label="Manage Storage" outlined size="small" />
                            <Button label="Update Plan" size="small" />
                        </div>
                    </template>
                </MeterGroup>
        </div>

        <div class="grid">
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card-dashboard mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Orders</span>
                            <div class="text-900 font-medium text-xl">152</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">24 new </span>
                    <span class="text-500">since last visit</span>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card-dashboard mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Revenue</span>
                            <div class="text-900 font-medium text-xl">$2.100</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">%52+ </span>
                    <span class="text-500">since last week</span>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card-dashboard mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Customers</span>
                            <div class="text-900 font-medium text-xl">28441</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">520 </span>
                    <span class="text-500">newly registered</span>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card-dashboard mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Comments</span>
                            <div class="text-900 font-medium text-xl">152 Unread</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-comment text-purple-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">85 </span>
                    <span class="text-500">responded</span>
                </div>
            </div>

            <div class="col-12 xl:col-6 flex flex-column gap-2">
                <div class="card-dashboard">
                    <h5>Recent Sales</h5>
                    <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
                        <Column style="width: 15%">
                            <template #header> Image </template>
                            <template #body="slotProps">
                                <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image"
                                    width="50" class="shadow-2" />
                            </template>
                        </Column>
                        <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
                        <Column field="price" header="Price" :sortable="true" style="width: 35%">
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.price) }}
                            </template>
                        </Column>
                        <Column style="width: 15%">
                            <template #header> View </template>
                            <template #body>
                                <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div class="card-dashboard">
                    <div class="flex justify-content-between align-items-center mb-5">
                        <h5>Best Selling Products</h5>
                        <div>
                            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                                @click="$refs.menu2.toggle($event)"></Button>
                            <Menu ref="menu2" :popup="true" :model="items"></Menu>
                        </div>
                    </div>
                    <ul class="list-none p-0 m-0">
                        <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Space T-Shirt</span>
                                <div class="mt-1 text-600">Clothing</div>
                            </div>
                            <div class="mt-2 md:mt-0 flex align-items-center">
                                <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                    <div class="bg-orange-500 h-full" style="width: 50%"></div>
                                </div>
                                <span class="text-orange-500 ml-3 font-medium">%50</span>
                            </div>
                        </li>
                        <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                                <div class="mt-1 text-600">Accessories</div>
                            </div>
                            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                    <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                                </div>
                                <span class="text-cyan-500 ml-3 font-medium">%16</span>
                            </div>
                        </li>
                        <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                                <div class="mt-1 text-600">Accessories</div>
                            </div>
                            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                    <div class="bg-pink-500 h-full" style="width: 67%"></div>
                                </div>
                                <span class="text-pink-500 ml-3 font-medium">%67</span>
                            </div>
                        </li>
                        <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                                <div class="mt-1 text-600">Office</div>
                            </div>
                            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                    <div class="bg-green-500 h-full" style="width: 35%"></div>
                                </div>
                                <span class="text-green-500 ml-3 font-medium">%35</span>
                            </div>
                        </li>
                        <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                                <div class="mt-1 text-600">Accessories</div>
                            </div>
                            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                    <div class="bg-purple-500 h-full" style="width: 75%"></div>
                                </div>
                                <span class="text-purple-500 ml-3 font-medium">%75</span>
                            </div>
                        </li>
                        <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                                <div class="mt-1 text-600">Clothing</div>
                            </div>
                            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                    <div class="bg-teal-500 h-full" style="width: 40%"></div>
                                </div>
                                <span class="text-teal-500 ml-3 font-medium">%40</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-12 xl:col-6 flex flex-column gap-2">
                <div class="card-dashboard">
                    <h5>Sales Overview</h5>
                </div>
                <div class="card-dashboard">
                    <div class="flex align-items-center justify-content-between mb-4">
                        <h5>Notifications</h5>
                        <div>
                            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                                @click="$refs.menu1.toggle($event)"></Button>
                            <Menu ref="menu1" :popup="true" :model="items"></Menu>
                        </div>
                    </div>

                    <span class="block text-600 font-medium mb-3">TODAY</span>
                    <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                        <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div
                                class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i class="pi pi-dollar text-xl text-blue-500"></i>
                            </div>
                            <span class="text-900 line-height-3">Richard Jones
                                <span class="text-700">has purchased a blue t-shirt for <span
                                        class="text-blue-500">79$</span></span>
                            </span>
                        </li>
                        <li class="flex align-items-center py-2">
                            <div
                                class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                <i class="pi pi-download text-xl text-orange-500"></i>
                            </div>
                            <span class="text-700 line-height-3">Your request for withdrawal of <span
                                    class="text-blue-500 font-medium">2500$</span> has been initiated.</span>
                        </li>
                    </ul>

                    <span class="block text-600 font-medium mb-3">YESTERDAY</span>
                    <ul class="p-0 m-0 list-none">
                        <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div
                                class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i class="pi pi-dollar text-xl text-blue-500"></i>
                            </div>
                            <span class="text-900 line-height-3">Keyser Wick
                                <span class="text-700">has purchased a black jacket for <span
                                        class="text-blue-500">59$</span></span>
                            </span>
                        </li>
                        <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div
                                class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                                <i class="pi pi-question text-xl text-pink-500"></i>
                            </div>
                            <span class="text-900 line-height-3">Jane Davis
                                <span class="text-700">has posted a new questions about your product.</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grid {
    display: flex;
    justify-content: space-between;
}

.card-dashboard {
    background: var(--surface-card);
    padding: 2rem;
    box-shadow: var(--card-shadow);
    border-radius: 12px;
    border: 2px solid var(--surface-border);

    &:last-child {
        margin-bottom: 0;
    }
}
</style>
