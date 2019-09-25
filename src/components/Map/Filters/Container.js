// @flow strict
import React from 'react';
import {observer} from 'mobx-react';
import Button from '@material-ui/core/Button';
import {TFunction} from 'react-i18next';
import {GeoImageNetStore} from "../../../store/GeoImageNetStore";
import {StoreActions} from "../../../store/StoreActions";
import {withTranslation} from '../../../utils';
import type {AnnotationStatus} from "../../../Types";
import {FiltersPaper} from '../FiltersPaper';
import {FadingDialog} from "../FadingDialog";
import {CheckboxLineInput} from "./CheckboxLineInput";

type Props = {
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    t: TFunction,
};
type State = {
    anchor: HTMLElement | null,
    open: boolean,
};

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
                <FadingDialog open={this.state.open} anchor={anchor}>
                    <FiltersPaper>
                        <ul>
                            {
                                Object.keys(state_proxy.annotation_status_filters).map((status_text: string, i: number) => {
                                    const status_filter = state_proxy.annotation_status_filters[status_text];
                                    const unique_input_id = `status_${status_text}`;
                                    return (
                                        <li key={i}>
                                            <CheckboxLineInput unique_id={unique_input_id}
                                                               checked={status_filter.activated}
                                                               change_handler={this.toggle_status_filter(status_filter.text)}
                                                               label={t(`status:plural.${status_filter.text}`)} />
                                        </li>
                                    );
                                })
                            }
                        </ul>
                        <ul>
                            {
                                Object.keys(state_proxy.annotation_ownership_filters).map((ownership: string, i: number) => {
                                    const ownership_filter = state_proxy.annotation_ownership_filters[ownership];
                                    const unique_input_id = `ownership_${ownership}`;
                                    return (
                                        <li key={i}>
                                            <CheckboxLineInput unique_id={unique_input_id}
                                                               checked={ownership_filter.activated}
                                                               change_handler={this.toggle_ownership_filter(ownership_filter.text)}
                                                               label={t(`annotations:ownership.${ownership_filter.text}`)} />
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </FiltersPaper>
                </FadingDialog>
            </>
        );
    }
}

const translated_filters = withTranslation()(Container);

export {translated_filters as Container};
