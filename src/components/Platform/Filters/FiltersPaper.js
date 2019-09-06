// @flow strict

import React from 'react';

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import {GeoImageNetStore} from "../../../store/GeoImageNetStore";
import {TFunction} from 'react-i18next';
import {withTranslation} from '../../../utils';

const style = theme => {
    const {colors} = theme;
    return {
        root: {
            border: `3px solid ${colors.turquoise}`,
            margin: 0,
            padding: 0,
            '& ul': {
                padding: 0,
            },
            '& > ul:not(:first-child)': {
                borderTop: `3px solid ${colors.turquoise}`,
            },
            '& > ul > li': {
                padding: '0 6px 0 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            },
            '& input[type=checkbox]': {
                display: 'inline-block'
            }
        }
    };
};

type Props = {
    t: TFunction,
    state_proxy: GeoImageNetStore,
    classes: {
        root: {},
    },
    toggle_ownership_filter: () => void,
    toggle_status_filter: () => void,
};

class FiltersPaper extends React.Component<Props> {
    render() {
        const {t, state_proxy, classes, toggle_ownership_filter, toggle_status_filter} = this.props;
        return (
            <Paper className={classes.root}>
                <ul>
                    {
                        Object.keys(state_proxy.annotation_status_filters).map((status_text: string, i: number) => {
                            const status_filter = state_proxy.annotation_status_filters[status_text];
                            return (
                                <li key={i}>
                                    <input type='checkbox'
                                           checked={status_filter.activated}
                                           onChange={toggle_status_filter(status_filter.text)} />
                                    <Typography
                                        variant='body2'>{t(`annotations:status.${status_filter.text}`)}</Typography>
                                </li>
                            );
                        })
                    }
                </ul>
                <ul>
                    {
                        Object.keys(state_proxy.annotation_ownership_filters).map((ownership: string, i: number) => {
                            const ownership_filter = state_proxy.annotation_ownership_filters[ownership];
                            return (
                                <li key={i}>
                                    <input type='checkbox'
                                           checked={ownership_filter.activated}
                                           onChange={toggle_ownership_filter(ownership_filter.text)} />
                                    <Typography
                                        variant='body2'>{t(`annotations:ownership.${ownership_filter.text}`)}</Typography>
                                </li>
                            );
                        })
                    }
                </ul>
            </Paper>
        );
    }
}

const styled_paper = withStyles(style)(FiltersPaper);
const translated_paper = withTranslation()(styled_paper);

export {
    translated_paper as FiltersPaper
};
