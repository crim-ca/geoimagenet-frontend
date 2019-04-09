import React, {Component} from 'react';
import {withStyles, Link, Typography, Paper} from '@material-ui/core';

import {Logos} from './Logos.js';
import {Login} from './Login.js';

const PaddedPaper = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            padding: values.gutterSmall,
        }
    };
})(Paper);

class Presentation extends Component {
    render() {
        return (
            <PaddedPaper>
                <Typography paragraph>GeoImageNet sera élaborée par les équipes des professeurs
                    Yacine Bouroubi et Samuel Foucher et
                    constituera une
                    évolution de la plateforme Analyse de puissance pour la visualisation des données
                    climatologiques (PAVICS)
                    développée par le CRIM.</Typography>

                <Typography paragraph>« GeoImageNet inclura des outils d’annotation d’images
                    satellites à très haute résolution
                    spatiale (THR). Le
                    projet a pour objectif de développer des algorithmes d’apprentissage profond pour la
                    cartographie de
                    l’occupation du sol et la détection des objets à partir des images satellites THR », souligne le
                    professeur
                    Bouroubi.</Typography>

                <Typography paragraph>L’équipe du professeur en géomatique appliquée Yacine Bouroubi
                    fait partie des vingt équipes
                    lauréates qui
                    recevront 214 000 $ dans le cadre du programme Logiciels de recherche de CANARIE, l’un des
                    piliers de
                    l’infrastructure numérique qui sous-tend la recherche, l’éducation et l’innovation au
                    Canada.</Typography>

                <Typography paragraph>Grâce à ces fonds, l’équipe du professeur Bouroubi réalisera,
                    en collaboration avec celle du
                    professeur Samuel
                    Foucher, chercheur principal au CRIM (Centre de recherche en informatique de Montréal), cette
                    plateforme de
                    recherche pour l’application des techniques d’intelligence artificielle à l’exploitation des
                    images satellites
                    de très haute résolution spatiale.</Typography>

                <Typography paragraph>La plateforme GeoImageNet sera disponible pour d’autres
                    équipes de recherche de partout au pays
                    œuvrant dans
                    différentes disciplines de la télédétection.</Typography>

                <Typography paragraph>Le projet est mené par l’Université de Sherbrooke, en
                    partenariat avec le CRIM et la compagnie
                    Effigis
                    Géo-Solutions. Le Centre canadien de cartographie et d’observation de la Terre (CCCOT) de
                    Ressources naturelles
                    Canada est aussi un partenaire important du projet. La plateforme GeoImageNet sera ouverte aux
                    différents
                    organismes canadiens (laboratoires universitaires, centre de recherche, industrie, etc.) qui
                    œuvrent dans le
                    domaine de la télédétection et de l’application de l’intelligence artificielle dans ce domaine.
                    Ces organismes
                    seront invités à utiliser les développements réalisés et à y contribuer.</Typography>

                <Typography paragraph>Fondé en 1993, CANARIE est une société sans but lucratif
                    principalement financée par le
                    gouvernement du
                    Canada.</Typography>

                <Typography paragraph>
                    <Link target='_blank'
                          rel='noopener noreferrer'
                          href='https://www.latribune.ca/affaires/des-images-satellites-a-tres-haute-resolution-a-ludes-39c600cd8c87c862a133db22b75462c5'>
                        Tiré d'un article de La Tribune
                    </Link>
                </Typography>
            </PaddedPaper>
        );
    }
}


export const PresentationContainer = withStyles(theme => {
    const {values} = theme;
    return {
        container: {
            height: '100%',
            padding: values.gutterSmall,
            display: 'grid',
            gridGap: values.gutterSmall,
            gridTemplateColumns: `1fr 200px 800px 200px 1fr`,
            gridTemplateRows: `min-content minmax(min-content, 1fr) min-content 200px`,
            background: 'url(/background.hack.jpg) no-repeat center center fixed',
            backgroundSize: 'cover',
        },
        logos: {
            gridColumn: '2/5',
            gridRow: '1/2',
        },
        presentation: {
            gridColumn: '3/4',
            gridRow: '3/4',
        },
        acceder: {
            gridColumn: '3/4',
            gridRow: '2/3',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
    };
})(props => {
    const {classes, user_interactions} = props;
    return (
        <div className={classes.container}>
            <div className={classes.logos}><Logos /></div>
            <div className={classes.acceder}>
                <PaddedPaper><Login user_interactions={user_interactions} /></PaddedPaper>
            </div>
            <div className={classes.presentation}><Presentation /></div>
        </div>
    );
});