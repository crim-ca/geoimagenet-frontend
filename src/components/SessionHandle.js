// @flow strict
import React from 'react';
import { observer } from 'mobx-react';
import {
  withStyles,
  Paper,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import type { UserInteractions } from '../domain';
import type { GeoImageNetStore } from '../model/store/GeoImageNetStore';

const SessionHandlePaper = withStyles((theme) => {
  const { values } = theme;
  return {
    root: {
      padding: values.gutterSmall,
      display: 'grid',
      gridTemplateColumns: 'max-content min-content min-content',
      gridGap: values.gutterSmall,
      alignItems: 'center',
    },
  };
})(Paper);

const PresentationText = withStyles((theme) => {
  const { values } = theme;
  return {
    root: {
      marginRight: values.gutterSmall,
    },
  };
})(Typography);

const ClickableSpan = withStyles({
  root: {
    cursor: 'pointer',
  },
})((props) => {
  const { classes, children } = props;
  return <span className={classes.root}>{children}</span>;
});

type Props = {
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
};

/**
 * We want to have an indication of who the user is authenticated as.
 * This will eventually feature a way to change settings,
 * such as language, maybe default filters. There should be a logout button, redirecting to the home page, and a way
 * to change one's password.
 */
@observer
class SessionHandle extends React.Component<Props> {
  render() {
    const {
      geoImageNetStore: { user },
      userInteractions: { logout },
    } = this.props;

    if (!user) {
      return <CircularProgress />;
    }

    return (
      <SessionHandlePaper>
        <PresentationText>
          {`Hello ${user.name}.`}
        </PresentationText>
        <FontAwesomeIcon icon={faUserCog} className="fa-2x" />
        <ClickableSpan>
          <FontAwesomeIcon
            onClick={logout}
            icon={faSignOutAlt}
            className="fa-2x"
          />
        </ClickableSpan>
      </SessionHandlePaper>
    );
  }
}

export { SessionHandle };
