// @flow strict

import React from 'react';
import Typography from '@material-ui/core/Typography';

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

function CheckboxLineInput(props: Props) {
  const {
    uniqueId,
    checked,
    changeHandler,
    label,
  } = props;
  return (
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
}

export { CheckboxLineInput };
