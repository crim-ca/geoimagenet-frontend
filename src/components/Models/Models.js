// @flow strict

import React, { Component } from 'react';
import { ModelsTable } from './ModelsTable';
import { UploadForm } from './UploadForm';
import { BenchmarksTable } from './BenchmarksTable';
import { OneColumnLayout } from '../OneColumnLayout';

type Props = {
  model_upload_instructions_url: string,
};

export class Models extends Component<Props> {
  render() {
    return (
      <OneColumnLayout>
        <UploadForm model_upload_instructions_url={this.props.model_upload_instructions_url} />
        <ModelsTable />
        <BenchmarksTable />
      </OneColumnLayout>
    );
  }
}
