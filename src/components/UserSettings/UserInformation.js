// @flow strict

import React from 'react'
import { User } from '../../domain/entities'
import { withTranslation } from '../../utils'
import { TFunction } from 'react-i18next'

type Props = {
  user: User,
  t: TFunction,
};

class UserInformation extends React.Component<Props> {
  render() {
    const { user, t } = this.props
    return (
      <table>
        <tbody>
        <tr>
          <th>{t('settings:username')}:</th>
          <td>{user.user_name}</td>
        </tr>
        <tr>
          <th>{t('settings:password')}:</th>
          <td>********</td>
        </tr>
        <tr>
          <th>{t('settings:unique_id')}:</th>
          <td>{user.id}</td>
        </tr>
        </tbody>
      </table>
    )
  }
}

const component = withTranslation()(UserInformation)

export { component as UserInformation }
