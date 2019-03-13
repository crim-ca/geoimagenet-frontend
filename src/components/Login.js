import {Component} from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, withStyles} from '@material-ui/core';
import {UserInteractions} from '../domain/user-interactions.js';

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',

    }
});

class Login extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
    };

    state = {
        user_name: '',
        password: '',
        provider_name: 'ziggurat',
    };

    handle_change = key => event => {
        this.setState({[key]: event.target.value});
    };

    send_login = async () => {
        await this.props.user_interactions.login_form_submission(this.state);
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.container}>
                <TextField label='Username'
                           id='user_name'
                           onChange={this.handle_change('user_name')}
                           value={this.state.user_name} />
                <TextField label='Password'
                           id='password'
                           type='password'
                           onChange={this.handle_change('password')}
                           value={this.state.password} />
                <Button variant='contained'
                        color='primary'
                        onClick={this.send_login}
                        type='submit'>Connect</Button>
            </div>
        );
    }
}

export default withStyles(styles)(Login);
