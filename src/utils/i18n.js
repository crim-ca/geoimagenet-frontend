import i18n from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

const resources = {
    en: {
        title: {
            benchmarks: 'Benchmarks',
            mission: 'Mission',
            platform: 'Platform',
            taxonomy: 'Taxonomy',
            publications: 'Publications',
            collaborators: 'Collaborators',
            team: 'Team',
        },
        intro: {
            benchmarks: {
                item_1: 'The download gives you access to 90% of patches for training.',
                item_2: 'In researchers’ environment, the dataset can be used to create a PyTorch Model.',
                item_3: 'The trained model can be uploaded and evaluated on 10% of patches to obtain performance metrics.',
                item_4: 'The resulting performance can be published on a benchmark service.',
            },
            mission: 'GeoImageNet is a unique collaborative initiative involving remote sensing researchers, developers ' +
                'of digital research platforms, artificial intelligence experts and professionals dedicated to adding value to satellite imagery.',
            platform: {
                par_1: 'GeoImageNet is a collaborative research platform for researchers from different backgrounds who ' +
                    'wish to develop innovative algorithms for the exploitation of very high resolution (VHR) satellite images for various applications.',
                list_1: {
                    header: 'Facts',
                    item_1: 'OpenSource Platform in Python/JavaScript.',
                    item_2: 'Support OGC standards (WMS, WFS, WPS)',
                    item_3: 'GeoServer to share, process and edit geospatial data',
                    item_4: 'Birdhouse: Web Processing Services',
                },
                list_2: {
                    header: 'Connect to the platform',
                    demo_link_text: 'see the annotations',
                    item_1: 'If you want to take a look and do not have a login, <a href="/platform">see the annotations</a> on a base map of ' +
                        'Canada (no Pleiade images available without a login)',
                    item_2: `You can request a login at ${CONTACT_EMAIL} or just log in`,
                    item_3: 'Please note that the login will give you access to the demo version and that no annotation ' +
                        'will be use in dataset, the production platform will be available soon.',
                },
            },
            taxonomy: {
                download: 'Download our taxonomy.'
            },
            publications: {
                presentation: 'Presentation',
                press: 'Press Release',
                abstract: 'Abstract',
                poster: 'Poster',
                presentations: {
                    item_1: '2019, GeoImageNet: a Collaborative Platform for Deep Learning Application to Very High ' +
                        'Resolution EO Images, Yacine Bouroudi, Claude Chapdelaine, Samuel Foucher, David Byrns, Mario Beaulieu, ' +
                        'Pierre-Luc St-Charles, Mickaël Germain, Étienne Lauzier-Hudon, Pierre Bugnet, Nouri Sabo and ' +
                        'Claire Gosselin, 40 ième Symposium canadien de télédétection, 4-6 juin 2019 ',
                    item_2: '2019, GeoImageNet: A Collaborative Platform for the Annotation of VHR Images, Claude Chapdelaine, ' +
                        'Samuel Foucher, Yacine Bouroubi, David Byrns, Mario Beaulieu, Pierre Bugnet, Pierre-Luc St-Charles, ' +
                        'Tom Landry, Mickaël Germain, Living Planet 2019, Milan, Italy. ',
                },
                press_releases: {
                    item_1: {
                        intro: 'Press release from <u>Université de Sherbrooke</u> : ',
                        link_text: 'Une plateforme pour l’application de techniques d’intelligence artificielle à ' +
                            'l’exploitation des images satellites',
                    },
                    item_2: {
                        intro: 'Press release from <u>CRIM</u> : ',
                        link_text: 'GeoImageNet : l’intelligence artificielle appliquée aux images satellites!',
                    },
                    item_3: {
                        intro: 'Press release from <u>Effigis Géo-Solutions</u> : ',
                        link_text: 'An Automated Satellite Image Interpretation Application Based on Artificial ' +
                            'Intelligence is awarded Federal R & D Funding',
                    },
                    item_4: {
                        intro: 'Press release from <u>CANARIE</u> : ',
                        link_text: 'CANARIE Awards $4.4M to 20 Research Teams to Develop Advanced Software to Improve ' +
                            'Vaccines, Monitor Climate Change, and More',
                    },
                },
            },
            collaborators: 'Our collaborators',
            team: 'The team',
        },
        util: {
            'french': 'French',
            'english': 'English',
            'contact': 'Contact',
        },
        login: {
            'login': 'Login',
            'forbidden': 'Login forbidden.',
            'access_platform': 'Access platform',
            'username': "Username",
            'password': 'Password',
        },
    },
    fr: {
        title: {
            benchmarks: 'Tests de Modèles',
            mission: 'Notre Mission',
            platform: 'La Plateforme',
            taxonomy: 'La Taxonomie',
            publications: 'Publications',
            collaborators: 'Les Collaborateurs',
            team: "L'Équipe",
        },
        intro: {
            benchmarks: 'Tests de modèles',
            mission: 'Notre mission',
            platform: 'La plateforme',
            taxonomy: {
                download: 'Télécharger notre taxonomie.'
            },
            publications: {
                presentation: 'Présentation',
                press: 'Communiqués de presse',
                abstract: 'Résumé',
                poster: 'Affiche',
                presentations: {
                    item_1: '2019, GeoImageNet: a Collaborative Platform for Deep Learning Application to Very High ' +
                        'Resolution EO Images, Yacine Bouroudi, Claude Chapdelaine, Samuel Foucher, David Byrns, Mario Beaulieu, ' +
                        'Pierre-Luc St-Charles, Mickaël Germain, Étienne Lauzier-Hudon, Pierre Bugnet, Nouri Sabo and ' +
                        'Claire Gosselin, 40 ième Symposium canadien de télédétection, 4-6 juin 2019 ',
                    item_2: '2019, GeoImageNet: A Collaborative Platform for the Annotation of VHR Images, Claude Chapdelaine, ' +
                        'Samuel Foucher, Yacine Bouroubi, David Byrns, Mario Beaulieu, Pierre Bugnet, Pierre-Luc St-Charles, ' +
                        'Tom Landry, Mickaël Germain, Living Planet 2019, Milan, Italy. ',
                },
                press_releases: {
                    item_1: {
                        intro: 'Communiqué de l’<u>Université de Sherbrooke</u> : ',
                        link_text: 'Une plateforme pour l’application de techniques d’intelligence artificielle à ' +
                            'l’exploitation des images satellites',
                    },
                    item_2: {
                        intro: 'Communiqué du <u>CRIM</u> : ',
                        link_text: 'GeoImageNet : l’intelligence artificielle appliquée aux images satellites!',
                    },
                    item_3: {
                        intro: 'Communiqué d’<u>Effigis Géo-Solutions</u> : ',
                        link_text: 'Financement fédéral pour la recherche et développement d’une application ' +
                            'd’interprétation automatisée d’images satellite par intelligence artificielle',
                    },
                    item_4: {
                        intro: 'Communiqué de <u>CANARIE</u> : ',
                        link_text: 'CANARIE distribue 4,4 millions de dollars à vingt équipes de recherche pour qu’elles ' +
                            'perfectionnent leurs logiciels afin d’améliorer les vaccins, de surveiller le changement climatique et bien davantage',
                    },
                },
            },
            collaborators: 'Les collaborateurs',
            team: "L'équipe",
        },
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
            'contact': 'Contact',
        },
        login: {
            'login': 'Se Connecter',
            'forbidden': 'Accès interdit.',
            'access_platform': 'Accéder à la plateforme',
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
