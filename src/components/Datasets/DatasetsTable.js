// @flow strict
import React from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import { tableIcons } from '../../utils/react';
import { graphql } from 'react-apollo';
import { Link } from '@material-ui/core';
import { DATASETS } from '../../domain/graphql_queries';

function DatasetsTableComponent({ data: { datasets }, ml_endpoint }) {

  const render_download_link = rowData => (
    <Link
      href={`${ml_endpoint}/datasets/${rowData.id}/download`}
      target='_blank'>Download</Link>
  );

  return (
    <MaterialTable
      title='Datasets'
      icons={tableIcons}
      columns={[
        {
          title: '',
          field: 'id',
          render: render_download_link
        },
        {
          title: 'Name',
          field: 'name'
        },
        {
          title: 'Created',
          field: 'created'
        },
        {
          title: 'Classes',
          field: 'classes_count'
        },
        {
          title: 'Annotations',
          field: 'annotations_count'
        },
      ]}
      data={datasets}
    />
  );
}

DatasetsTableComponent.propTypes = {
  data: PropTypes.object.isRequired,
  ml_endpoint: PropTypes.string.isRequired,
};

export const DatasetsTable = graphql(DATASETS)(DatasetsTableComponent);
