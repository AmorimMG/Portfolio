<script setup>
import { useToast } from "primevue/usetoast";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Background from "../../../components/Background.vue";
import sessionModule, {
	getLanguageCookie,
	setLanguageCookie,
} from "../../../service/session.js";

const { locale } = useI18n();
const dropdownValues = ref([
	{ name: "Português", code: "BR", value: "pt" },
	{ name: "Español", code: "ES", value: "es" },
	{ name: "English", code: "UK", value: "en" },
]);
const dropdownValue = ref(null);
const checked = ref(false);
const router = useRouter();
const toast = useToast();

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

function validateUser(user) {
	return (
		(user?.login?.trim()?.length ?? 0) > 0 &&
		(user?.password?.trim()?.length ?? 0) > 0
	);
}

const form = ref({
	login: "",
	password: "",
});

function handleSubmit() {
	const user = {
		email: form.value.login,
		password: form.value.password,
	};
	if (validateUser(form.value)) {
		sessionModule.actions
			?.login({ user })
			.then((res) => {
				console.log(res);
				toast.add({
					severity: "success",
					summary: "gblSummarioToastSucesso",
					detail: "gblUsuarioLogadoSucesso",
					life: 3000,
				});
				router.push("/cadastros/dashboard");
			})
			.catch((error) => {
				toast.add({
					severity: "error",
					summary: "Erro",
					detail: error,
					life: 3000,
				});
			});
	}
}
sessionModule.actions.logout();
</script>

<template>
    <Toast />
    <Background />
        <Button class="mt-3 ml-3 absolute" icon="pi pi-arrow-left" @click="router.push('/')" label="Voltar" text raised></Button>
    <div class="wrapper w-full h-full flex align-items-center justify-content-center overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <form class="form-container" @submit.prevent="handleSubmit">
                <div style="border-radius: 56px; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                        <div style="display: flex;justify-content: end;">
                                                <dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" class="dropdown">
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
                        </div>
                        <div class="text-center mb-5">
                            <img src="/src/assets/images/cards/profilePic.png" alt="Image" height="100" />
                            <div class="text-900 text-3xl font-medium mb-3">{{$t('Login.Welcome')}}</div>
                            <span class="text-600 font-medium">{{$t('Login.SingIn')}}</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-900 text-xl font-medium mb-2">{{$t('Login.User')}}</label>
                            <InputText id="email1" v-model="form.login" type="text" :placeholder="$t('Login.User')" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                            <label for="password1" class="block text-900 font-medium text-xl mb-2">{{$t('Login.Password')}}</label>
                            <Password id="password1" v-model="form.password" :placeholder="$t('Login.Password')" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5"></div>
                            <Button type="submit" :label="$t('Login.SignInButton')" class="w-full p-3 text-xl"></Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    height: 100vh !important;
}
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
