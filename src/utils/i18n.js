// @flow strict

import i18n from 'i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

const resources = {
    en: {
        settings: {
            username: "Username",
            nickname: "Nickname",
            password: 'Password',
            unique_id: 'Unique ID',
            id: 'Id',
            followed_users: 'Followed users',
            followed_user_id: "Other user's unique id",
            followed_user_nickname: 'Choose a nickname',
            save: 'Add',
            delete_user: 'Remove user from the list',
            fetch_followed_users_failure: "We were unable to get your followed users list.",
            save_followed_users_success: "We added the user to your followed users list.",
            save_followed_users_failure: "We were unable to add the user to your followed users list.",
            remove_followed_user_success: "We removed the user from your followed users list.",
            remove_followed_user_failure: "We were unable to remove the user from your followed users list.",
        },
        title: {
            benchmarks: 'Benchmark',
            mission: 'Mission',
            platform: 'Platform',
            taxonomy: 'Taxonomy',
            publications: 'Publications',
            collaborators: 'Research collaborators',
            team: 'Team',
        },
        intro: {
            benchmarks: {
                item_1: 'When a large number of annotations will be available, researchers will be able to download 90% of patches for training (dataset).',
                item_2: 'Researchers can use the dataset to create a PyTorch Model within their own environment.',
                item_3: 'The resulting models can be uploaded and evaluated with the 10% of remaining patches.',
                item_4: 'GeoImageNet offers a benchmarking service with an evaluation server to obtain performance metrics in order to share and collaborate their works.',
            },
            mission: {
                what: '<b>What</b> :  GeoImageNet is a unique collaborative initiative involving remote sensing researchers, ' +
                    'developers of digital research platforms, artificial intelligence experts and professionals dedicated ' +
                    'to derive value from satellite imagery.',
                how: '<b>How</b> : By facilitating the creation and download of annotations on Pleiades (50 cm)  images. The imagery ' +
                    'used to build this database includes more than 10,000 km2 of Pleiades images covering Canada\'s major cities ' +
                    'as well as various other natural and anthropogenic environments (forests, wetlands, mining sites, agricultural areas, etc.). ' +
                    'These annotations are based on a taxonomy containing many objects (approx. 180) and land cover types (approx. 50).',
                why: '<b>Why</b> : To promote deep learning research on Earth Observation (EO) data for detection, segmentation and ' +
                    'other automated tasks. This will allow researchers from diverse institutions to collaborate in a more ' +
                    'structured and effective manner for the application of deep learning in remote sensing and to develop new ' +
                    'value-added products based on VHR satellite images. This synergy will facilitate making more progress in research, ' +
                    'both in remote sensing applications and in the development of machine learning algorithms.',
            },
            platform: {
                par_1: 'GeoImageNet is a collaborative research platform for researchers from different backgrounds who ' +
                    'wish to develop innovative algorithms for the exploitation of very high resolution (VHR) satellite ' +
                    'images for various applications.',
                section_1: {
                    header: 'Technological components:',
                    item_1: 'OpenSource Platform in Python/JavaScript',
                    item_2: 'Compatible with OGC standards (WMS, WFS, WPS)',
                    item_3: 'GeoServer to share, process and edit geospatial data',
                    item_4: 'Birdhouse: Web Processing Services',
                },
                section_2: {
                    header: 'Connect to the platform demo:',
                    par_1: 'If you want to take a look and do not have a login, you will only <a href="/platform">see the annotations</a> ' +
                        'on a base map of Canada (Pleiades images are unavailable without a login).',
                    par_2: `You can also request a login at <a href="mailto:{{contact_email}}">{{contact_email}}</a> or just log in using the link at the top of the page.`,

                },
                section_3: {
                    header: 'Please note:',
                    item_1: 'For now, the login will give you access to the demo version only and no annotations will be used in the dataset.',
                    item_2: 'On the demo platform, the annotations made by users will be deleted every week.',
                    item_3: 'Once on the platform, and in order to see existing annotations, select either “Object“ or ' +
                        '“Land cover“ in the Taxonomy and click on the “eye icon” to make them visible.',
                    item_4: 'The production platform will be available soon.',
                },
            },
            taxonomy: {
                par_1: 'Land cover types: 48 classes',
                par_2: 'Objects: 178 classes',
                download: 'Download the JSON file',
                no_taxonomies: 'There doesn\'t seem to be any taxonomies in the database.'
            },
            publications: {
                presentation: 'Presentation',
                press: 'Press Release',
                abstract: 'Abstract',
                poster: 'Poster',
                section_1: {
                    header: 'Presentations:',
                    item_1: '2019, GeoImageNet: a Collaborative Platform for Deep Learning Application to Very High ' +
                        'Resolution EO Images, Yacine Bouroudi, Claude Chapdelaine, Samuel Foucher, David Byrns, Mario Beaulieu, ' +
                        'Pierre-Luc St-Charles, Mickaël Germain, Étienne Lauzier-Hudon, Pierre Bugnet, Nouri Sabo and ' +
                        'Claire Gosselin, 40 ième Symposium canadien de télédétection, 4-6 juin 2019 ',
                    item_2: '2019, GeoImageNet: A Collaborative Platform for the Annotation of VHR Images, Claude Chapdelaine, ' +
                        'Samuel Foucher, Yacine Bouroubi, David Byrns, Mario Beaulieu, Pierre Bugnet, Pierre-Luc St-Charles, ' +
                        'Tom Landry, Mickaël Germain, Living Planet 2019, Milan, Italy. ',
                },
                section_2: {
                    header: 'Press releases:',
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
                section_3: {
                    header: 'Publications:',
                    item_1: 'No paper available yet',
                }
            },
            collaborators: {
                item_1: 'Yacine Bouroubi – Université de Sherbrooke',
                item_2: 'Samuel Foucher – CRIM',
                item_3: 'Jérôme Théau – Université de Sherbrooke',
                item_4: 'Nouri Nabo – NRCAN',
                item_5: 'François Cavayas – Université de Montréal',
                item_6: 'Pierre Gravel - NRCAN',
                item_7: 'Yves Moisan - NRCAN',
                item_8: 'Mathieu Turgeon-Pelchat - NRCAN',
                item_9: 'Daniel Pilon - NRCAN',
                item_10: 'David Lapointe - NRCAN',
            },
            team: {
                section_1: {
                    header: 'Université de Sherbrooke:',
                    item_1: 'Yacine Bouroubi',
                    item_2: 'Mickaël Germain',
                    item_3: 'Étienne Lauzier-Hudon',
                },
                section_2: {
                    header: 'CRIM :',
                    item_1: 'Samuel Foucher',
                    item_2: 'Claude Chapdelaine',
                    item_3: 'David Byrns',
                    item_4: 'Mario Beaulieu',
                    item_5: 'David Caron',
                    item_6: 'Francis Charette Migneault',
                    item_7: 'Pierre-Luc St-Charles',
                    item_8: 'Félix Gagnon-Grenier',
                },
                section_3: {
                    header: 'Effigis Geo-Solutions:',
                    item_1: 'Claire Gosselin',
                    item_2: 'Thuy Nguyen-Xuan',
                    item_3: 'Pierre Bugnet',
                },
                section_4: {
                    header: 'NRCan:',
                    item_1: 'Mathieu Turgeon-Pelchat',
                },
            },
        },
        taxonomy_viewer: {
            tooltip: {
                new: '{{count}} new annotation of class {{taxonomy_class}}.',
                new_plural: '{{count}} new annotations of class {{taxonomy_class}}.',
                released: '{{count}} released annotation of class {{taxonomy_class}}.',
                released_plural: '{{count}} released annotations of class {{taxonomy_class}}.',
                validated: '{{count}} valid annotation of class {{taxonomy_class}}.',
                validated_plural: '{{count}} valid annotations of class {{taxonomy_class}}.',
            },
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
        settings: {
            username: "Nom d'utilisateur/trice",
            nickname: "Surnom",
            password: 'Mot de passe',
            unique_id: 'Id unique',
            id: 'Id',
            followed_users: 'Utilisateurs/trices suiviEs',
            followed_user_id: 'Id unique voulu',
            followed_user_nickname: 'Surnom voulu',
            save: 'Ajouter',
            delete_user: 'Retirer utilisateur/trice de la liste.',
            fetch_followed_users_failure: "Nous n'avons pu générer la liste de vos utilisateurs/trices suiviEs.",
            save_followed_users_success: "Nous avons ajouté l'utilisateur/trice à votre compte.",
            save_followed_users_failure: "Nous n'avons pu ajouter l'utilisateur/trice à votre compte.",
            remove_followed_user_success: "Nous avons retiré l'utilisateur/trice de votre compte.",
            remove_followed_user_failure: "Nous n'avons pu retirer l'utilisateur/trice de votre compte.",
        },
        title: {
            benchmarks: 'Benchmark/Test',
            mission: 'Mission',
            platform: 'Plateforme',
            taxonomy: 'Taxonomie',
            publications: 'Publications',
            collaborators: 'Collaborateurs de recherche',
            team: "Équipe",
        },
        intro: {
            benchmarks: {
                item_1: 'Lorsqu’un grand nombre d’annotations sera disponible, les chercheurs pourront télécharger 90% des données pour l’entraînement automatique (dataset).',
                item_2: 'Les chercheurs pourront utiliser ce dataset pour créer un modèle PyTorch dans leur propre environnement.',
                item_3: 'Les modèles résultants pourront être téléchargés et évalués avec les 10% de données restantes.',
                item_4: 'GeoImageNet offre aux chercheurs un serveur d’évaluation pour obtenir des indicateurs de rendement afin de collaborer et partager leurs travaux.',
            },
            mission: {
                what: '<b>Quoi</b> : GeoImageNet est une initiative de collaboration unique associant des chercheurs en télédétection, ' +
                    'des développeurs de plateformes de recherche numériques, des experts en intelligence artificielle et ' +
                    'des professionnels voués à l’ajout de valeur à l’imagerie par satellite.',
                how: '<b>Comment</b> : En facilitant la création et le téléchargement des annotations sur des images Pléiades (50 cm). ' +
                    'Les images utilisées pour créer cette base de données incluent plus de 10 000 km2 d\'images satellite Pléiades ' +
                    'couvrant les principales villes du Canada ainsi que divers autres environnements naturels et anthropiques ' +
                    '(forêts, milieux humides, sites miniers, zones agricoles, etc.). Ces annotations sont basées sur une taxonomie ' +
                    'contenant de nombreux objets (environ 180) et divers types d’occupation du sol (environ 50).',
                why: '<b>Pourquoi</b> : Afin de promouvoir la recherche en apprentissage profond sur les données ' +
                    'd’observation de la Terre (“Earth observation EO”) pour la détection, la segmentation et autres tâches ' +
                    'automatiques. Cela permettra aux chercheurs de diverses institutions de collaborer de manière plus structurée ' +
                    'et efficace à l’application de l’apprentissage profond en télédétection et de développer de nouveaux produits à ' +
                    'valeur ajoutée basés sur des images satellite THR. Cette synergie facilitera les progrès de la recherche, ' +
                    'tant dans les applications de télédétection que dans le développement d’algorithmes d’apprentissage.',
            },
            platform: {
                par_1: 'GeoImageNet est une plateforme de recherche collaborative pour les chercheurs de différents horizons ' +
                    'qui souhaitent développer des algorithmes innovants pour l’exploitation d’images satellitaires à ' +
                    'très haute résolution (THR) pour diverses applications.',
                section_1: {
                    header: 'Composantes technologiques :',
                    item_1: 'Plateforme <i>Open source</i> en Python/JavaScript.',
                    item_2: 'Compatibles avec les standards de l’OGC (WMS, WFS, WPS).',
                    item_3: 'GeoServer pour partager, traiter et éditer des données géospatiales.',
                    item_4: 'Birdhouse: Services de traitement Web “<i>Web Processing Services</i>”.',
                },
                section_2: {
                    header: 'Accès à la plateforme :',
                    par_1: 'Si vous souhaitez jeter un coup d’œil et n’avez pas d’identifiant, vous pouvez ' +
                        '<a href="/platform">consulter les annotations</a> sur une carte de base du Canada ' +
                        '(aucune image Pléiades n’est disponible sans identifiant).',
                    par_2: `Vous pouvez demander un identifiant à <a href="mailto:{{contact_email}}">{{contact_email}}</a> ou simplement vous connecter en utilisant le lien en haut de la page.`,

                },
                section_3: {
                    header: 'Veuillez noter :',
                    item_1: 'Pour l’instant, l’identifiant vous donnera accès à la version de démonstration et aucune annotation ne sera utilisée dans le jeu de données.',
                    item_2: 'Sur la version de démonstration, les annotations créées par les utilisateurs seront supprimées chaque semaine.',
                    item_3: 'Une fois sur la plateforme, si vous souhaitez voir les annotations existantes, sélectionnez ' +
                        'Objet ou Occupation du sol dans la Taxonomie, puis cliquez sur «icône représentant un œil» pour les afficher.',
                    item_4: 'La plateforme de production sera bientôt disponible.',
                },
            },
            taxonomy: {
                par_1: 'Occupation du sol :  48 classes',
                par_2: 'Objets: 178 classes',
                download: 'Télécharger le fichier JSON.',
                no_taxonomies: 'Il ne semble pas y avoir de taxonomies dans la base de données.'
            },
            publications: {
                presentation: 'Présentation',
                press: 'Communiqués de presse',
                abstract: 'Résumé',
                poster: 'Affiche',
                section_1: {
                    header: 'Présentations :',
                    item_1: '2019, GeoImageNet: a Collaborative Platform for Deep Learning Application to Very High ' +
                        'Resolution EO Images, Yacine Bouroudi, Claude Chapdelaine, Samuel Foucher, David Byrns, Mario Beaulieu, ' +
                        'Pierre-Luc St-Charles, Mickaël Germain, Étienne Lauzier-Hudon, Pierre Bugnet, Nouri Sabo and ' +
                        'Claire Gosselin, 40 ième Symposium canadien de télédétection, 4-6 juin 2019 ',
                    item_2: '2019, GeoImageNet: A Collaborative Platform for the Annotation of VHR Images, Claude Chapdelaine, ' +
                        'Samuel Foucher, Yacine Bouroubi, David Byrns, Mario Beaulieu, Pierre Bugnet, Pierre-Luc St-Charles, ' +
                        'Tom Landry, Mickaël Germain, Living Planet 2019, Milan, Italy. ',
                },
                section_2: {
                    header: 'Communiqués de presse :',
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
                section_3: {
                    header: 'Actes de conférence :',
                    item_1: 'Aucune publication n’est disponible présentement.',
                }
            },
            collaborators: {
                item_1: 'Yacine Bouroubi – Université de Sherbrooke',
                item_2: 'Samuel Foucher – CRIM',
                item_3: 'Jérôme Théau – Université de Sherbrooke',
                item_4: 'Nouri Nabo – RNCAN',
                item_5: 'François Cavayas – Université de Montréal',
                item_6: 'Pierre Gravel - RNCAN',
                item_7: 'Yves Moisan - RNCAN',
                item_8: 'Mathieu Turgeon-Pelchat - RNCAN',
                item_9: 'Daniel Pilon - RNCAN',
                item_10: 'David Lapointe - RNCAN',
            },
            team: {
                section_1: {
                    header: 'Université de Sherbrooke :',
                    item_1: 'Yacine Bouroubi',
                    item_2: 'Mickaël Germain',
                    item_3: 'Étienne Lauzier-Hudon',
                },
                section_2: {
                    header: 'CRIM :',
                    item_1: 'Samuel Foucher',
                    item_2: 'Claude Chapdelaine',
                    item_3: 'David Byrns',
                    item_4: 'Mario Beaulieu',
                    item_5: 'David Caron',
                    item_6: 'Francis Charette Migneault',
                    item_7: 'Pierre-Luc St-Charles',
                    item_8: 'Félix Gagnon-Grenier',
                },
                section_3: {
                    header: 'Effigis Géo-Solutions :',
                    item_1: 'Claire Gosselin',
                    item_2: 'Thuy Nguyen-Xuan',
                    item_3: 'Pierre Bugnet',
                },
                section_4: {
                    header: 'RNCan :',
                    item_1: 'Mathieu Turgeon-Pelchat',
                },
            },
        },
        taxonomy_viewer: {
            tooltip: {
                new: '{{count}} nouvelle annotation de classe {{taxonomy_class}}.',
                new_plural: '{{count}} nouvelles annotations de classe {{taxonomy_class}}.',
                released: '{{count}} annotation relâchée de classe {{taxonomy_class}}.',
                released_plural: '{{count}} annotations relâchées de classe {{taxonomy_class}}.',
                validated: '{{count}} annotation valide de classe {{taxonomy_class}}.',
                validated_plural: '{{count}} annotations valides de classe {{taxonomy_class}}.',
            },
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
