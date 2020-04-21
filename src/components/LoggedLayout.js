// @flow strict
import React from 'react';
import { withStyles } from '@material-ui/core';
import { NotificationContainer } from 'react-notifications';
import { Menu } from './Menu';
import type { UserInteractions } from '../domain';
import type { GeoImageNetStore } from '../model/store/GeoImageNetStore';

const LayoutGrid = withStyles((theme) => {
  const { values } = theme;
  return {
    grid: {
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: `${values.heightAppBar} calc(100% - ${values.heightAppBar})`,
    },
  };
})((props) => {
  const { classes, children } = props;
  return <div className={classes.grid}>{children}</div>;
});

const Bottom = withStyles({
  root: {
    gridRow: '2/3',
    gridColumn: '1/2',
  },
})(({ classes, children }) => (<div className={classes.root}>{children}</div>));

const Top = withStyles({
  root: {
    gridRow: '1/2',
    gridColumn: '1/2',
  },
})(({ classes, children }) => (<div className={classes.root}>{children}</div>));

type Props = {
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
  children: {},
};

/**
 * The LoggedLayout should be used for every top level page that is behind the login.
 * It will put a menu on top, and the children at the bottom.
 * Each bottom component is responsible for setting its bottom section's layout.
 */
class LoggedLayout extends React.Component<Props> {
  render() {
    const { children, geoImageNetStore, userInteractions } = this.props;
    /**
     * Wrapping both menu and children in divs so that the grid is respected whatever the other structures are.
     */
    return (
      <LayoutGrid>
        <Top>
          <Menu
            geoImageNetStore={geoImageNetStore}
            userInteractions={userInteractions}
            contact_email={CONTACT_EMAIL}
          />
        </Top>
        <Bottom>
          {children}
          <NotificationContainer />
        </Bottom>
      </LayoutGrid>
    );
  }
}

export { LoggedLayout };
