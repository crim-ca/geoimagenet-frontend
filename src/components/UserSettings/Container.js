// @flow strict

import React from 'react';
import { compose } from 'react-apollo';
import { NotificationManager } from 'react-notifications';
import { captureException } from '@sentry/browser';
import { TFunction } from 'react-i18next';

import { withTranslation } from '../../utils';
import { UserInformation } from './UserInformation';
import { AddFollowedUserForm } from './AddFollowedUserForm';
import { FollowedUsersList } from './FollowedUsersList';
import { ChangePasswordForm } from './ChangePasswordForm';
import { BatchUserCreationForm } from './BatchUserCreationForm';

import type { User } from '../../model/entities';
import type { UserInteractions } from '../../domain/user-interactions';
import type { FollowedUser } from '../../Types';
import type { DataQueries } from '../../domain/data-queries';
import type { UserInterfaceStore } from "../../model/store/UserInterfaceStore";

import { withDataQueries, withUserInterfaceStore } from '../../model/HOCs';
import withStyles from "@material-ui/core/styles/withStyles";

type Props = {
  user: User,
  userInteractions: UserInteractions,
  dataQueries: DataQueries,
  uiStore: UserInterfaceStore,
  t: TFunction,
};

class Container extends React.Component<Props> {


  constructor(props: P, context: any) {
    super(props, context);
    const { dataQueries, uiStore, t } = props;
    dataQueries.fetch_available_groups()
      .then(magpie_groups => {
        uiStore.setAvailableGroups(magpie_groups);
      })
      .catch(() => {
        NotificationManager.warning(t("settings:fetch_available_groups_error"));
      });
  }

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
    const { user, dataQueries, classes} = this.props;

    return (
      <section className={classes.section}>
        <UserInformation user={user} />
        <AddFollowedUserForm
          save_user={this.saveFollowedUserCallback}
          id_already_exists={this.verify_duplicate_id}
        />
        <FollowedUsersList
          followed_users={user.followed_users}
          delete_user={this.persistRemoveUser}
        />
        <BatchUserCreationForm />
        <ChangePasswordForm data_queries={dataQueries} />
      </section>
    );
  }
}

const component = compose(
  withTranslation(),
  withStyles(theme => ({
    section: {
      display: "grid",
      gridTemplateColumns: '1fr',
      gridGap: theme.values.gutterMedium,
    }
  })),
  withDataQueries,
  withUserInterfaceStore,
)(Container);

export { component as Container };
