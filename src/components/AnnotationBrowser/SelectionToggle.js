// @flow strict

import React from 'react';
import {observer} from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'react-apollo';

type Props = {
  selected: boolean,
  classes: {
    root: {},
  },
  toggle: () => void,
};

const style = {
  root: {
    '& > button': {
      width: '20px',
      height: '20px',
    },
    '& > .left.selected': {
      backgroundColor: 'green',
    },
    '& > .right.selected': {
      backgroundColor: 'red',
    },
  },
};

@observer
class SelectionToggle extends React.Component<Props> {
  render() {
    const { selected, classes: { root }, toggle } = this.props;
    return (
      <div className={root} onClick={toggle}>
        <button type="button" className={selected ? 'left selected' : 'left'} />
        <button type="button" className={selected ? 'right' : 'right selected'} />
      </div>
    );
  }
}

const component = compose(
  withStyles(style),
)(SelectionToggle);

export { component as SelectionToggle };
