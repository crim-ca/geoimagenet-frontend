// @flow strict

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = {
  value: number,
  checked: boolean,
  imageClass: string,
  classes: {
    root: {},
  },
  changeHandler: () => void,
};
/**
 * TODO if accessibility and using tab becomes a problem, uncomment these,
 * and find a way to have both the input visible but without the alignment issue in the eyes column
 * -moz-appearance: none;
 * -webkit-appearance: none;
 */
const style = {
  root: {
    '& input[type=checkbox]': {
      display: 'none',
    },
  },
};

@observer
class Checkbox extends Component<Props> {
  render() {
    const {
      classes: { root },
      imageClass,
      value,
      checked,
      changeHandler,
    } = this.props;
    return (
      <label className={`${imageClass} ${root}`}>
        <input
          type="checkbox"
          value={value}
          checked={checked}
          onChange={changeHandler}
        />
        <span />
      </label>
    );
  }
}

const component = compose(
  withStyles(style),
)(Checkbox);

export { component as Checkbox };
