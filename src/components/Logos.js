import React, {Component} from 'react';
import {withStyles, Paper, Typography} from '@material-ui/core';

import crim from '../img/logos/crim.png';
import canarie from '../img/logos/canarie.gif';
import UdeS from '../img/logos/UdeS.jpg';
import effigis from '../img/logos/effigis.jpg';
import nrcan from '../img/logos/nrcan.gif';

const LogosContainer = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: values.gutterSmall,
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

export class Logos extends Component {
    render() {
        return (
            <LogosContainer>
                    <GeoImageNetHeader variant='h3'>GeoImageNet</GeoImageNetHeader>
                    <img alt='Logo CRIM' src={crim} />
                    <img alt='Logo Canarie' src={canarie} />
                    <img alt='Logo UdeS' src={UdeS} />
                    <img alt='Logo Effigis' src={effigis} />
                    <img alt='Logo NRCAN' src={nrcan} />
                </LogosContainer>
        );
    }
}
