<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { AIService } from "../../../service/ThirdPartyEndpoints";
import CardEffect from "../../CardEffect.vue";

const { t } = useI18n();
const userInput = ref("");
const content = computed(() => t("IA.WelcomeIA"));
const typeMessage = computed(() => t("IA.TypeMessage"));
const messages = ref([{ role: "ai", content: content }]);
const loading = ref(false);

const sendMessage = async () => {
	if (!userInput.value.trim()) return;

	messages.value.push({ role: "user", content: userInput.value });
	const messageToSend = userInput.value;
	userInput.value = "";
	loading.value = true;

	try {
		const aiResponse = await AIService.sendMessage(messageToSend);
		messages.value.push({ role: "ai", content: aiResponse });
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
	}
};
</script>

<template>
    <div class="col-8 lg:col-8 xl:col-6">
        <CardEffect>
            <div class="card chat-container">
                <div class="chat-wrapper">
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
</style>
