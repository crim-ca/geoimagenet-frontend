// @flow strict
import React from 'react';
import {observer} from 'mobx-react';
import {Typography, withStyles} from "@material-ui/core";
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import {TFunction} from 'react-i18next';
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {StoreActions} from "../../store/StoreActions";
import {withTranslation} from '../../utils';
import type {AnnotationStatus} from "../../Types";

type Props = {
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    t: TFunction,
};
type State = {
    anchor: HTMLElement | null,
    open: boolean,
};

const PopperMarginLessPopper = withStyles({
    tooltip: {
        zIndex: 100,
    },
})(Popper);

const FiltersPaper = withStyles(theme => {
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
})(Paper);

@observer
class UserFilters extends React.Component<Props, State> {

    state = {
        open: false,
        anchor: null,
    };

    toggle_filter_container = (event) => {
        this.setState({open: !this.state.open, anchor: event.currentTarget});
    };

    toggle_status_filter = (annotation_status: AnnotationStatus) => (event) => {
        this.props.store_actions.toggle_annotation_status_visibility(annotation_status, event.target.checked);
    };

    toggle_ownership_filter = (ownership: string) => (event) => {
        this.props.store_actions.toggle_annotation_ownership_filter(ownership, event.target.checked);
    };

    render() {
        const {anchor} = this.state;
        const {state_proxy, t} = this.props;
        return (
            <>
                <Button variant='contained'
                        color='primary'
                        onClick={this.toggle_filter_container}>{t(`annotations:filters`)}</Button>
                <Fade in={this.state.open}>
                    {anchor !== null
                        ? <PopperMarginLessPopper open
                                                  disablePortal
                                                  style={{marginTop: '11px'}}
                                                  anchorEl={anchor}
                                                  placement='bottom-end'>
                            <FiltersPaper>
                                <ul>
                                    {
                                        Object.keys(state_proxy.annotation_status_filters).map((status_text: string, i: number) => {
                                            const status_filter = state_proxy.annotation_status_filters[status_text];
                                            return (
                                                <li key={i}>
                                                    <input type='checkbox'
                                                           checked={status_filter.activated}
                                                           onChange={this.toggle_status_filter(status_filter.text)} />
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
                                                           onChange={this.toggle_ownership_filter(ownership_filter.text)} />
                                                    <Typography
                                                        variant='body2'>{t(`annotations:ownership.${ownership_filter.text}`)}</Typography>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </FiltersPaper>
                        </PopperMarginLessPopper>
                        : <div />
                    }
                </Fade>
            </>
        );
    }
}

const translated_filters = withTranslation()(UserFilters);

export {translated_filters as UserFilters};
