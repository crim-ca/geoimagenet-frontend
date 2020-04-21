// @flow strict

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Filter from '../../../img/icons/filter.svg';

const styles = {
  icon: {
    width: 64,
    height: 64,
    paddingTop: 16,
    paddingLeft: 12,
  },
};

export const FilterIcon = () => (
  <SvgIcon
    viewBox="0 0 768 768"
    style={styles.icon}
    component={Filter}
  />
);
