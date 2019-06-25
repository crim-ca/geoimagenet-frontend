import React from 'react';
import {withStyles, Link, Typography, Paper} from '@material-ui/core';
import {useTranslation} from '../utils';

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

const LessOpaquePaper = withStyles({
    root: {
        opacity: '0.7',
    }
})(Paper);
function Presentation() {
    const {t} = useTranslation();

    return (
        <PaddedPaper>
            <Typography paragraph>{t('par-1')}</Typography>
            <Typography paragraph>{t('par-2')}</Typography>
            <Typography paragraph>{t('par-3')}</Typography>
            <Typography paragraph>{t('par-4')}</Typography>
            <Typography paragraph>{t('par-5')}</Typography>
            <Typography paragraph>{t('par-6')}</Typography>
            <Typography paragraph>{t('par-7')}</Typography>

            <Typography paragraph>
                <Link target='_blank'
                      rel='noopener noreferrer'
                      href={t('https://www.latribune.ca/affaires/des-images-satellites-a-tres-haute-resolution-a-ludes-39c600cd8c87c862a133db22b75462c5')}>
                    {t("Tiré d'un article de La Tribune")}
                </Link>
            </Typography>
        </PaddedPaper>
    );
}


export const PresentationContainer = withStyles(({values}) => ({
    container: {
        height: '100%',
        padding: values.gutterSmall,
        display: 'grid',
        gridGap: values.gutterSmall,
        gridTemplateColumns: '1fr min-content min-content 200px min-content 1fr',
        gridTemplateRows: 'min-content min-content 1fr min-content 100px min-content min-content 2fr min-content',
        background: 'url(/img/background.hack.jpg) no-repeat center center fixed',
        backgroundSize: 'cover',
    },
    mission: {
        gridColumn: '2/3',
        gridRow: '4/5',
    },
    logos: {
        gridColumn: '2/6',
        gridRow: '9/10',
    },
    publications: {
        gridColumn: '3/5',
        gridRow: '6/7',
    },
    benchmarks: {
        gridColumn: '5/6',
        gridRow: '6/8',
    },
    collaborators: {
        gridColumn: '2/5',
        gridRow: '7/8',
    },
    team: {
        gridColumn: '2/3',
        gridRow: '5/7',
    },
    taxonomy: {
        gridColumn: '4/6',
        gridRow: '4/6',
    },
    platform: {
        gridColumn: '3/4',
        gridRow: '4/6',
    },
    acceder: {
        gridColumn: '3/4',
        gridRow: '2/3',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
}))(({classes, user_interactions}) => {

    const {t} = useTranslation();

    return (
        <div className={classes.container}>
            <div className={classes.logos}><Logos/></div>
            <div className={classes.acceder}>
                <PaddedPaper><Login user_interactions={user_interactions}/></PaddedPaper>
            </div>
            <LessOpaquePaper className={classes.benchmarks}>{t('intro:benchmarks')}</LessOpaquePaper>
            <LessOpaquePaper className={classes.mission}>{t('intro:mission')}</LessOpaquePaper>
            <LessOpaquePaper className={classes.team}>{t('intro:team')}</LessOpaquePaper>
            <LessOpaquePaper className={classes.platform}>{t('intro:platform')}</LessOpaquePaper>
            <LessOpaquePaper className={classes.publications}>{t('intro:publications')}</LessOpaquePaper>
            <LessOpaquePaper className={classes.collaborators}>{t('intro:collaborators')}</LessOpaquePaper>
            <LessOpaquePaper className={classes.taxonomy}>{t('intro:taxonomy')}</LessOpaquePaper>
        </div>
    );

});
