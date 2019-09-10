// @flow strict

import React from 'react';
import Button from '@material-ui/core/Button';
import {observer} from 'mobx-react';

import {withTranslation} from '../../../utils';
import {TFunction} from 'react-i18next';
import {FiltersPaper} from "../FiltersPaper";
import {FadingDialog} from "../FadingDialog";

type Props = {
    t: TFunction,
};
type State = {
    anchor: HTMLElement | null,
    open: boolean,
};
@observer
class Container extends React.Component<Props, State> {
    state = {
        anchor: null,
        open: false,
    };

    render() {
        const {t} = this.props;
        const {anchor} = this.state;
        return (
            <>
                <Button variant='contained'
                        color='primary'
                        onClick={this.toggle_filter_container}>{t(`annotations:labels`)}</Button>
                <FadingDialog open={this.state.open} anchor={anchor}>
                    <FiltersPaper>
                        <ul>
                            <li>ite</li>
                        </ul>
                    </FiltersPaper>
                </FadingDialog>
            </>
        );
    }
}

const translated_container = withTranslation()(Container);

export {
    translated_container as Container,
};
