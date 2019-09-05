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

const FiltersPaper = withStyles({
    root: {
        border: '3px solid rgba(2,205,234,1)',
        margin: 0,
        padding: 0,
        '& ul': {
            padding: 0,
        },
        '& > ul:not(:first-child)': {
            borderTop: '3px solid rgba(2,205,234,1)',
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

    toggle_annotation_status = (annotation_status: AnnotationStatus) => (event) => {
        this.props.store_actions.toggle_annotation_status_visibility(annotation_status, event.target.checked);
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
                    <PopperMarginLessPopper open={true}
                                            style={{marginRight: '-17px', marginTop: '11px'}}
                                            anchorEl={anchor}
                                            placement='bottom-end'>
                        <FiltersPaper>
                            <ul>
                                {
                                    Object.keys(state_proxy.annotation_status_list).map((status_text: string, i: number) => {
                                        const status = state_proxy.annotation_status_list[status_text];
                                        return (
                                            <li key={i}>
                                                <input type='checkbox'
                                                       checked={status.activated}
                                                       onChange={this.toggle_annotation_status(status.text)} />
                                                <Typography
                                                    variant='body2'>{t(`annotations:status.${status.text}`)}</Typography>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            <ul>
                                <li>
                                    <input type='checkbox'
                                           checked={true}
                                           onChange={() => console.log('changed first')} />
                                    <Typography variant='body2'>{t(`annotations:ownership.others`)}</Typography>
                                </li>
                                <li>
                                    <input type='checkbox'
                                           checked={true}
                                           onChange={() => console.log('changed first')} />
                                    <Typography variant='body2'>{t(`annotations:ownership.mine`)}</Typography>
                                </li>
                                <li>
                                    <input type='checkbox'
                                           checked={true}
                                           onChange={() => console.log('changed first')} />
                                    <Typography variant='body2'>{t(`annotations:ownership.followed_users`)}</Typography>
                                </li>
                            </ul>
                        </FiltersPaper>
                    </PopperMarginLessPopper>
                </Fade>
            </>
        );
    }
}

const translated_filters = withTranslation()(UserFilters);

export {translated_filters as UserFilters};
