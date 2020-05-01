// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'react-apollo';
import { Button, ButtonGroup } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

type Props = {
  selected: boolean,
  classes: {
    root: {},
  },
  toggle: () => void,
};

const style = {
  root: {
    '& > .left.selected': {
      backgroundColor: 'green',
      color: 'white',
    },
    '& > .right.selected': {
      backgroundColor: 'red',
      color: 'white',
    },
    '& > .other': {
      backgroundColor: 'GhostWhite',
      color: 'grey',
    },
  },
};

@observer
class SelectionToggle extends React.Component<Props> {
  render() {
    const { selected, classes: { root }, toggle } = this.props;
    return (
      <ButtonGroup className={root} onClick={toggle}>
        <Button size="small" className={selected ? 'left selected' : 'other'}><CheckCircleIcon /></Button>
        <Button size="small" className={selected ? 'other' : 'right selected'}><CancelIcon /></Button>
      </ButtonGroup>
    );
  }
}

const component = compose(
  withStyles(style),
)(SelectionToggle);

export { component as SelectionToggle };
