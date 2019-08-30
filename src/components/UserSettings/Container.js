// @flow strict

import React from 'react';
import type {User} from "../../domain/entities";
import {UserInformation} from "./UserInformation";
import {AddFollowedUserForm} from "./AddFollowedUserForm";
import type {UserInteractions} from "../../domain";

type Props = {
    user: User,
    user_interactions: UserInteractions
};

export class Container extends React.Component<Props> {
    render() {
        const {user, user_interactions} = this.props;
        return (
            <>
                <UserInformation user={user} />
                <AddFollowedUserForm user_interactions={user_interactions}/>
            </>
        );
    }
}
