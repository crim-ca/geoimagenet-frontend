// @flow strict

import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import { withTranslation } from '../../utils';

const style = (theme) => ({
  root: {
    margin: `${theme.values.gutterMedium} 0`,
  },
  buttons: {
    margin: `${theme.values.gutterMedium} 0`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    '& > *:not(:first-child)': {
      marginLeft: theme.values.gutterMedium,
    },
  },
});
type Props = {
  pageNumber: number,
  totalPages: number,
  totalFeatures: number,
  previousPage: () => void,
  nextPage: () => void,
  classes: {
    root: {},
    buttons: {},
  },
  t: TFunction,
};

/**
 * Here I was tempted to make AnnotationBrowserStore a dependency of the Paginator
 * instead of passing all the values as scalars to reduce the number of properties.
 * However, that would prevent the Paginator to be used in any other context.
 * So I decided to keep it generic, as it is right now.
 */
function Paginator(props: Props) {
  const {
    classes: {
      root,
      buttons,
    },
    t,
    pageNumber,
    nextPage,
    previousPage,
    totalFeatures,
    totalPages,
  } = props;
  return (
    <div className={root}>
      <Typography variant="body2">{`${totalFeatures} annotations`}</Typography>
      <Typography variant="body2">
        {t('annotations:pagination.page_info', {
          pageNumber,
          totalPages,
        })}
      </Typography>
      <div className={buttons}>
        <Button
          color="primary"
          variant="contained"
          disabled={pageNumber === 1}
          onClick={previousPage}
        >
          {t('annotations:pagination.previous')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={pageNumber === totalPages}
          onClick={nextPage}
        >
          {t('annotations:pagination.next')}
        </Button>
      </div>
    </div>
  );
}

const component = compose(
  withStyles(style),
  withTranslation(),
)(Paginator);

export { component as Paginator };
