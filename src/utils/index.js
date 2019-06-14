import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next, useTranslation} from 'react-i18next';

export {notifier} from './notifications.js';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    'somekey': 'Here is the text for somekey'
                }
            },
            fr: {
                translation: {
                    'somekey': 'voici la traduction pour somekey'
                }
            }

        }
    });

export {i18n, useTranslation};
