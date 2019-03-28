import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {withStyles, Paper, CircularProgress, Typography, Link} from '@material-ui/core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserCog, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

const SessionHandlePaper = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            display: 'grid',
            gridTemplateColumns: 'max-content min-content min-content',
            gridGap: values.gutterSmall,
            alignItems: 'center',
        },
    };
})(Paper);

const PresentationText = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            marginRight: values.gutterSmall
        }
    };
})(Typography);

/**
 * We want to have an indication of who the user is authenticated as. This will eventually feature a way to change settings,
 * such as language, maybe default filters. There should be a logout button, redirecting to the home page, and a way
 * to change one's password.
 */
@observer
class SessionHandle extends Component {

    render() {
        /**
         * @type {User} logged_user
         */
        const logged_user = this.props.state_proxy.logged_user;

        if (!logged_user) {
            return <CircularProgress />;
        }

        return (
            <SessionHandlePaper>
                <PresentationText>Hello {logged_user.user_name}.</PresentationText>
                <FontAwesomeIcon icon={faUserCog} className='fa-2x' />
                <Link href='/'><FontAwesomeIcon icon={faSignOutAlt} className='fa-2x' /></Link>
            </SessionHandlePaper>
        );
    }
}

SessionHandle.propTypes = {
    state_proxy: PropTypes.object.isRequired
};

export {SessionHandle};
