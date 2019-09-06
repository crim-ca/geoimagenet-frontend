// @flow strict
import React from 'react';
import {observer} from 'mobx-react';
import {withStyles} from "@material-ui/core";
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import {TFunction} from 'react-i18next';
import {GeoImageNetStore} from "../../../store/GeoImageNetStore";
import {StoreActions} from "../../../store/StoreActions";
import {withTranslation} from '../../../utils';
import type {AnnotationStatus} from "../../../Types";
import {FiltersPaper} from './FiltersPaper';

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

@observer
class Container extends React.Component<Props, State> {

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
                            <FiltersPaper state_proxy={state_proxy}
                                          toggle_ownership_filter={this.toggle_ownership_filter}
                                          toggle_status_filter={this.toggle_status_filter} />
                        </PopperMarginLessPopper>
                        : <div />
                    }
                </Fade>
            </>
        );
    }
}

const translated_filters = withTranslation()(Container);

export {translated_filters as Container};
