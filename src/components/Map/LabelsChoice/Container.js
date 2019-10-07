// @flow strict

import React from 'react';
import Button from '@material-ui/core/Button';
import {observer} from 'mobx-react';

import {withTranslation} from '../../../utils';
import {TFunction} from 'react-i18next';
import {GeoImageNetStore} from "../../../store/GeoImageNetStore";

type Props = {
    t: TFunction,
    state_proxy: GeoImageNetStore,
};
type State = {};
@observer
class Container extends React.Component<Props, State> {

    receive_click_event = () => {
        this.props.state_proxy.toggle_annotator_identifiers();
    };

    render() {
        const {t, state_proxy} = this.props;
        return (
            <>
                <Button variant='contained'
                        color={state_proxy.show_annotators_identifiers ? 'primary' : 'secondary'}
                        onClick={this.receive_click_event}>{t(`annotations:annotators_identifiers`)}</Button>
            </>
        );
    }
}

const component = withTranslation()(Container);

export {
    component as Container,
};
