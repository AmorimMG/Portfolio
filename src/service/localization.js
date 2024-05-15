import { ref } from 'vue';
import localizationData from '../data/localization.json';

const localization = ref(localizationData);

export function formatMessage(message, language) {
    if (message in localization.value) {
        if (language.value in localization.value[message]) {
            return localization.value[message][language.value];
        } else {
            return localization.value[message]['pt'];
        }
    } else {
        return message;
    }
}
