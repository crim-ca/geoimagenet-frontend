import React, {useState} from 'react';
import {withStyles, Link, Typography, Paper} from '@material-ui/core';
import {useTranslation} from '../utils';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

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

const Panel = withStyles(({values, colors}) => ({
    opened: {
        display: 'grid',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        gridTemplateColumns: '1fr minmax(min-content, 56em) 1fr',
        gridTemplateRows: '1fr min-content 2fr',
    },
    panel: {
        color: colors.barelyWhite,
        backgroundColor: 'black',
        padding: values.gutterMedium,
        zIndex: '100',
        opacity: '1',
        gridColumn: '2/3',
        gridRow: '2/3',
        border: `2px solid ${colors.barelyWhite}`,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: values.gutterSmall,
        alignItems: 'baseline',
        justifyContent: 'space-between',
    }
}))(({classes, children, callback, title}) => {
    return (
        <div className={classes.opened}>
            <Paper className={classes.panel}>
                <div className={classes.header}>
                    <Typography variant='h3'>{title}</Typography>
                    <FontAwesomeIcon
                        style={{cursor: 'pointer', marginLeft: '12px'}}
                        icon={faTimes}
                        className='fa-2x'
                        onClick={callback}/>
                </div>
                {children}
            </Paper>
        </div>
    );
});

const LessOpaquePaper = withStyles(({values}) =>({
    root: {
        height: '100%',
    },
    paper: {
        padding: values.gutterMedium,
        height: '100%',
        opacity: '0.7',
        '&:hover': {
            opacity: '1',
            cursor: 'pointer',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))(({classes, title, content}) => {
    const [opened, setOpened] = useState(false);
    const handler = () => setOpened(!opened);
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} onClick={handler}><Typography variant='h4'>{title}</Typography></Paper>
            {opened ? <Panel callback={handler} title={title}>{content}</Panel> : null}
        </div>
    );
});

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
        gridTemplateColumns: '1fr min-content min-content min-content min-content 1fr',
        gridTemplateRows: 'min-content min-content 1fr min-content min-content min-content min-content 2fr min-content',
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
            <div className={classes.benchmarks}>
                <LessOpaquePaper title={t('title:benchmarks')} content={t('intro:benchmarks')}/>
            </div>
            <div className={classes.mission}>
                <LessOpaquePaper title={t('title:mission')} content={t('intro:mission')}/>
            </div>
            <div className={classes.team}>
                <LessOpaquePaper title={t('title:team')} content={t('intro:team')}/>
            </div>
            <div className={classes.platform}>
                <LessOpaquePaper title={t('title:platform')} content={t('intro:platform')}/>
            </div>
            <div className={classes.publications}>
                <LessOpaquePaper title={t('title:publications')} content={t('intro:publications')}/>
            </div>
            <div className={classes.collaborators}>
                <LessOpaquePaper title={t('title:collaborators')} content={t('intro:collaborators')}/>
            </div>
            <div className={classes.taxonomy}>
                <LessOpaquePaper title={t('title:taxonomy')} content={t('intro:taxonomy')}/>
            </div>
        </div>
    );

});
