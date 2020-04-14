// @flow strict
import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import withStyles from '@material-ui/core/styles/withStyles';

const style = (theme) => {
  const { colors } = theme;
  return {
    filter_new: {
      color: `${colors.new}`,
    },
    filter_pre_released: {
      color: `${colors.pre_released}`,
    },
    filter_released: {
      color: `${colors.released}`,
    },
    filter_review: {
      color: `${colors.review}`,
    },
    filter_validated: {
      color: `${colors.validated}`,
    },
    filter_rejected: {
      color: `${colors.rejected}`,
    },
    filter_deleted: {
      color: `${colors.deleted}`,
    },
  };
};

type Props = {
  uniqueId: string,
  checked: boolean,
  changeHandler: (event: {
    target: {
      checked: boolean
    }
  }) => void,
  label: string,
  classes: {
    filter_new: string,
    filter_pre_released: string,
    filter_released: string,
    filter_review: string,
    filter_validated: string,
    filter_rejected: string,
    filter_deleted: string,
  },
};

@observer
class CheckboxLineInput extends React.Component<Props> {
  render() {
    const {
      uniqueId,
      checked,
      changeHandler,
      label,
      classes,
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

    if (uniqueId in classes) {
      return (
        <>
          {commonCheckLineInput}
          <FiberManualRecordIcon
            className={classes[uniqueId]}
            style={{ marginLeft: 'auto' }}
          />
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
const component = withStyles(style)(CheckboxLineInput);
export { component as CheckboxLineInput };
