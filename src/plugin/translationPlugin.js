import { formatMessage } from '../service/localization';
import { setLanguageCookie, getLanguageCookie } from '../service/session';

export default (inject) => {
    inject('translate', (key) => {
        const language = getLanguageCookie() || 'en';
        return formatMessage[language][key] || key;
    });

    inject('setLanguage', (language) => {
        setLanguageCookie(language);
    });
};
