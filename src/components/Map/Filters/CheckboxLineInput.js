// @flow strict
import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { theme } from '../../../utils/react';

type Props = {
  uniqueId: string,
  checked: boolean,
  changeHandler: (event: {
    target: {
      checked: boolean
    }
  }) => void,
  label: string,
};

@observer
class CheckboxLineInput extends React.Component<Props> {
  render() {
    /*
     * Broke from convention because using withStyles here caused errors with tests
     * 'Filter components has a checked input by default' and 'Filter components unchecks the box'
     * by preventing Jest from accessing the checkbox input and claiming the component undefined.
     * In the end, was simpler to change how this component was styled.
     */
    const style = {
      common: {
        marginLeft: 'auto ',
      },
      filter_new: {
        color: `${theme.colors.new}`,
      },
      filter_pre_released: {
        color: `${theme.colors.pre_released}`,
      },
      filter_released: {
        color: `${theme.colors.released}`,
      },
      filter_review: {
        color: `${theme.colors.review}`,
      },
      filter_validated: {
        color: `${theme.colors.validated}`,
      },
      filter_rejected: {
        color: `${theme.colors.rejected}`,
      },
      filter_deleted: {
        color: `${theme.colors.deleted}`,
      },
    };

    const {
      uniqueId,
      checked,
      changeHandler,
      label,
    } = this.props;

    const commonCheckLineInput = (
      <>
        <input
          type="checkbox"
          id={uniqueId}
          checked={checked}
          onChange={changeHandler}
        />
        <label htmlFor={uniqueId}>
          <Typography
            style={{ cursor: 'pointer' }}
            variant="body2"
          >
            {label}
          </Typography>
        </label>
      </>
    );

    if (uniqueId in style) {
      return (
        <>
          {commonCheckLineInput}
          <FiberManualRecordIcon style={{ ...style[uniqueId], ...style.common }} />
        </>
      );
    }
    return (
      <>
        {commonCheckLineInput}
      </>
    );
  }
}
export { CheckboxLineInput };
