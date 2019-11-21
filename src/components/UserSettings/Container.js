// @flow strict

import React from 'react';
import type { User } from '../../model/entities';
import { UserInformation } from './UserInformation';
import { AddFollowedUserForm } from './AddFollowedUserForm';
import { FollowedUsersList } from './FollowedUsersList';
import type { UserInteractions } from '../../domain/user-interactions';
import type { FollowedUser } from '../../Types';
import { NotificationManager } from 'react-notifications';
import { captureException } from '@sentry/browser';
import { TFunction } from 'react-i18next';
import { withTranslation } from '../../utils';

type Props = {
  user: User,
  userInteractions: UserInteractions,
  t: TFunction,
};

class Container extends React.Component<Props> {
  save_followed_user_callback = (form_data: FollowedUser): Promise<boolean> => {
    const { t, userInteractions } = this.props;
    return new Promise((resolve) => {
      userInteractions.save_followed_user(form_data)
        .then(
          async () => {
            NotificationManager.success(t('settings:save_followed_users_success'));
            userInteractions.refresh_all_sources();
            resolve(true);
          },
          error => {
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

  remove_followed_user = async (id: number): Promise<void> => {
    const { t, userInteractions } = this.props;
    userInteractions.remove_followed_user(id)
      .then(
        () => {
          NotificationManager.success(t('settings:remove_followed_user_success'));
          userInteractions.refresh_all_sources();
        },
        error => {
          captureException(error);
          NotificationManager.error(t('settings:remove_followed_user_failure'));
        },
      );
  };

  verify_duplicate_id = (id: number): boolean => {
    return this.props.user.followed_users.some(followed_user => parseInt(followed_user.id, 10) === parseInt(id, 10));
  };

  render() {
    const { user } = this.props;
    return (
      <>
        <UserInformation user={user} />
        <AddFollowedUserForm
          save_user={this.save_followed_user_callback}
          id_already_exists={this.verify_duplicate_id}
        />
        <FollowedUsersList
          followed_users={user.followed_users}
          delete_user={this.remove_followed_user}
        />
      </>
    );
  }
}

const component = withTranslation()(Container);

export { component as Container };
