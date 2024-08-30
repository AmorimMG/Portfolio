<script setup>
import { ref, watchEffect, watch, onMounted } from 'vue';
import Photos from '../cards/Photos.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CardEffect from '../CardEffect.vue';
import { useI18n } from 'vue-i18n';
import AppConfig from '../../layout/AppConfig.vue';
import { setLanguageCookie, getLanguageCookie } from '../../service/session';
import { useToast } from 'primevue/usetoast';
import { RESTAPI } from '../../service/api.js';
import EmailModal from './modals/EmailModal.vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSteamSymbol } from '@fortawesome/free-brands-svg-icons/faSteamSymbol';
import { faLastfm } from '@fortawesome/free-brands-svg-icons/faLastfm';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

const { locale } = useI18n();
const dropdownValues = ref([
    { name: 'Português', code: 'BR', value: 'pt' },
    { name: 'Español', code: 'ES', value: 'es' },
    { name: 'English', code: 'UK', value: 'en' }
]);

const dropdownValue = ref(null);
const appConfigRef = ref(null);
const feedback = ref();
const name = ref('');
const email = ref('');
const message = ref('');
const toast = useToast();
const modalEmailVisible = ref(false);

const props = defineProps({
    menuVisible: Boolean
});

const emit = defineEmits(['update:menuVisible']);

const toggleMenu = () => {
    emit('update:menuVisible', !props.menuVisible);
};

onMounted(() => {
    if (getLanguageCookie()) {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === getLanguageCookie());
        locale.value = getLanguageCookie();
    } else {
        dropdownValue.value = dropdownValues.value.find((option) => option.value === 'en');
        locale.value = dropdownValue.value;
    }
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

const toggleFiap = (event) => {
    this.$emit('toggle', event);
};

const toggleFeedback = (event) => {
    feedback.value.toggle(event);
};

const showEmailModal = () => {
    modalEmailVisible.value = true;
};

const closeEmailModal = () => {
    modalEmailVisible.value = false;
};

const sendEmail = async () => {
    const body = {
        name: name.value,
        email: email.value,
        message: message.value
    };

    RESTAPI.EnviarEmail(body)
        .then((response) => {
            if (response.ok) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Email sent successfully', life: 3000 });
                name.value = '';
                email.value = '';
                message.value = '';
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to send email', life: 3000 });
            }
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        });
};
</script>

