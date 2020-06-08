// @flow strict
import { withStyles, Tooltip } from '@material-ui/core';

export const CustomTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
  },
}))(Tooltip);
