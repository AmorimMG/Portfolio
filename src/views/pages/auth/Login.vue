<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Background from '../../../components/Background.vue';
import sessionModule, { getLanguageCookie, setLanguageCookie } from '../../../service/session.js';

const { locale } = useI18n();
const dropdownValues = ref([
    { name: 'Português', code: 'BR', value: 'pt' },
    { name: 'Español', code: 'ES', value: 'es' },
    { name: 'English', code: 'UK', value: 'en' }
]);
const dropdownValue = ref(null);
const checked = ref(false);
const router = useRouter();
const toast = useToast();

onMounted(() => {
    if (getLanguageCookie()) {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === getLanguageCookie());
        locale.value = getLanguageCookie();
    } else {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === 'en');
        locale.value = dropdownValue.value;
    }

    // Salva o background original
    const originalBackground = document.body.style.backgroundColor;
    // Define o novo background
    document.body.style.backgroundColor = '#0f0026';

    // Limpa ao desmontar o componente
    onUnmounted(() => {
        document.body.style.backgroundColor = originalBackground;
    });
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

function validateUser(user) {
    return (user?.login?.trim()?.length ?? 0) > 0 && (user?.password?.trim()?.length ?? 0) > 0;
}

const form = ref({
    login: '',
    password: ''
});

function handleSubmit() {
    const user = {
        usuario: form.value.login,
        senha: form.value.password
    };
    if (validateUser(form.value)) {
        sessionModule.actions
            ?.login({ user })
            .then((res) => {
                toast.add({
                    severity: 'success',
                    summary: 'gblSummarioToastSucesso',
                    detail: 'gblUsuarioLogadoSucesso',
                    life: 3000
                });
                console.log('levando para cadastros');
                router.push('/cadastros/dashboard');
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error,
                    life: 3000
                });
            });
    }
}
sessionModule.actions.logout();
</script>

<template>
    <div class="login-page">
        <Toast />
        <Background />
        <Button class="botao-absoluto mt-3 ml-3" icon="pi pi-arrow-left" @click="router.push('/')" label="Voltar" text
            raised />

        <div class="wrapper w-full h-full flex align-items-center justify-content-center overflow-hidden">
            <div class="w-full">
                <form class="w-full h-full flex flex-col items-center justify-center" @submit.prevent="handleSubmit">
                    <div :style="{ width: '500px' }" class="rounded-[56px]"
                        style="background: linear-gradient(180deg, #a78bfa 10%, rgba(33, 150, 243, 0) 30%)">
                        <div class="w-full py-8 px-8 sm:px-8 rounded-[53px]">
                            <div class="flex justify-end">
                                <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name"
                                    class="dropdown">
                                    <template #value="slotProps">
                                        <div v-if="slotProps.value" class="flex items-center">
                                            <img loading="lazy" width="20" :alt="slotProps.value.label"
                                                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                                                :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" />
                                        </div>
                                        <span v-else>
                                            {{ slotProps.placeholder }}
                                        </span>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="flex items-center">
                                            <img loading="lazy" width="18" :alt="slotProps.option.label"
                                                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                                                :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" />
                                            <div>{{ slotProps.option.name }}</div>
                                        </div>
                                    </template>
                                </Select>
                            </div>

                            <div class="mt-5 flex flex-col items-center text-center mb-5">
                                <img loading="lazy" width="100" height="100" src="@/assets/images/cards/profilePic.png"
                                    alt="Image" />
                                <div class="text-white text-3xl font-medium mb-3">{{ $t('Login.Welcome') }}</div>
                                <span class="text-white font-medium">{{ $t('Login.SingIn') }}</span>
                            </div>

                            <div>
                                <!-- Login field -->
                                <label for="login-input" class="block text-white text-xl font-medium mb-2">
                                    {{ $t('Login.User') }}
                                </label>
                                <InputText id="login-input" v-model="form.login" type="text"
                                    :placeholder="$t('Login.User')" class="w-full mb-5 p-4" />

                                <!-- Password field -->
                                <label for="password-input" class="block text-white font-medium text-xl w-full mb-3">
                                    {{ $t('Login.Password') }}
                                </label>
                                <Password id="password-input" v-model="form.password"
                                    :placeholder="$t('Login.Password')" :toggleMask="true" class="w-full mb-3" :pt="{
                                        input: { id: 'password-input' }
                                    }" inputClass="w-full" :inputStyle="{ padding: '1rem' }" />

                                <div class="flex items-center justify-between mb-5 gap-5"></div>

                                <Button type="submit" :label="$t('Login.SignInButton')" class="w-full p-3 text-xl" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style>
/* Remove scoped to permitir que este estilo afete o body */
.login-page {
    min-height: 100vh;
}

/* Quando o componente login estiver montado, afeta o body */
:root:has(.login-page) body {
    background-color: #0f0026 !important;
}
</style>

<style scoped>
.wrapper {
    height: 100vh !important;
}

.botao-absoluto {
    position: absolute;
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
