// @flow strict

import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {TFunction} from 'react-i18next';

import {withTranslation} from "../../utils";

import type {AnnotationBrowserStore} from "../../store/AnnotationBrowserStore";

const style = (theme) => ({
    root: {
        margin: `${theme.values.gutterMedium} 0`,
    },
    buttons: {
        margin: `${theme.values.gutterMedium} 0`,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        '& > *:not(:first-child)': {
            marginLeft: theme.values.gutterMedium,
        }
    }
});
type Props = {
    annotation_browser_store: AnnotationBrowserStore,
    classes: {
        root: {},
        buttons: {},
    },
    t: TFunction,
};

class Paginator extends React.Component<Props> {
    render() {
        const {classes: {root, buttons}, annotation_browser_store, t} = this.props;
        const {page_number, total_pages} = annotation_browser_store;
        return (
            <div className={root}>
                <Typography variant='body2'>{annotation_browser_store.total_features} annotations</Typography>
                <Typography variant='body2'>{t('annotations:pagination.page_info', {
                    page_number: page_number,
                    total_pages: total_pages,
                })}</Typography>
                <div className={buttons}>
                    <Button
                        color='primary'
                        variant='contained'
                        disabled={page_number === 1}
                        onClick={annotation_browser_store.previous_page}>{t('annotations:pagination.previous')}</Button>
                    <Button
                        color='primary'
                        variant='contained'
                        disabled={page_number === total_pages}
                        onClick={annotation_browser_store.next_page}>{t('annotations:pagination.next')}</Button>
                </div>
            </div>
        );
    }
}

const styled_paginator = withStyles(style)(Paginator);
const translated_paginator = withTranslation()(styled_paginator);
export {translated_paginator as Paginator};
