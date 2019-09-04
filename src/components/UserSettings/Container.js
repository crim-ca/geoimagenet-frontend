// @flow strict

import React from 'react';
import type {User} from "../../domain/entities";
import {UserInformation} from "./UserInformation";
import {AddFollowedUserForm} from "./AddFollowedUserForm";
import {FollowedUsersList} from './FollowedUsersList';
import type {UserInteractions} from "../../domain";
import type {FollowedUser} from "../../Types";
import {NotificationManager} from "react-notifications";
import {captureException} from "@sentry/browser";
import {TFunction} from 'react-i18next';
import {withTranslation} from '../../utils';

type Props = {
    user: User,
    user_interactions: UserInteractions,
    t: TFunction,
};
type State = {
    followed_users: FollowedUser[],
};

class Container extends React.Component<Props, State> {

    state = {
        followed_users: [],
    };

    componentDidMount(): void {
        this.props.user_interactions.get_followed_users_collection().then(
            followed_users => this.setState({followed_users: followed_users}),
        );
    }

    save_followed_user_callback = (form_data: FollowedUser[]): Promise<boolean> => {
        const {t, user_interactions} = this.props;
        return new Promise((resolve) => {
            user_interactions.save_followed_user(form_data).then(
            async () => {
                NotificationManager.success(t('settings.save_followed_users_success'));
                const followed_users = this.state.followed_users.concat(form_data);
                this.setState({followed_users: followed_users});
                resolve(true);
            },
            error => {
                captureException(error);
                NotificationManager.error(t('settings.save_followed_users_failure'));
                /**
                 * We use resolve in the error handler (instead of reject) because the caller, AddFollowedUserForm, does not care about error handling.
                 * It only wants to know whether or not to reload its form.
                 * Maybe even the form state should come from the container, but that'll be left for you.
                 */
                resolve(false);
            },
        );
        });
    };

    remove_followed_user = async (id: number): Promise<void> => {
        await this.props.user_interactions.remove_followed_user(id);
        const followed_users = await this.props.user_interactions.get_followed_users_collection();
        this.setState({followed_users: followed_users});
    };

    render() {
        const {user} = this.props;
        return (
            <>
                <UserInformation user={user} />
                <AddFollowedUserForm save_user={this.save_followed_user_callback} />
                <FollowedUsersList followed_users={this.state.followed_users} delete_user={this.remove_followed_user} />
            </>
        );
    }
}

const translated_container = withTranslation()(Container);

export {translated_container as Container};
