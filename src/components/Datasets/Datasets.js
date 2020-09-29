// @flow strict
import React from 'react';
import { observer } from 'mobx-react';

import { DatasetsTable } from './DatasetsTable';
import { DatasetCreationJobsTable } from './DatasetCreationJobsTable';
import { DATASETS, WRITE } from '../../constants.js';
import {OneColumnLayout} from '../OneColumnLayout';

import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';

type Props = {
  geoImageNetStore: GeoImageNetStore,
};

@observer
class Datasets extends React.Component<Props> {

  render() {
    const { acl } = this.props.geoImageNetStore;
    return (
      <OneColumnLayout>
        <DatasetsTable ml_endpoint={ML_ENDPOINT} />
        {acl.can(WRITE, DATASETS)
          ? (
            <React.Fragment>
              <DatasetCreationJobsTable />
            </React.Fragment>
          )
          : null
        }
      </OneColumnLayout>
    );
  }
}

export { Datasets };
