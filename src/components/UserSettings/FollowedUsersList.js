// @flow strict

import React from 'react';
import MaterialTable from 'material-table';
import { TFunction } from 'react-i18next';
import ClearIcon from '@material-ui/icons/Clear';
import { observer } from 'mobx-react';
import { withTranslation } from '../../utils';
import { tableIcons } from '../../utils/react';
import type { FollowedUser } from '../../Types';

type Props = {
  followed_users: FollowedUser[],
  delete_user: (number) => void,
  t: TFunction,
};

const clear_icon = () => <ClearIcon />;

@observer
class FollowedUsersList extends React.Component<Props> {
  render() {
    const { t, followed_users } = this.props;
    /**
     * followed users is an mobx managed collection. since we are in strict mode, mobx prevents modifications to the value
     * however, it seems that material-table adds meta data to the data we pass to it. so we make a clone and pass that to the table
     */
    const followed_users_clone = followed_users.map((user) => ({ ...user }));
    return (
      <div style={{ maxWidth: '100%' }}>
        <MaterialTable
          icons={tableIcons}
          columns={[
            {
              title: t('settings:id'),
              field: 'id',
            },
            {
              title: t('settings:nickname'),
              field: 'nickname',
            },
          ]}
          data={followed_users_clone}
          actions={[
            {
              icon: clear_icon,
              tooltip: t('settings:delete_user'),
              onClick: (event, rowData) => this.props.delete_user(rowData.id),
            },
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
          title={t('status:plural.followed_users')}
        />
      </div>
    );
  }
}

const component = withTranslation()(FollowedUsersList);
export { component as FollowedUsersList };
