<script setup>
import { computed, ref } from 'vue';
import CustomDialog from './CustomDialog.vue';

defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible']);

const openMessages = ref(false);

const conversations = ref([
    { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'Hey, how are you?', timestamp: '10:40 AM' },
    { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'See you tomorrow!', timestamp: 'Yesterday' },
    { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3', lastMessage: 'Can you send me the file?', timestamp: 'Wednesday' },
]);

const messages = ref({
    1: [
        { id: 1, text: 'Hey, how are you?', sender: 'Alice', timestamp: '10:40 AM' },
        { id: 2, text: 'I am good, thanks! How about you?', sender: 'me', timestamp: '10:41 AM' },
        { id: 3, text: 'Doing great! Just working on a new project.', sender: 'Alice', timestamp: '10:42 AM' },
    ],
    2: [
        { id: 1, text: 'See you tomorrow!', sender: 'Bob', timestamp: 'Yesterday' },
    ],
    3: [
        { id: 1, text: 'Can you send me the file?', sender: 'Charlie', timestamp: 'Wednesday' },
        { id: 2, text: 'Sure, I will send it in a bit.', sender: 'me', timestamp: 'Wednesday' },
    ],
});

const selectedConversationId = ref(null);
const selectedConversation = computed(() => {
    if (!selectedConversationId.value) return null;
    return conversations.value.find(c => c.id === selectedConversationId.value);
});

const currentMessages = computed(() => {
    if (!selectedConversationId.value) return [];
    return messages.value[selectedConversationId.value] || [];
});

const selectConversation = (id) => {
    selectedConversationId.value = id;
};

const goBack = () => {
    selectedConversationId.value = null;
};

const closeModal = () => {
    emit('update:visible', false);
    openMessages.value = false;
    selectedConversationId.value = null; // Reset selection on close
};
</script>

<template>
    <div class="portfolio-root" v-bind="$attrs">
        <Button v-if="!visible" text class="w-full h-full" @click="openMessages = true"
            style="width: 100%; height: 100%; justify-content: center">
        </Button>
        <CustomDialog :visible="visible || openMessages" @update:visible="closeModal" :maximized="true" header="Mensagens">
            <div class="messages-app" :class="{ 'chat-active': selectedConversationId }">
                <div class="sidebar">
                    <div class="header">
                        <h2>Conversas</h2>
                    </div>
                    <ul class="conversation-list">
                        <li v-for="convo in conversations" :key="convo.id" @click="selectConversation(convo.id)"
                            :class="{ active: selectedConversationId === convo.id }">
                            <img :src="convo.avatar" alt="avatar" class="avatar">
                            <div class="convo-details">
                                <div class="name">{{ convo.name }}</div>
                                <div class="last-message">{{ convo.lastMessage }}</div>
                            </div>
                            <div class="timestamp">{{ convo.timestamp }}</div>
                        </li>
                    </ul>
                </div>
                <div class="chat-area">
                    <div v-if="selectedConversation" class="chat-header">
                        <button @click="goBack" class="back-button">
                            <i class="pi pi-arrow-left"></i>
                        </button>
                        <img :src="selectedConversation.avatar" alt="avatar" class="avatar">
                        <h3>{{ selectedConversation.name }}</h3>
                    </div>
                    <div class="messages-container">
                        <div v-for="message in currentMessages" :key="message.id" class="message"
                            :class="{ sent: message.sender === 'me', received: message.sender !== 'me' }">
                            <div class="bubble">{{ message.text }}</div>
                        </div>
                    </div>
                    <div v-if="selectedConversation" class="chat-input">
                        <input type="text" placeholder="Digite uma mensagem..." />
                        <button>Enviar</button>
                    </div>
                     <div v-else class="no-conversation-selected">
                        <i class="pi pi-comments" style="font-size: 4rem; color: #4a5568;"></i>
                        <p>Selecione uma conversa para começar</p>
                    </div>
                </div>
            </div>
        </CustomDialog>
    </div>
</template>

<style scoped>
.messages-app {
    display: flex;
    height: 100%;
    width: 100%;
    background-color: #1a202c;
    color: white;
    border-radius: 8px;
    overflow: hidden;
}

.sidebar {
    width: 300px;
    border-right: 1px solid #2d3748;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
}

.sidebar .header {
    padding: 20px;
    border-bottom: 1px solid #2d3748;
}

.conversation-list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex-grow: 1;
}

.conversation-list li {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.conversation-list li:hover {
    background-color: #2d3748;
}

.conversation-list li.active {
    background-color: #4a5568;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 15px;
}

.convo-details {
    flex-grow: 1;
}

.name {
    font-weight: bold;
}

.last-message {
    font-size: 0.9em;
    color: #a0aec0;
}

.timestamp {
    font-size: 0.8em;
    color: #718096;
    margin-left: 10px;
}

.chat-area {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    /* Adicionado para conter os filhos posicionados absolutamente em mobile */
    position: relative; 
}

.chat-header {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #2d3748;
}

.back-button {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    margin-right: 15px;
    cursor: pointer;
}

.chat-header h3 {
    margin: 0;
    font-size: 1.2em;
}

.messages-container {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.message {
    display: flex;
    margin-bottom: 15px;
    max-width: 70%;
}

.message.sent {
    align-self: flex-end;
}

.message.received {
    align-self: flex-start;
}

.bubble {
    padding: 10px 15px;
    border-radius: 18px;
    line-height: 1.4;
}

.sent .bubble {
    background-color: #3182ce;
    color: white;
}

.received .bubble {
    background-color: #4a5568;
    color: white;
}

.chat-input {
    display: flex;
    padding: 20px;
    border-top: 1px solid #2d3748;
}

.chat-input input {
    flex-grow: 1;
    padding: 10px;
    border-radius: 20px;
    border: none;
    background-color: #2d3748;
    color: white;
    margin-right: 10px;
}

.chat-input button {
    padding: 10px 15px;
    border-radius: 20px;
    border: none;
    background-color: #3182ce;
    color: white;
    cursor: pointer;
}

.no-conversation-selected {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #a0aec0;
    text-align: center;
}

@media (max-width: 768px) {
    .messages-app {
        position: relative;
        overflow: hidden;
    }

    .sidebar {
        width: 100%;
        position: absolute;
        height: 100%;
        z-index: 10;
    }

    .chat-area {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        background-color: #1a202c; /* Garante que o fundo não seja transparente durante a transição */
    }

    .messages-container {
        /* Ajusta a altura para preencher o espaço entre o header e o input */
        height: calc(100% - 125px); /* Ajuste este valor se o header/input mudarem de tamanho */
    }

    .messages-app.chat-active .sidebar {
        transform: translateX(-100%);
    }

    .messages-app.chat-active .chat-area {
        transform: translateX(0);
    }

    .back-button {
        display: block;
    }

    .no-conversation-selected {
        display: none; /* Oculta a mensagem "Selecione uma conversa" em mobile */
    }
}
</style>
