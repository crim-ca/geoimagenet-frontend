import React from 'react';
import {withStyles, Paper, Typography, Select, MenuItem} from '@material-ui/core';
import {useTranslation} from '../utils';

import crim from '../img/logos/crim.png';
import canarie from '../img/logos/canarie.gif';
import UdeS from '../img/logos/UdeS.jpg';
import effigis from '../img/logos/effigis.jpg';
import nrcan from '../img/logos/nrcan.gif';

const LogosContainer = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            padding: values.gutterSmall,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& img': {
                padding: `0 0 0 ${values.gutterSmall}`
            }
        },
    };
})(Paper);
const GeoImageNetHeader = withStyles({
    root: {
        paddingRight: '24px',
    }
})(Typography);

function ChangeLanguage() {
    const {t, i18n} = useTranslation();
    const change_language = event => {
        const language = event.target.value;
        i18n.changeLanguage(language);
    };
    return(
        <Select value={i18n.language} onChange={change_language}>
            <MenuItem value='fr'>{t('util:french')}</MenuItem>
            <MenuItem value='en'>{t('util:english')}</MenuItem>
        </Select>
    );
}

export function Logos() {
    return (
        <LogosContainer>
            <GeoImageNetHeader variant='h3'>GeoImageNet</GeoImageNetHeader>
            <img alt='Logo CRIM' src={crim}/>
            <img alt='Logo Canarie' src={canarie}/>
            <img alt='Logo UdeS' src={UdeS}/>
            <img alt='Logo Effigis' src={effigis}/>
            <img alt='Logo NRCAN' src={nrcan}/>
            <ChangeLanguage/>
        </LogosContainer>
    );
}
