import React, {Component} from 'react';
import {Link, withStyles} from '@material-ui/core';

const MenuLink = withStyles(theme => ({
    root: {
        padding: `0 ${theme.values.gutterSmall}`,
    }
}))(Link);

const MenuContainerDiv = withStyles({
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})((props) => {
    const {classes, children} = props;
    return <div className={classes.container}>{children}</div>;
});


/**
 * A menu centering items using Links from material. Should be placed at the top of each logged pages.
 */
export class Menu extends Component {

    /**
     * Defines the different menus that can be shown when logged in
     * @todo bring back model and help when we have an idea what to put in there
     * @private
     * @type {{title: string, href: string}[]}
     */
    static menus = [
        {title: 'Home', href: '/'},
        {title: 'Platform', href: '/platform'},
        {title: 'Dataset', href: '/datasets'},
        //{title: 'Model', href: '/models'},
        //{title: 'Help', href: '/help'},
        {title: 'Contact', href: 'mailto:(contact@geoimagenet.crim.ca)'},
    ];

    render() {
        const current_url = window.location.pathname;
        return (
            <MenuContainerDiv>
                {Menu.menus.map((menu, i) => <MenuLink href={menu.href}
                                                       key={i}
                                                       underline={menu.href === current_url ? 'always' : 'hover'}
                                                       color={menu.href === current_url ? 'textPrimary' : 'textSecondary'}>{menu.title}</MenuLink>
                )}
            </MenuContainerDiv>
        );
    }
}
