// @flow strict
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
import {Link, withRouter} from 'react-router-dom';

import {SessionHandle} from './SessionHandle.js';
import type {UserInteractions} from '../domain';
import type {GeoImageNetStore} from "../store/GeoImageNetStore";
import {compose} from "react-apollo";

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

const style = theme => ({
    link: {
        padding: `0 ${theme.values.gutterSmall}`,
    },
    selected: {
        textDecoration: 'underline',
    },
});

type Props = {
    state_proxy: GeoImageNetStore,
    user_interactions: UserInteractions,
    contact_email: string,
    location: { pathname: string },
    classes: {link: string, selected: ''},
};

/**
 * A menu centering items using Links from material. Should be placed at the top of each logged pages.
 */
class Menu extends Component<Props> {


    /**
     * Defines the different menus that can be shown when logged in
     * @todo bring back help when we have an idea what to put in there
     */
    menus = [
        {title: 'Home', href: '/'},
        {title: 'Platform', href: '/platform'},
        {title: 'Datasets', href: '/datasets'},
        {title: 'Models', href: '/models'},
        {title: 'Benchmarks', href: '/benchmarks'},
        //{title: 'Help', href: '/help'},
        {title: 'Contact', href: `mailto:${this.props.contact_email}`},
    ];

    render() {
        const {state_proxy, user_interactions, location, classes} = this.props;
        const current_url = location.pathname;
        return (
            <MenuContainerDiv>
                {this.menus.map((menu, i) => <Link to={menu.href}
                                                   key={i}
                                                   className={menu.href === current_url ? `${classes.link} ${classes.selected}` : classes.link}>{menu.title}</Link>
                )}
                <SessionHandle state_proxy={state_proxy} user_interactions={user_interactions} />
            </MenuContainerDiv>
        );
    }
}

const component = compose(
    withRouter,
    withStyles(style),
)(Menu);
export {component as Menu};
