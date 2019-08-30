// @flow strict

import React from 'react';
import {User} from "../../domain/entities";

type Props = {
    user: User,
};

export class UserInformation extends React.Component<Props> {
    render() {
        const {user} = this.props;
        return (
            <table>
                <tr>
                    <th>Username:</th>
                    <td>{user.user_name}</td>
                </tr>
                <tr>
                    <th>Password:</th>
                    <td>********</td>
                </tr>
                <tr>
                    <th>Unique id:</th>
                    <td>{user.id}</td>
                </tr>
            </table>
        );
    }
}
