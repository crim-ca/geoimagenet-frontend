import React, {useState} from 'react';
import {withStyles, Link, Typography, Paper, Select, MenuItem, Dialog} from '@material-ui/core';
import {useTranslation} from '../utils';

import {Logos} from './Logos.js';
import {Login} from './Login.js';
import {Benchmarks} from './Benchmarks';

import logo_gin from '../img/logos/logo_trans_GIN.png';

const DarkDialog = withStyles(({colors, values}) => ({
    paper: {
        padding: values.gutterMedium,
        color: colors.barelyWhite,
        backgroundColor: 'black',
        border: `2px solid ${colors.barelyWhite}`,
        '& li': {
            margin: values.gutterSmall
        },
    }
}))(Dialog);

const LessOpaquePaper = withStyles(({values}) => ({
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
    const close = () => {
        setOpened(false);
    };
    const open = () => {
        setOpened(true);
    };
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} onClick={open}><Typography variant='h3'>{title}</Typography></Paper>
            <DarkDialog
                maxWidth='xl'
                open={opened}
                onClose={close}>
                <Typography variant='h4'>{title}</Typography>
                {content}
            </DarkDialog>
        </div>
    );
});

const WhiteSelect = withStyles({
    root: {
        color: 'white',
    },
    icon: {
        color: 'white',
    },
})(Select);

function TaxonomyPanel() {
    const {t} = useTranslation();
    return (
        <React.Fragment>
            {t('intro:taxonomy')}
            <Typography variant='body2'>
                <a download href={`${GEOIMAGENET_API_URL}/taxonomy_classes`}>{t('intro:taxonomy.download')}</a>
            </Typography>
        </React.Fragment>
    );
}

function BenchmarksPanel() {
    const {t} = useTranslation();
    return (
        <React.Fragment>
            <ul>
                <li>{t('intro:benchmarks.item_1')}</li>
                <li>{t('intro:benchmarks.item_2')}</li>
                <li>{t('intro:benchmarks.item_3')}</li>
                <li>{t('intro:benchmarks.item_4')}</li>
            </ul>
        </React.Fragment>
    );
}

function PlatformPanel() {
    const {t} = useTranslation();
    return (
        <React.Fragment>
            <Typography variant='body1'>{t('intro:platform.par_1')}</Typography>
            <Typography variant='h6'>{t('intro:platform.list_1.header')}</Typography>
            <ul>
                <li>{t('intro:platform.list_1.item_1')}</li>
                <li>{t('intro:platform.list_1.item_2')}</li>
                <li>{t('intro:platform.list_1.item_3')}</li>
                <li>{t('intro:platform.list_1.item_4')}</li>
            </ul>
            <Typography variant='h6'>{t('intro:platform.list_2.header')}</Typography>
            <ul>
                <li dangerouslySetInnerHTML={{__html: t('intro:platform.list_2.item_1')}}/>
                <li>{t('intro:platform.list_2.item_2')}</li>
                <li>{t('intro:platform.list_2.item_3')}</li>
            </ul>
        </React.Fragment>
    );
}

function ChangeLanguage() {
    const {t, i18n} = useTranslation();
    const change_language = event => {
        const language = event.target.value;
        i18n.changeLanguage(language);
    };
    return (
        <WhiteSelect value={i18n.language} onChange={change_language}>
            <MenuItem value='fr'>{t('util:french')}</MenuItem>
            <MenuItem value='en'>{t('util:english')}</MenuItem>
        </WhiteSelect>
    );
}

function Publications() {
    const {t} = useTranslation();
    return (
        <React.Fragment>
            <Typography variant='h5'>{t('intro:publications.presentation')}</Typography>
            <ul>
                <li>
                    {t('intro:publications.presentations.item_1')}
                    (<Link
                        rel='noopener noreferrer'
                        href='/pdf/CSRS2019_abstract_en.pdf'
                        target='_blank'>{t('intro:publications.abstract')}</Link>)
                    (<Link
                        rel='noopener noreferrer'
                        href='/pdf/GeoImageNet_in_40th_Canadian_Symposium_on_Remote_Sensing-05_June_2019.pdf'
                        target='_blank'>{t('intro:publications.presentation')}</Link>)
                </li>
                <li>
                    {t('intro:publications.presentations.item_2')}
                    (<Link
                        rel='noopener noreferrer'
                        href='/pdf/LivingPlanet_GeoImageNet_2019_poster.pdf'
                        target='_blank'>{t('intro:publications.poster')}</Link>)
                </li>
            </ul>
            <Typography variant='h5'>{t('intro:publications.press')}</Typography>
            <ul>
                <li>
                    <span dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_1.intro')}}/>
                    <Link
                        dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_1.link_text')}}
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.usherbrooke.ca/actualites/nouvelles/nouvelles-details/article/38764/'/>
                </li>
                <li>
                    <span dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_2.intro')}}/>
                    <Link
                        dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_2.link_text')}}
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.crim.ca/fr/nouvelles/geoimagenet-l-intelligence-artificielle-appliquee-aux-images-satellites'/>
                </li>
                <li>
                    <span dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_3.intro')}}/>
                    <Link
                        dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_3.link_text')}}
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.effigis.com/fr/financement-federal-pour-la-r-et-d-dune-application-dinterpretation-automatisee-dimages-satellite-par-intelligence-artificielle/'/>
                </li>
                <li>
                    <span dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_4.intro')}}/>
                    <Link
                        dangerouslySetInnerHTML={{__html: t('intro:publications.press_releases.item_4.link_text')}}
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.canarie.ca/fr/canarie-distribue-44-millions-de-dollars-a-vingt-equipes-de-recherche-pour-quelles-perfectionnent-leurs-logiciels-afin-dameliorer-les-vaccins-de-surveiller-le-changement-climatique/'/>
                </li>
            </ul>
        </React.Fragment>
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
                <Typography style={{cursor: 'pointer', marginRight: '24px'}} variant='body1'
                            onClick={toggle_dialog}>{t('login:login')}</Typography>
                <Dialog open={dialog_open} onClose={toggle_dialog}>
                    <Login user_interactions={user_interactions}/>
                </Dialog>
                <Typography style={{cursor: 'pointer', marginRight: '24px'}} variant='body1'>
                    <a href={`mailto:${contact_email}`}>{t('util:contact')}</a>
                </Typography>
                <ChangeLanguage/>
            </div>
            <div className={classes.logoLeft}><img alt='Logo GeoImageNet' src={logo_gin}/></div>
            <div className={classes.logos}><Logos/></div>
            <div className={classes.benchmarks}>
                <LessOpaquePaper title={t('title:benchmarks')} content={
                    <React.Fragment>
                        <BenchmarksPanel/>
                        <Benchmarks client={client}/>
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
                <LessOpaquePaper title={t('title:platform')} content={<PlatformPanel/>}/>
            </div>
            <div className={classes.publications}>
                <LessOpaquePaper title={t('title:publications')} content={<Publications/>}/>
            </div>
            <div className={classes.collaborators}>
                <LessOpaquePaper title={t('title:collaborators')} content={t('intro:collaborators')}/>
            </div>
            <div className={classes.taxonomy}>
                <LessOpaquePaper title={t('title:taxonomy')} content={<TaxonomyPanel/>}/>
            </div>
        </div>
    );

});
