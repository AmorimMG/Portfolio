import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import CustomDialog from './components/Modals/CustomDialog.vue';
import localization from './data/localization.json';

import '@/assets/styles.scss';
import { getDarkThemeCookie } from './service/session';

// Verifica o tema pelo cookie
if (getDarkThemeCookie()) {
    document.documentElement.classList.add('app-dark');
}

const app = createApp(App);
const pinia = createPinia();

const messages = localization;
const i18n = new createI18n({
    locale: 'en', // Linguagem Padrão
    fallbackLocale: 'en',
    legacy: false,
    messages
});

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});

app.use(pinia);
app.use(i18n);

app.use(ToastService);
app.use(ConfirmationService);

app.component('CustomDialog', CustomDialog);

app.mount('#app');
