import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import crim from './img/logos/crim.png';
import canarie from './img/logos/canarie.gif';
import UdeS from './img/logos/UdeS.jpg';
import effigis from './img/logos/effigis.jpg';
import nrcan from './img/logos/nrcan.gif';

import './css/base.css';
import './css/style_web.css';

import * as Sentry from '@sentry/browser';
Sentry.init({
    dsn: 'https://e7309c463efe4d85abc7693a6334e8df@sentry.crim.ca/21'
});

class Presentation extends Component {
    render() {
        return (
            <div>
                <div className="logos">
                    <img alt="Logo CRIM" src={crim} />
                    <img alt="Logo Canarie" src={canarie} />
                    <img alt="Logo UdeS" src={UdeS} />
                    <img alt="Logo Effigis" src={effigis} />
                    <img alt="Logo NRCAN" src={nrcan} />
                </div>
                <div className="presentation">
                    <p>GeoImageNet sera élaborée par les équipes des professeurs Yacine Bouroubi et Samuel Foucher et
                        constituera une
                        évolution de la plateforme Analyse de puissance pour la visualisation des données
                        climatologiques (PAVICS)
                        développée par le CRIM.</p>

                    <p>« GeoImageNet inclura des outils d’annotation d’images satellites à très haute résolution
                        spatiale (THR). Le
                        projet a pour objectif de développer des algorithmes d’apprentissage profond pour la
                        cartographie de
                        l’occupation du sol et la détection des objets à partir des images satellites THR », souligne le
                        professeur
                        Bouroubi.</p>

                    <p>L’équipe du professeur en géomatique appliquée Yacine Bouroubi fait partie des vingt équipes
                        lauréates qui
                        recevront 214 000 $ dans le cadre du programme Logiciels de recherche de CANARIE, l’un des
                        piliers de
                        l’infrastructure numérique qui sous-tend la recherche, l’éducation et l’innovation au
                        Canada.</p>

                    <p>Grâce à ces fonds, l’équipe du professeur Bouroubi réalisera, en collaboration avec celle du
                        professeur Samuel
                        Foucher, chercheur principal au CRIM (Centre de recherche en informatique de Montréal), cette
                        plateforme de
                        recherche pour l’application des techniques d’intelligence artificielle à l’exploitation des
                        images satellites
                        de très haute résolution spatiale.</p>

                    <p>La plateforme GeoImageNet sera disponible pour d’autres équipes de recherche de partout au pays
                        œuvrant dans
                        différentes disciplines de la télédétection.</p>

                    <p>Le projet est mené par l’Université de Sherbrooke, en partenariat avec le CRIM et la compagnie
                        Effigis
                        Géo-Solutions. Le Centre canadien de cartographie et d’observation de la Terre (CCCOT) de
                        Ressources naturelles
                        Canada est aussi un partenaire important du projet. La plateforme GeoImageNet sera ouverte aux
                        différents
                        organismes canadiens (laboratoires universitaires, centre de recherche, industrie, etc.) qui
                        œuvrent dans le
                        domaine de la télédétection et de l’application de l’intelligence artificielle dans ce domaine.
                        Ces organismes
                        seront invités à utiliser les développements réalisés et à y contribuer.</p>

                    <p>Fondé en 1993, CANARIE est une société sans but lucratif principalement financée par le
                        gouvernement du
                        Canada.</p>

                    <p>
                        <a target="_blank"
                           href="https://www.latribune.ca/affaires/des-images-satellites-a-tres-haute-resolution-a-ludes-39c600cd8c87c862a133db22b75462c5">
                            Tiré d'un article de La Tribune
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

class Login extends Component {
    render() {
        return (
            <form method="post" action="/login">
                <label>Username<input type="text" name="user_name" /></label>
                <label>Password<input type="password" name="password" /></label>
                <button type="submit">Connect</button>
            </form>
        );
    }
}

class Menu extends Component {
    render() {
        return (
            <ul>
                <li><a href="/">Presentation</a></li>
                <li><a href="/benchmarks">Benchmarks</a></li>
                <li><a href="/platform">Platform</a></li>
            </ul>
        );
    }
}

class Layout extends Component {
    render() {
        return (
            <div className="layout">
                <div className="session paper">
                    <Login />
                </div>
                <div className="content paper">
                    <Presentation />
                </div>
                <div className="left paper">
                    <Menu />
                </div>
            </div>
        );
    }
}

addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Layout />,
        document.body
    );
});
