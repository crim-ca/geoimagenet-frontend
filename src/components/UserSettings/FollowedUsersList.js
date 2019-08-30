// @flow strict

import React from 'react';
import type {FollowedUser} from "../../Types";
import MaterialTable from "material-table";
import {TFunction} from 'react-i18next';
import {withTranslation} from '../../utils';
import {tableIcons} from "../../utils/react";

type Props = {
    followed_users: FollowedUser[],
    t: TFunction,
};

class FollowedUsersList extends React.Component<Props> {
    render() {
        const {t} = this.props;
        return (
            <div style={{maxWidth: '100%'}}>
                <MaterialTable
                    icons={tableIcons}
                    columns={[
                        {title: t('settings:id'), field: 'id'},
                        {title: t('settings:nickname'), field: 'nickname'},
                    ]}
                    data={this.props.followed_users}
                    title={t('settings:followed_users')} />
            </div>
        );
    }
}

const TranslatedComponent = withTranslation()(FollowedUsersList);
export {TranslatedComponent as FollowedUsersList};
