// @flow strict

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Owner from '../../../img/icons/owner.svg';

const styles = {
  icon: {
    width: 128,
    height: 128,
    'padding-bottom': 12,
    'padding-left': 46,
  },
};

export const OwnerIcon = () => (
  <SvgIcon
    viewBox="0 0 768 768"
    style={styles.icon}
    component={Owner}
  />
);
