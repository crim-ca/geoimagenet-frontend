// @flow strict

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { ModelsTable } from './ModelsTable';
import { UploadForm } from './UploadForm';
import { BenchmarksTable } from './BenchmarksTable';

const Grid = withStyles(({ values }) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `${values.gutterMedium} 1fr minmax(300px, max-content) 1fr ${values.gutterMedium}`,
    gridTemplateRows: 'min-content',
  },
  content: {
    gridColumn: '3/4',
    display: 'grid',
    gridTemplateRows: 'min-content',
    gridGap: values.gutterSmall,
  }
}))(({ classes: { root, content }, children }) => (
  <div className={root}>
    <div className={content}>{children}</div>
  </div>
));

type Props = {
  model_upload_instructions_url: string,
};

export class Models extends Component<Props> {

  render() {
    return (
      <Grid>
        <UploadForm model_upload_instructions_url={this.props.model_upload_instructions_url} />
        <ModelsTable />
        <BenchmarksTable />
      </Grid>
    );
  }
}
