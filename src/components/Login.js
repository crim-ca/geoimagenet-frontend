import {Component} from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, withStyles} from '@material-ui/core';
import {UserInteractions} from '../domain/user-interactions.js';

const LoginContainer = withStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
})(props => {
    const {classes, children} = props;
    return <div className={classes.root}>{children}</div>;
});
const AccessButton = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            marginTop: values.gutterSmall,
        }
    };
})(Button);

/**
 * A regular login component that should notify user of login progress and redirect to the platform on sucess.
 */
export class Login extends Component {
    static propTypes = {
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
    };

    /**
     * Local storage for text inputs values before sending it to the user interactions services.
     * @private
     * @type {Object}
     * @property {String} user_name
     * @property {String} password
     * @property {String} provider_name=ziggurat Hardcoded to ziggurat (built in login provider for magpie) until we decide
     * to support other login providers.
     */
    state = {
        user_name: '',
        password: '',
        provider_name: 'ziggurat',
    };

    /**
     * Catch all change handler generation for user_name and password.
     * Takes the name of the property to change and returns a handler for that specific property.
     * @private
     * @param {String} key
     * @returns {Function}
     */
    handle_change = key => event => {
        this.setState({[key]: event.target.value});
    };

    /**
     * Send the current state to the form submission handler, and forget about it: completing the task and notifying the user
     * is within the UserInteraction's responsibility.
     * @private
     * @returns {Promise<void>}
     */
    send_login = async () => {
        await this.props.user_interactions.login_form_submission(this.state);
    };

    render() {
        return (
            <LoginContainer>
                <TextField label='Username'
                           id='user_name'
                           onChange={this.handle_change('user_name')}
                           value={this.state.user_name} />
                <TextField label='Password'
                           id='password'
                           type='password'
                           onChange={this.handle_change('password')}
                           value={this.state.password} />
                <AccessButton variant='contained'
                        color='primary'
                        onClick={this.send_login}
                        type='submit'>Access platform</AccessButton>
            </LoginContainer>
        );
    }
}
