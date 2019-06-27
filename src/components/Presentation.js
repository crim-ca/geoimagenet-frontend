import React, {useState} from 'react';
import {withStyles, Link, Typography, Paper, Select, MenuItem, Dialog} from '@material-ui/core';
import {useTranslation} from '../utils';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import {Logos} from './Logos.js';
import {Login} from './Login.js';
import {Benchmarks} from './Benchmarks';

import logo_gin from '../img/logos/logo_trans_GIN.png';

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
        <Paper>
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
        </Paper>
    );
}

const WhiteSelect = withStyles({
    root: {
        color: 'white',
    },
    icon: {
        color: 'white',
    },
})(Select);

function ChangeLanguage() {
    const {t, i18n} = useTranslation();
    const change_language = event => {
        const language = event.target.value;
        i18n.changeLanguage(language);
    };
    return(
        <WhiteSelect value={i18n.language} onChange={change_language}>
            <MenuItem value='fr'>{t('util:french')}</MenuItem>
            <MenuItem value='en'>{t('util:english')}</MenuItem>
        </WhiteSelect>
    );
}


export const PresentationContainer = withStyles(({values}) => ({
    container: {
        height: '100%',
        padding: values.gutterSmall,
        display: 'grid',
        gridGap: values.gutterSmall,
        gridTemplateColumns: '1fr 150px min-content min-content min-content min-content 150px 1fr',
        gridTemplateRows: 'min-content min-content 1fr min-content min-content min-content min-content 2fr min-content',
        background: 'url(/img/background.hack.jpg) no-repeat center center fixed',
        backgroundSize: 'cover',
    },
    mission: {
        gridColumn: '3/4',
        gridRow: '4/5',
    },
    logos: {
        gridColumn: '2/8',
        gridRow: '9/10',
    },
    publications: {
        gridColumn: '4/6',
        gridRow: '6/7',
    },
    benchmarks: {
        gridColumn: '6/7',
        gridRow: '6/8',
    },
    collaborators: {
        gridColumn: '3/6',
        gridRow: '7/8',
    },
    team: {
        gridColumn: '3/4',
        gridRow: '5/7',
    },
    taxonomy: {
        gridColumn: '5/7',
        gridRow: '4/6',
    },
    platform: {
        gridColumn: '4/5',
        gridRow: '4/6',
    },
    menuRight: {
        color: 'white',
        gridColumn: '1/-1',
        gridRow: '1/2',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        fontSize: '1.5em',
        lineHeight: '24px',
        '& a': {
            color: 'white',
            textDecoration: 'none',
        },
    },
    logoLeft: {
        padding: values.gutterMedium,
        gridRow: '1/3',
        gridColumn: '1/4',
        color: 'white',
    },
    input: {
        color: 'white',
    }
}))(({classes, user_interactions, client, contact_email}) => {

    const {t} = useTranslation();
    const [dialog_open, change_dialog_openness] = useState(false);
    const toggle_dialog = () => {
        change_dialog_openness(!dialog_open);
    };

    return (
        <div className={classes.container}>
            <div className={classes.menuRight}>
                <Typography style={{cursor: 'pointer', marginRight: '24px'}} variant='body1' onClick={toggle_dialog}>{t('login:login')}</Typography>
                <Dialog open={dialog_open} onClose={toggle_dialog}>
                    <Login user_interactions={user_interactions}/>
                </Dialog>
                <Typography style={{cursor: 'pointer', marginRight: '24px'}} variant='body1'>
                    <a href={`mailto:${contact_email}`}>{t('util:contact')}</a>
                </Typography>
                <ChangeLanguage/>
            </div>
            <div className={classes.logoLeft}><img alt='Logo GeoImageNet' src={logo_gin} /></div>
            <div className={classes.logos}><Logos/></div>
            <div className={classes.benchmarks}>
                <LessOpaquePaper title={t('title:benchmarks')} content={
                    <React.Fragment>
                        <Typography variant='body1' style={{marginBottom: '12px'}}>{t('intro:benchmarks')}</Typography>
                        <Benchmarks client={client} />
                    </React.Fragment>
                }/>
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
