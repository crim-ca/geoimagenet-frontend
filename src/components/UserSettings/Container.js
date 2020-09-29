// @flow strict

import React from 'react';
import { compose } from 'react-apollo';
import { NotificationManager } from 'react-notifications';
import { captureException } from '@sentry/browser';
import { TFunction } from 'react-i18next';
import type { User } from '../../model/entities';
import { UserInformation } from './UserInformation';
import { AddFollowedUserForm } from './AddFollowedUserForm';
import { FollowedUsersList } from './FollowedUsersList';
import { ChangePasswordForm } from './ChangePasswordForm';
import type { UserInteractions } from '../../domain/user-interactions';
import type { FollowedUser } from '../../Types';
import { withTranslation } from '../../utils';
import type { DataQueries } from '../../domain/data-queries';
import { withDataQueries } from '../../model/HOCs';

type Props = {
  user: User,
  userInteractions: UserInteractions,
  dataQueries: DataQueries,
  t: TFunction,
};

class Container extends React.Component<Props> {
  saveFollowedUserCallback = (formData: FollowedUser): Promise<boolean> => {
    const {
      t,
      userInteractions,
      user,
      dataQueries,
    } = this.props;
    return new Promise((resolve) => {
      dataQueries.persistFollowedUser([formData])
        .then(
          async () => {
            user.addFollowedUser(formData);
            NotificationManager.success(t('settings:save_followed_users_success'));
            userInteractions.refresh_all_sources();
            resolve(true);
          },
          (error) => {
            captureException(error);
            NotificationManager.error(t('settings:save_followed_users_failure'));
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

  persistRemoveUser = async (id: number): Promise<void> => {
    const {
      t,
      userInteractions,
      dataQueries,
      user,
    } = this.props;
    dataQueries.remove_followed_user(id)
      .then(
        () => {
          user.removeFollowedUser(id);
          NotificationManager.success(t('settings:remove_followed_user_success'));
          userInteractions.refresh_all_sources();
        },
        (error) => {
          captureException(error);
          NotificationManager.error(t('settings:remove_followed_user_failure'));
        },
      );
  };

  verify_duplicate_id = (id: number): boolean => this.props.user.followed_users.some((followed_user) => parseInt(followed_user.id, 10) === parseInt(id, 10));

  render() {
    const { user, dataQueries } = this.props;
    return (
      <React.Fragment>
        <UserInformation user={user} />
        <AddFollowedUserForm
          save_user={this.saveFollowedUserCallback}
          id_already_exists={this.verify_duplicate_id}
        />
        <FollowedUsersList
          followed_users={user.followed_users}
          delete_user={this.persistRemoveUser}
        />
        <ChangePasswordForm data_queries={dataQueries} />
      </React.Fragment>
    );
  }
}

const component = compose(
  withTranslation(),
  withDataQueries,
)(Container);

export { component as Container };
