// @flow strict

import React from 'react';
import {UserInteractions} from "../../domain";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {withTranslation} from '../../utils';
import {TFunction} from 'react-i18next';

type Props = {
    user_interactions: UserInteractions,
    t: TFunction,
};
type State = {
    id: number | string,
    nickname: string,
};

class AddFollowedUserForm extends React.Component<Props, State> {

    state = {
        id: '',
        nickname: ''
    };

    save = () => {
        const {user_interactions} = this.props;
        user_interactions.save_followed_user(this.state);
    };

    change = (field: string) => (event: Event & { target: HTMLInputElement }) => {
        this.setState({[field]: event.target.value});
    };

    render() {
        const {t} = this.props;
        return (
            <>
                <Typography variant='h3'>{t('settings:add_followed_user')}</Typography>
                <form>
                    <TextField id='id' label='User id' value={this.state.id} onChange={this.change('id')} />
                    <button type="button" onClick={this.save}>Save</button>
                </form>
            </>
        );
    }
}

const TranslatedComponent = withTranslation()(AddFollowedUserForm);
export {TranslatedComponent as AddFollowedUserForm};
