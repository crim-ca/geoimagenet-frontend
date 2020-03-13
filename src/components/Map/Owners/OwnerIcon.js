// @flow strict

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Owner from '../../../img/icons/owner.svg';

const styles = {
  icon: {
    width: 64,
    height: 64,
    'padding-top': 10,
    'padding-left': 14,
  },
};

export const OwnerIcon = () => (
  <SvgIcon
    viewBox="0 0 448 448"
    style={styles.icon}
    component={Owner}
  />
);
