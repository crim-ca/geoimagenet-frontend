// @flow strict
import React from 'react';
import {observer} from 'mobx-react';
import {Typography, withStyles} from "@material-ui/core";
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import {TFunction} from 'react-i18next';
import typeof {GeoImageNetStore} from "../../store/GeoImageNetStore";
import typeof {StoreActions} from "../../store/StoreActions";
import {withTranslation} from '../../utils';

type Props = {
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    t: TFunction,
};
type State = {
    anchor: HTMLElement,
    open: boolean,
};

const PopperMarginLessPopper = withStyles({
    tooltip: {
        zIndex: 100,
    },
})(Popper);

const VeryVeryOnTheTopPaper = withStyles({
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
    };

    toggle_filter_container = (event) => {
        this.setState({open: !this.state.open, anchor: event.currentTarget});
    };

    toggle_annotation_status = (annotation_type: string) => (event) => {
        this.props.store_actions.toggle_annotation_status_visibility(annotation_type, event.target.checked);
    };

    render() {
        const {anchor} = this.state;
        const {state_proxy, t} = this.props;
        return (
            <>
                <Button onClick={this.toggle_filter_container}>click</Button>
                <PopperMarginLessPopper open={this.state.open}
                                        anchorEl={anchor}
                                        placement='bottom-end'>
                    <VeryVeryOnTheTopPaper>
                        <ul>
                            {
                                Object.keys(state_proxy.annotation_status_list).map((status_text: string, i: number) => {
                                    const status = state_proxy.annotation_status_list[status_text];
                                    return (
                                        <li key={i}>
                                            <input type='checkbox' checked={status.activated} onChange={this.toggle_annotation_status(status.text)} />
                                            <Typography variant='body2'>{t(`annotations:status.${status.text}`)}</Typography>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                        <ul>
                            <li>owner's filters</li>
                        </ul>
                    </VeryVeryOnTheTopPaper>
                </PopperMarginLessPopper>
            </>
        );
    }
}

const translated_filters = withTranslation()(UserFilters);

export {translated_filters as UserFilters};
