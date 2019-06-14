import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next, useTranslation} from 'react-i18next';
import {resources} from './i18n';

export {notifier} from './notifications.js';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        resources: resources
    });

export {i18n, useTranslation};
