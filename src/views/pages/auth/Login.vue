<script setup>
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useRouter } from "vue-router";
import sessionModule from "../../../service/session.js";

const checked = ref(false);
const router = useRouter();
const toast = useToast();

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
    <div class="wrapper w-full h-full surface-ground flex align-items-center justify-content-center overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <form class="form-container" @submit.prevent="handleSubmit">
                <div style="border-radius: 56px; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                        <div class="text-center mb-5">
                            <img src="/src/assets/images/cards/profilePic.png" alt="Image" height="100" />
                            <div class="text-900 text-3xl font-medium mb-3">{{$t('Login.Welcome')}}</div>
                            <span class="text-600 font-medium">{{$t('Login.SingIn')}}</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-900 text-xl font-medium mb-2">User</label>
                            <InputText id="email1" v-model="form.login" type="text" placeholder="User" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password id="password1" v-model="form.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5"></div>
                            <Button type="submit" label="Sign In" class="w-full p-3 text-xl"></Button>
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
