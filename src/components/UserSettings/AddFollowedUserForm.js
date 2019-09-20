// @flow strict

import React from 'react';
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withTranslation} from '../../utils';
import {TFunction} from 'react-i18next';
import type {FollowedUser} from "../../Types";
import {NotificationManager} from "react-notifications";

type Props = {
    save_user: (FollowedUser) => void,
    id_already_exists: (number) => boolean,
    t: TFunction,
    classes: {
        form: {},
    }
};
type State = {
    id: $PropertyType<FollowedUser, 'id'>,
    nickname: $PropertyType<FollowedUser, 'nickname'>,
    valid: boolean,
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
        nickname: '',
        valid: false,
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

    form_data_is_valid = (id: number, nickname: string) => {
        if (isNaN(id)) {
            NotificationManager.warning(this.props.t('settings:error.id_must_be_integer'));
            return false;
        }
        if (this.props.id_already_exists(id)) {
            NotificationManager.warning(this.props.t('settings:error.id_must_be_unique'));
            return false;
        }
        return id > 0 && nickname.length > 0;
    };

    change = (field: string) => (event: Event) => {
        this.setState({[field]: (event.target: window.HTMLInputElement).value}, () => {
            const valid = this.form_data_is_valid(parseInt(this.state.id), this.state.nickname);
            this.setState({valid: valid});
        });
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
                <Button variant='contained'
                        color='primary'
                        onClick={this.save}
                        disabled={!this.state.valid}>{t('settings:save')}</Button>
            </form>
        );
    }
}

const StyledComponent = withStyles(styles)(AddFollowedUserForm);
const TranslatedComponent = withTranslation()(StyledComponent);
export {TranslatedComponent as AddFollowedUserForm};
