<script setup>
import { useToast } from "primevue/usetoast";
import { ref, onUnmounted } from 'vue';
import { useI18n } from "vue-i18n";
import sessionModule from "../service/session.js";

const toast = useToast();
const { t: $t } = useI18n();
const visible = ref(false);
const form = ref({
    login: "",
    password: "",
});

const emit = defineEmits(['login-success']);

onUnmounted(() => {
    visible.value = false;
});

function validateUser(user) {
    return (
        (user?.login?.trim()?.length ?? 0) > 0 &&
        (user?.password?.trim()?.length ?? 0) > 0
    );
}

function handleSubmit() {
    const user = {
        usuario: form.value.login,
        senha: form.value.password,
    };
    
    if (validateUser(form.value)) {
        sessionModule.actions
            ?.login({ user })
            .then((res) => {
                toast.add({
                    severity: "success",
                    summary: $t("SummarioToastSucesso") || "Sucesso",
                    detail: $t("UserLoggedIn") || "Login realizado com sucesso",
                    life: 2000,
                });
                
                toast.removeGroup('headless');
                visible.value = false;
                form.value.login = "";
                form.value.password = "";
                emit('login-success');
            })
            .catch((error) => {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: error || "Erro ao fazer login",
                    life: 3000,
                });
            });
    } else {
        toast.add({
            severity: "warn",
            summary: "Atenção",
            detail: "Por favor, preencha todos os campos",
            life: 3000,
        });
    }
}

const show = () => {
    if (!visible.value) {
        toast.add({ 
            severity: 'custom', 
            summary: 'Login necessário', 
            group: 'headless', 
            styleClass: 'backdrop-blur-lg rounded-2xl' 
        });
        visible.value = true;
        form.value.login = "";
        form.value.password = "";
    }
};

const hide = () => {
    toast.removeGroup('headless');
    visible.value = false;
    form.value.login = "";
    form.value.password = "";
};

defineExpose({ show, hide });
</script>

<template>
    <div>
        <Toast position="top-center" group="headless" @close="visible = false">
            <template #container="{ message, closeCallback }">
                <section class="flex flex-col p-6 gap-4 w-96 bg-gradient-to-b from-purple-400/80 to-blue-500/80 backdrop-blur-lg rounded-2xl border border-white/20">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <i class="pi pi-lock text-white text-2xl"></i>
                            <span class="font-bold text-lg text-white">{{ message.summary }}</span>
                        </div>
                        <Button 
                            icon="pi pi-times" 
                            @click="closeCallback" 
                            text 
                            rounded 
                            size="small"
                            class="text-white hover:bg-white/20"
                        />
                    </div>
                    
                    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                        <div>
                            <label class="block text-white text-sm font-medium mb-2">
                                {{ $t("Login.User") || "Usuário" }}
                            </label>
                            <InputText
                                v-model="form.login"
                                type="text"
                                :placeholder="$t('Login.User') || 'Usuário'"
                                class="w-full"
                                size="small"
                                @keyup.enter="handleSubmit"
                            />
                        </div>

                        <div>
                            <label class="block text-white text-sm font-medium mb-2">
                                {{ $t("Login.Password") || "Senha" }}
                            </label>
                            <Password
                                v-model="form.password"
                                :placeholder="$t('Login.Password') || 'Senha'"
                                :toggleMask="true"
                                class="w-full"
                                size="small"
                                inputClass="w-full"
                                @keyup.enter="handleSubmit"
                            />
                        </div>

                        <div class="flex gap-3 justify-end mt-2">
                            <Button 
                                label="Cancelar" 
                                size="small" 
                                outlined
                                class="text-white border-white hover:bg-white/20"
                                @click="closeCallback"
                            />
                            <Button 
                                type="submit"
                                :label="$t('Login.SignInButton') || 'Entrar'" 
                                size="small"
                                class="bg-white text-purple-600 hover:bg-gray-100"
                            />
                        </div>
                    </form>
                </section>
            </template>
        </Toast>
    </div>
</template>