<template>
    <div class="page" :style="{ display: menuVisible ? 'flex' : 'none' }">
        <div>
            <div class="flex flex-column justify-content-between m-3" style="text-align: start; position: relative">
                <div class="settings">
                    <div class="flex gap-3">
                        <button class="p-btn p-link layout-topbar-button" type="button" @click="appConfigRef.onConfigButtonClick()">
                            <i class="pi pi-cog" style="font-size: 20px"></i>
                        </button>
                        <router-link style="opacity: 0.5" to="/login" class="layout-topbar-logo center">
                            <button class="p-btn p-link layout-topbar-button" type="button">
                                <i class="pi pi-sign-in" style="font-size: 20px"></i>
                            </button>
                        </router-link>
                    </div>
                    <app-config simple ref="appConfigRef"></app-config>
                    <div class="flex gap-3">
                        <dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" class="dropdown flex align-items-center">
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
                        <button id="toggleMenuButton" class="p-btn p-link layout-topbar-button" type="button" @click="toggleMenu()">
                            <FontAwesomeIcon style="font-size: 20px" :icon="faBars" />
                        </button>
                    </div>
                </div>
                <div class="upper">
                    <div class="flex flex-row justify-content-between m-3">
                        <div class="center flex-row gap-2"><i class="pi pi-comment"></i> About Me</div>
                        <div class="flex gap-3">
                            <a href="https://github.com/AmorimMG" target="_blank" rel="noopener noreferrer"><i class="pi pi-github zoom"></i></a>
                            <a href="https://www.linkedin.com/in/gabrielamorim0/" target="_blank" rel="noopener noreferrer"><i class="pi pi-linkedin zoom"></i></a>
                            <a href="https://www.instagram.com/amorim.gg_/" target="_blank" rel="noopener noreferrer"><i class="pi pi-instagram zoom"></i></a>
                            <a href="https://discord.com/AmorimMG" target="_blank" rel="noopener noreferrer"><i class="pi pi-discord zoom"></i></a>
                            <a href="https://steamcommunity.com/id/RecNove/" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon class="zoom" :icon="faSteamSymbol" />
                            </a>
                            <a href="https://www.last.fm/user/RecNove" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon class="zoom" :icon="faLastfm" />
                            </a>
                        </div>
                    </div>
                    <div class="mt-3 center">
                        <VueNeonLight color="#ff00ff" size="25px" :flash="true"> {{ $t('Hi') }} </VueNeonLight>
                    </div>
                    <div class="text-image-container">
                        <div class="center">
                            <CardEffect>
                                <img class="profile-picture" src="/src/assets/images/cards/profilePic.png" alt="Image" />
                            </CardEffect>
                        </div>
                        <div class="center wrap" style="max-height: 100px">
                            <p>
                                {{ $t('AboutMe') }}
                                <a href="https://www.fiap.com.br/" target="_blank" rel="noopener noreferrer" style="color: #abcb1a" class="underline" @mouseenter="toggleFiap" @mouseleave="toggleFiap">FIAP.</a>
                            </p>
                            <br />
                            <p>
                                {{ $t('Interests') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <!-- <Photos /> -->
                    <div class="flex flex-row justify-content-between m-3">
                        <div class="center flex-row gap-2"><i class="pi pi-phone"></i> Contact</div>
                    </div>
                    <div class="flex flex-column" style="padding: 20px">
                        <p>If you want to chat, feel free to reach out to me on Twitter, or join my Discord server. You can also email me at:</p>
                        <div class="center mt-5"><Button outlined @click="showEmailModal" style="color: #abcb1a" class="underline">gabriel@amorim.pro</Button></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="center mb-3">
            <Button type="button" icon="pi pi-exclamation-triangle" size="small" style="color: white" label="Feedback" @click="toggleFeedback" />
        </div>
    </div>
    <OverlayPanel
        style="background: rgba(120, 89, 182, 0.65); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border-radius: 12px; border: 2px solid #4d25b0"
        ref="feedback"
        appendTo="body"
    >
        <div style="padding: 1rem">
            <div class="center">
                <VueNeonLight color="white" size="25px" :flash="false"> Feedback </VueNeonLight>
            </div>
            <form @submit.prevent="sendEmail">
                <div class="p-fluid">
                    <div class="p-field col">
                        <FloatLabel>
                            <InputText id="name" v-model="name" required />
                            <label for="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div class="p-field col">
                        <FloatLabel>
                            <InputText id="email" type="email" v-model="email" required />
                            <label for="email">Email</label>
                        </FloatLabel>
                    </div>
                    <div class="p-field col">
                        <FloatLabel>
                            <Textarea id="message" v-model="message" rows="5" required />
                            <label for="message">Message</label>
                        </FloatLabel>
                    </div>
                    <div class="p-field col">
                        <Button type="submit" label="Submit" />
                    </div>
                </div>
            </form>
        </div>
    </OverlayPanel>
    <EmailModal :emailVisible="modalEmailVisible" @close="closeEmailModal" />
</template>

<style scoped>
p {
    text-align: justify;
    margin: 0;
}

h5 {
    margin: 0;
}

.menu-active {
    display: none;
}

.settings {
    display: flex;
    justify-content: space-between;
}

.zoom:hover {
    opacity: 1 !important;
    animation: none;
    cursor: pointer;
    transform: scale(2);
    color: #ff00ff;
}

.page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--sidebar-bg);
    width: 100%;
    height: 100vh !important;
    aspect-ratio: 2 / 1;
    padding: 0;
    max-height: none;
    border: 2px solid transparent;
    box-shadow: 0 0 5px #ff00ff;
}

.text-image-container {
    display: flex;
    padding: 20px;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.profile-picture {
    border: 2px solid transparent;
    box-shadow: 0 0 5px #ff00ff;
    margin-right: 10px;
    max-width: 120px;
    height: auto;
    width: 120px;
}

#toggleMenuButton {
    display: none;
}

@media (max-width: 991px) {
    #Introduction {
        width: 95%;
        position: absolute;
        right: 0;
    }

    #toggleMenuButton {
        display: flex;
    }

    .text-image-container {
        flex-direction: column;
        align-items: center;
    }

    .wrap {
        max-height: none;
        text-align: center;
    }

    .profile-picture {
        margin-bottom: 20px;
    }
}
</style>
