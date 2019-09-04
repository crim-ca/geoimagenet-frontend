// @flow strict

import React from 'react';
import type {FollowedUser} from "../../Types";
import MaterialTable from "material-table";
import {TFunction} from 'react-i18next';
import {withTranslation} from '../../utils';
import {tableIcons} from "../../utils/react";
import ClearIcon from '@material-ui/icons/Clear';

type Props = {
    followed_users: FollowedUser[],
    delete_user: (number) => void,
    t: TFunction,
};

const clear_icon = () => <ClearIcon />;

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
                    actions={[
                        {
                            icon: clear_icon,
                            tooltip: t('settings:delete_user'),
                            onClick: (event, rowData) => this.props.delete_user(rowData.id),
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    title={t('settings:followed_users')} />
            </div>
        );
    }
}

const TranslatedComponent = withTranslation()(FollowedUsersList);
export {TranslatedComponent as FollowedUsersList};
