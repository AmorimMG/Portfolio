import { ref } from 'vue';
import localizationData from '../data/localization.json';
import { getLanguageCookie } from '../service/session';

const localization = ref(localizationData);

const currentLanguage = ref(getLanguageCookie());

function watchLanguageCookie() {
    setInterval(() => {
        const newLanguage = getLanguageCookie();
        if (newLanguage !== currentLanguage.value) {
            currentLanguage.value = newLanguage;
        }
    }, 500);
}
watchLanguageCookie();

export function formatMessage(message) {
    const language = currentLanguage.value;

    if (message in localization.value) {
        if (language in localization.value[message]) {
            return localization.value[message][language];
        } else {
            return localization.value[message]["pt"];
        }
    } else {
        return message;
    }
}