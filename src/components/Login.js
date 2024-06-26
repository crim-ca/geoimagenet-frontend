// @flow strict
import React from 'react';
import { TextField, Button, withStyles } from '@material-ui/core';

import { withTranslation } from '../utils';

import type { UserInteractions } from '../domain/user-interactions.js';
import type { TFunction } from 'react-i18next';

const LoginContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
})(props => {
  const { classes, children } = props;
  return <div className={classes.root}>{children}</div>;
});
const AccessButton = withStyles(theme => {
  const { values } = theme;
  return {
    root: {
      marginTop: values.gutterSmall,
    }
  };
})(Button);

type Props = {
  userInteractions: UserInteractions,
  t: TFunction,
};
type State = {
  user_name: string,
  password: string,
  provider_name: string,
  key_listener: boolean,
};

/**
 * A regular login component that should notify user of login progress and redirect to the platform on sucess.
 */
class LoginComponent extends React.Component<Props, State> {

  /**
   * Local storage for text inputs values before sending it to the user interactions services.
   * provider_Name Hardcoded to ziggurat (built in login provider for magpie) until we decide
   * key_listener keeps track of the existence or not of the listener so we don't register a billion of them to support other login providers.
   */
  state = {
    user_name: '',
    password: '',
    provider_name: 'ziggurat',
    key_listener: false,
  };


  /**
   * Catch all change handler generation for name and password.
   * Takes the name of the property to change and returns a handler for that specific property.
   * @private
   * @param {String} key
   * @returns {Function}
   */
  handle_change = key => event => {
    this.setState({ [key]: event.target.value }, () => {
      if (!this.state.key_listener && this.there_are_values()) {
        this.listen_to_enter();
      } else if (this.state.key_listener && !this.there_are_values()) {
        this.stop_listening_to_enter();
      }
    });

  };

  /**
   * boolean for very small validation that there are values in the login form
   * @returns {boolean}
   */
  there_are_values = () => {
    return this.state.user_name.length > 0 && this.state.password.length > 0;
  };

  /**
   * declare the key_listener to be on so that we don't recreate the listener on each change
   */
  listen_to_enter = () => {
    this.setState({ key_listener: true }, () => {
      window.addEventListener('keydown', this.log_user_on_enter);
    });

  };

  /**
   * if we remove values, there is no need to continue launching login requests
   */
  stop_listening_to_enter = () => {
    this.setState({ key_listener: false }, () => {
      window.removeEventListener('keydown', this.log_user_on_enter);
    });
  };

  /**
   * "Enter" is the glorified key property being returned by the js keydown event
   * @param event
   * @returns {Promise<void>}
   */
  log_user_on_enter = async event => {
    if (event.key === 'Enter') {
      await this.send_login();
    }
  };

  /**
   * Possibly overkill since we would technically be reloading the page, but removing the listener when unmounting the component just because.
   */
  componentWillUnmount() {
    this.stop_listening_to_enter();
  }

  /**
   * Send the current state to the form submission handler, and forget about it: completing the task and notifying the user
   * is within the UserInteraction's responsibility.
   * @private
   * @returns {Promise<void>}
   */
  send_login = async () => {
    await this.props.userInteractions.login_form_submission(this.state);
  };

  render() {
    const { t } = this.props;
    return (
      <LoginContainer>
        <TextField label={t('login:username')}
                   id='user_name'
                   onChange={this.handle_change('user_name')}
                   value={this.state.user_name} />
        <TextField label={t('login:password')}
                   id='password'
                   type='password'
                   onChange={this.handle_change('password')}
                   value={this.state.password} />
        <AccessButton variant='contained'
                      color='primary'
                      onClick={this.send_login}
                      type='submit'>{t('login:access_platform')}</AccessButton>
      </LoginContainer>
    );
  }
}

const Login = withTranslation()(LoginComponent);
export { Login };
