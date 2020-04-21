// @flow strict
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { SessionHandle } from './SessionHandle';
import type { UserInteractions } from '../domain';
import type { GeoImageNetStore } from '../model/store/GeoImageNetStore';

const MenuContainerDiv = withStyles((theme) => {
  const { values, palette } = theme;
  return {
    container: {
      backgroundColor: `${palette.primary.main}`,
      color: 'white',
      padding: `0 ${values.gutterSmall}`,
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr repeat(6, auto) 1fr',
      gridTemplateRows: `${values.heightAppBar} calc(100% - ${values.heightAppBar})`,
      justifyItems: 'right',
      alignItems: 'center',
      '& > :nth-child(1)': {
        gridColumnStart: 2,
      },
    },
  };
})((props) => {
  const { classes, children } = props;
  return <div className={classes.container}>{children}</div>;
});

const style = (theme) => ({
  link: {
    padding: `0 ${theme.values.gutterSmall}`,
    fontSize: '24px',
    alignItems: 'center',
  },
  selected: {
    fontSize: '24px',
    alignItems: 'center',
    fontWeight: 'bold',
  },
});

type Props = {
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
  contact_email: string,
  location: { pathname: string },
  classes: { link: string, selected: '' },
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
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Map',
      href: '/platform',
    },
    {
      title: 'Datasets',
      href: '/datasets',
    },
    {
      title: 'Models',
      href: '/models',
    },
    {
      title: 'Benchmark',
      href: '/benchmarks',
    },
  ];

  render() {
    const {
      geoImageNetStore, userInteractions, location, classes,
    } = this.props;
    const current_url = location.pathname;

    // Contact removed from Menu list and added as a simple <a href=''> element because <Link> with mailto doesn't work
    return (
      <MenuContainerDiv>
        {this.menus.map((menu, i) => (
          <Link
            to={menu.href}
            key={i}
            className={menu.href === current_url ? `${classes.link} ${classes.selected}` : classes.link}
          >
            {menu.href === current_url ? `- ${menu.title} -` : menu.title}
          </Link>
        ))}
        <a href={`mailto:${this.props.contact_email}`} className={classes.link}>Contact</a>
        <SessionHandle geoImageNetStore={geoImageNetStore} userInteractions={userInteractions} />
      </MenuContainerDiv>
    );
  }
}

const component = compose(
  withRouter,
  withStyles(style),
)(Menu);
export { component as Menu };
