import i18n from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

const resources = {
    en: {
        util: {
            'french': 'French',
            'english': 'English',
            'username': "Username",
            'password': 'Password',
        },
    },
    fr: {
        presentation: {
            'par-1': 'GeoImageNet sera élaborée par les équipes des professeurs Yacine Bouroubi et ' +
                'Samuel Foucher et constituera une évolution de la plateforme Analyse de puissance pour la ' +
                'visualisation des données climatologiques (PAVICS) développée par le CRIM.',
            'par-2': '« GeoImageNet inclura des outils d’annotation d’images satellites à très haute résolution ' +
                'spatiale (THR). Le projet a pour objectif de développer des algorithmes d’apprentissage profond ' +
                'pour la cartographie de l’occupation du sol et la détection des objets à partir des images ' +
                'satellites THR », souligne le professeur Bouroubi.',
            'par-3': 'L’équipe du professeur en géomatique appliquée Yacine Bouroubi fait partie des vingt équipes ' +
                'lauréates qui recevront 214 000 $ dans le cadre du programme Logiciels de recherche de CANARIE, ' +
                'l’un des piliers de l’infrastructure numérique qui sous-tend la recherche, l’éducation et ' +
                'l’innovation au Canada.',
            'par-4': 'Grâce à ces fonds, l’équipe du professeur Bouroubi réalisera, en collaboration avec celle du ' +
                'professeur Samuel Foucher, chercheur principal au CRIM (Centre de recherche en informatique de Montréal), ' +
                'cette plateforme de recherche pour l’application des techniques d’intelligence artificielle à ' +
                'l’exploitation des images satellites de très haute résolution spatiale.',
            'par-5': 'La plateforme GeoImageNet sera disponible pour d’autres équipes de recherche de partout au ' +
                'pays œuvrant dans différentes disciplines de la télédétection.',
            'par-6': 'Le projet est mené par l’Université de Sherbrooke, en partenariat avec le CRIM et la compagnie ' +
                'Effigis Géo-Solutions. Le Centre canadien de cartographie et d’observation de la Terre (CCCOT) de ' +
                'Ressources naturelles Canada est aussi un partenaire important du projet. La plateforme GeoImageNet ' +
                'sera ouverte aux différents organismes canadiens (laboratoires universitaires, centre de recherche, ' +
                'industrie, etc.) qui œuvrent dans le domaine de la télédétection et de l’application de ' +
                'l’intelligence artificielle dans ce domaine. Ces organismes seront invités à utiliser les ' +
                'développements réalisés et à y contribuer.',
            'par-7': 'Fondé en 1993, CANARIE est une société sans but lucratif principalement financée par le ' +
                'gouvernement du Canada.',
        },
        util: {
            'french': 'Français',
            'english': 'Anglais',
            'username': "Nom d'usager",
            'password': 'Mot de passe',
        },
    }
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
        defaultNS: 'presentation',
        fallbackLng: ['fr', 'dev'],
        resources: resources,
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,
            caches: ['localStorage', 'cookie'],
        }
    });

export {i18n};
