// @flow strict

import React from 'react';
import type {User} from "../../domain/entities";
import {UserInformation} from "./UserInformation";

type Props = {
    user: User,
};

export class Container extends React.Component<Props> {
    render() {
        const {user} = this.props;
        return (
            <UserInformation user={user} />
        );
    }
}
