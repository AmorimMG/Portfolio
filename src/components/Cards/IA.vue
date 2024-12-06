<script setup>
import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RESTAPI } from "../../service/api";
import CardEffect from "../CardEffect.vue";
import VueNeonLight from "../VueNeonLight/vue-neon-light.vue";

const { t } = useI18n();
const userInput = ref("");
const content = computed(() => t("IA.WelcomeIA"));
const typeMessage = computed(() => t("IA.TypeMessage"));
const messages = ref([{ role: "ai", content: content }]);
const loading = ref(false);
const context = ref("Contexto de Personalidade: Seu Nome é: Gabriel Amorim, Idade: 23, Localização: Belo Horizonte, Brasil, Estilo de Comunicação: Informal e descontraído, Aprecia debates sobre tecnologia e compartilhar experiências, Gírias: \"Massa\", \"show de bola\", \"na moral\", Interesses: Programação web (front-end, back-end e DevOps), desenvolvimento nas principais tecnologias do mercado, música, e tecnologia, Gênero musical favorito: Hyperpop, Outros gêneros: Adoro indie e eletrônica, Crenças: Valorizo a colaboração e a inovação, Opiniões: Acredito que a educação em tecnologia deve ser acessível a todos, Resposta a perguntas: \"Sou apaixonado por programação e meu gênero musical favorito é hyperpop!\", Destaque: Gosto de resolver problemas complexos e ajudar outros desenvolvedores, Metas: Aprender novas linguagens de programação e contribuir para projetos open-source, Desejo: Ser visto como alguém que está sempre disposto a aprender e compartilhar conhecimento, responda a proxima mensagem de acordo com esse contexto.");
const showOverlay = ref(true);
const overlayVisible = ref(true);

const chatWrapper = ref(null);

const sendMessage = async () => {
	if (!userInput.value.trim()) return;

	messages.value.push({ role: "user", content: userInput.value });
    scrollToBottom();
	const messageToSend = {
		prompt: userInput.value,
		context: context.value,
	};
	userInput.value = "";
	loading.value = true;

	try {
		const aiResponse = await RESTAPI.IA(messageToSend);
		messages.value.push({ role: "ai", content: aiResponse.data });
	} catch (error) {
		let errorMessage = error.message;
		if (error.response && error.response.status === 429) {
			errorMessage =
				"You have exceeded the number of daily requests, please try again later!";
		}
		messages.value.push({
			role: "ai",
			content: errorMessage,
			isError: true,
		});
		console.error("Error fetching AI response:", error);
	} finally {
		loading.value = false;
        scrollToBottom();
	}
};
	
const scrollToBottom = () => {
	nextTick(() => {
		if (chatWrapper.value) {
			chatWrapper.value.scrollTop = chatWrapper.value.scrollHeight;
		}
	});
};

const hideOverlay = () => {
	overlayVisible.value = false;
	setTimeout(() => {
		showOverlay.value = false;
	}, 500);
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-4 pb-0" @click="hideOverlay">
        <CardEffect>
            <div class="card chat-container">
                <div v-if="showOverlay" class="overlay" :class="{ 'fade-out': !overlayVisible }">
                    <VueNeonLight size="15px" :flash="false" style="color: white">{{ $t('IA.IATalkWithMe') }}</VueNeonLight>
                </div>
                <div ref="chatWrapper" class="chat-wrapper">
                    <div v-for="(message, index) in messages" :key="index" :class="['message', message.role, { 'error-message': message.isError }]">
                        <p>{{ message.content }}</p>
                    </div>
                </div>
                    <Skeleton v-if="loading" width="100%" height="50px" class="loading-skeleton"></Skeleton>
                <div class="input-container">
                        <InputText class="w-full" v-model="userInput" :placeholder="typeMessage" @keyup.enter="sendMessage" />
                        <Button style="color: white" icon="pi pi-send" @click="sendMessage" />
                </div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    margin: auto;
    justify-content: space-between;
}

.chat-wrapper {
    overflow-y: scroll;
    max-width: 500px;
    display: flex;
    flex-direction: column;
}

.message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    width: fit-content;
}

.message.user {
    background-color: #d1e7dd;
    align-self: flex-end;
}

.message.ai {
    background-color: #7225d6;
    color: white;
    align-self: flex-start;
}

.error-message {
    background-color: red !important;
    color: white;
}

.input-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.loading-skeleton {
    margin-top: 20px;
}

.overlay {
    position: absolute;
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    transition: opacity 0.5s ease;
}

.fade-out {
    opacity: 0;
}
</style>
