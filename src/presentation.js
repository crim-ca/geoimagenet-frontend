import React from 'react';
import ReactDOM from 'react-dom';
import {withStyles, Link} from '@material-ui/core';

import './css/base.css';
import './img/icons/favicon.ico';
import './img/background.hack.jpg';

import * as Sentry from '@sentry/browser';
import {ThemedComponent} from './utils/react.js';
import {Logos} from './components/Logos.js';
import {Presentation} from './components/Presentation.js';

Sentry.init({
    dsn: 'https://e7309c463efe4d85abc7693a6334e8df@sentry.crim.ca/21',
});

const PresentationContainer = withStyles(theme => {
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
        }
    };
})(props => {
    const {classes} = props;
    return (
        <div className={classes.container}>
            <div className={classes.logos}><Logos /></div>
            <div><Link href='/platform'>Accéder à la plateforme</Link></div>
            <div className={classes.presentation}><Presentation /></div>
        </div>
    );
});

addEventListener('DOMContentLoaded', () => {

    ReactDOM.render(
        <ThemedComponent>
            <PresentationContainer />
        </ThemedComponent>,
        document.body
    );
});
