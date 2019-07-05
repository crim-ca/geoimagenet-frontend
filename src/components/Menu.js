import React, {Component} from 'react';
import {Link, withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';

import {SessionHandle} from './SessionHandle.js';
import {UserInteractions} from '../domain';

const MenuLink = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            padding: `0 ${values.gutterSmall}`,
        }
    };
})(Link);

const MenuContainerDiv = withStyles(theme => {
    const {values} = theme;
    return {
        container: {
            padding: `0 ${values.gutterSmall}`,
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr repeat(6, auto) 1fr',
            justifyItems: 'right',
            alignItems: 'center',
            '& > :nth-child(1)': {
                gridColumnStart: 2,
            }
        }
    };
})((props) => {
    const {classes, children} = props;
    return <div className={classes.container}>{children}</div>;
});


/**
 * A menu centering items using Links from material. Should be placed at the top of each logged pages.
 */
class Menu extends Component {

    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
        contact_email: PropTypes.string.isRequired,
    };

    /**
     * Defines the different menus that can be shown when logged in
     * @todo bring back help when we have an idea what to put in there
     * @private
     * @type {{title: string, href: string}[]}
     */
    menus = [
        {title: 'Home', href: '/'},
        {title: 'Platform', href: '/platform'},
        {title: 'Dataset', href: '/datasets'},
        {title: 'Model', href: '/models'},
        {title: 'Benchmarks', href: '/benchmarks'},
        //{title: 'Help', href: '/help'},
        {title: 'Contact', href: `mailto:${this.props.contact_email}`},
    ];

    render() {
        const current_url = window.location.pathname;
        const {state_proxy, user_interactions} = this.props;
        return (
            <MenuContainerDiv>
                {this.menus.map((menu, i) => <MenuLink href={menu.href}
                                                       key={i}
                                                       underline={menu.href === current_url ? 'always' : 'hover'}
                                                       color={menu.href === current_url ? 'textPrimary' : 'textSecondary'}>{menu.title}</MenuLink>
                )}
                <SessionHandle state_proxy={state_proxy} user_interactions={user_interactions} />
            </MenuContainerDiv>
        );
    }
}

export {Menu};
