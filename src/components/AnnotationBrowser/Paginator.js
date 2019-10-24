// @flow strict

import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { TFunction } from 'react-i18next'

import { withTranslation } from '../../utils'

import type { AnnotationBrowserStore } from '../../store/AnnotationBrowserStore'
import { compose } from 'react-apollo'

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
    }
  }
})
type Props = {
  page_number: number,
  total_pages: number,
  total_features: number,
  previous_page: () => void,
  next_page: () => void,
  classes: {
    root: {},
    buttons: {},
  },
  t: TFunction,
};

class Paginator extends React.Component<Props> {
  render() {
    const { classes: { root, buttons }, t } = this.props
    return (
      <div className={root}>
        <Typography variant='body2'>{this.props.total_features} annotations</Typography>
        <Typography variant='body2'>{t('annotations:pagination.page_info', {
          page_number: this.props.page_number,
          total_pages: this.props.total_pages,
        })}</Typography>
        <div className={buttons}>
          <Button
            color='primary'
            variant='contained'
            disabled={this.props.page_number === 1}
            onClick={this.props.previous_page}>{t('annotations:pagination.previous')}</Button>
          <Button
            color='primary'
            variant='contained'
            disabled={this.props.page_number === this.props.total_pages}
            onClick={this.props.next_page}>{t('annotations:pagination.next')}</Button>
        </div>
      </div>
    )
  }
}

const component = compose(
  withStyles(style),
  withTranslation(),
)(Paginator)

export { component as Paginator }
