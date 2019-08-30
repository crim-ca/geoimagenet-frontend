// @flow strict

import React from 'react';
import {UserInteractions} from "../../domain";
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {withTranslation} from '../../utils';
import {TFunction} from 'react-i18next';

type Props = {
    user_interactions: UserInteractions,
    t: TFunction,
    classes: {
        form: {},
    }
};
type State = {
    id: number | string,
    nickname: string,
};

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'row',
        '& > *': {
            margin: '5px',
        }
    }
};

class AddFollowedUserForm extends React.Component<Props, State> {

    state = {
        id: '',
        nickname: ''
    };

    save = () => {
        const {user_interactions} = this.props;
        user_interactions.save_followed_user([this.state]);
    };

    change = (field: string) => (event: Event & { target: HTMLInputElement }) => {
        this.setState({[field]: event.target.value});
    };

    render() {
        const {t, classes} = this.props;
        return (
            <form className={classes.form}>
                <TextField id='id'
                           label={t('settings:followed_user_id')}
                           value={this.state.id}
                           onChange={this.change('id')} />
                <TextField id='nickname'
                           label={t('settings:followed_user_nickname')}
                           value={this.state.nickname}
                           onChange={this.change('nickname')} />
                <button type="button" onClick={this.save}>{t('settings:save')}</button>
            </form>
        );
    }
}

const StyledComponent = withStyles(styles)(AddFollowedUserForm);
const TranslatedComponent = withTranslation()(StyledComponent);
export {TranslatedComponent as AddFollowedUserForm};
