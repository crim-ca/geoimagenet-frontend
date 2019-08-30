// @flow strict

import React from 'react';
import type {User} from "../../domain/entities";
import {UserInformation} from "./UserInformation";
import {AddFollowedUserForm} from "./AddFollowedUserForm";
import {FollowedUsersList} from './FollowedUsersList';
import type {UserInteractions} from "../../domain";
import type {FollowedUser} from "../../Types";

type Props = {
    user: User,
    user_interactions: UserInteractions
};
type State = {
    followed_users: FollowedUser[],
};

export class Container extends React.Component<Props, State> {

    state = {
        followed_users: [],
    };

    componentDidMount(): void {
        this.props.user_interactions.get_followed_users_collection().then(
            followed_users => this.setState({followed_users: followed_users}),
        );
    }

    remove_followed_user = async (id: number): Promise<void> => {
        await this.props.user_interactions.remove_followed_user(id);
        const followed_users = await this.props.user_interactions.get_followed_users_collection();
        this.setState({followed_users: followed_users});
    };

    render() {
        const {user, user_interactions} = this.props;
        return (
            <>
                <UserInformation user={user} />
                <AddFollowedUserForm user_interactions={user_interactions} />
                <FollowedUsersList followed_users={this.state.followed_users} delete_user={this.remove_followed_user} />
            </>
        );
    }
}
