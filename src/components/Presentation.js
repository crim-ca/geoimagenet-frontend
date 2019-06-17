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
            background: 'url(/img/background.hack.jpg) no-repeat center center fixed',
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
            <div className={classes.logos}><Logos/></div>
            <div className={classes.acceder}>
                <PaddedPaper><Login user_interactions={user_interactions}/></PaddedPaper>
            </div>
            <div className={classes.presentation}><Presentation/></div>
        </div>
    );
});
