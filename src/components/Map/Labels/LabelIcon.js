// @flow strict

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Label from '../../../img/icons/label_filled.svg';

const styles = {
  icon: {
    width: 64,
    height: 64,
    paddingTop: 4,
    paddingLeft: 8,
  },
};

export const LabelIcon = () => (
  <SvgIcon
    viewBox="0 0 768 768"
    style={styles.icon}
    component={Label}
  />
);
