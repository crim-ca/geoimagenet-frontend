// @flow strict
import React from 'react';
import { withStyles } from '@material-ui/core';
import MaterialTable from 'material-table';
import { tableIcons } from '../utils/react';
import { PUBLIC_BENCHMARKS } from '../domain/graphql_queries';
import { graphql } from 'react-apollo';

const Grid = withStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr max-content 1fr',
  },
  content: {
    gridColumn: '2/3',
  }
})(({ classes, children }) => (
  <div className={classes.root}>
    <div className={classes.content}>{children}</div>
  </div>
));

type Props = {
  data: {
    public_benchmarks: []
  }
};

class BenchmarksComponent extends React.Component<Props> {

  render() {
    const { data: { public_benchmarks } } = this.props;

    return (
      <Grid>
        <MaterialTable
          title='Public Benchmarks'
          icons={tableIcons}
          columns={[
            {
              title: 'Owner',
              field: 'owner'
            },
            {
              title: 'Model',
              field: 'model.id'
            },
            {
              title: 'Dataset',
              field: 'dataset.id'
            },
            {
              title: 'Model upload',
              field: 'model.created'
            },
            {
              title: 'Test completed',
              field: 'job.finished'
            },
            {
              title: 'Top 1 accuracy',
              field: 'result.metrics.top_1_accuracy'
            },
            {
              title: 'Top 5 accuracy',
              field: 'result.metrics.top_5_accuracy'
            },
          ]}
          data={public_benchmarks}
        />
      </Grid>
    );
  }
}

export const Benchmarks = graphql(PUBLIC_BENCHMARKS)(BenchmarksComponent);
