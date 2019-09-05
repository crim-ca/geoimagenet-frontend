// @flow strict

import React from 'react';
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {withTranslation} from '../../utils';
import {TFunction} from 'react-i18next';
import type {FollowedUser} from "../../Types";

type Props = {
    save_user: (FollowedUser) => void,
    t: TFunction,
    classes: {
        form: {},
    }
};
type State = {
    id: $PropertyType<FollowedUser, 'id'>,
    nickname: $PropertyType<FollowedUser, 'nickname'>,
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

    save = async () => {
        const saved = await this.props.save_user(this.state);
        if (saved) {
            this.setState({
                id: '',
                nickname: '',
            });
        }
    };

    change = (field: string) => (event: Event) => {
        this.setState({[field]: (event.target: window.HTMLInputElement).value});
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
